// Phase 3: Minimal SQLite-backed API for local dev/testing
#include <iostream>
#include <vector>
#include <string>
#include <mutex>
#include <sstream>
#include <cctype>
#include <fstream>
#include <sys/stat.h>
#include <sys/types.h>
#include <dirent.h>
#include <unordered_map>
#include <set>
#include <sqlite3.h>
#include "httplib.h"

static std::mutex db_mutex;
static sqlite3* db = nullptr;

static int open_db(const std::string &path) {
    int rc = sqlite3_open(path.c_str(), &db);
    if (rc != SQLITE_OK) return rc;
    const char* ddl_chapters = "CREATE TABLE IF NOT EXISTS chapters (id TEXT PRIMARY KEY, data TEXT NOT NULL);";
    const char* ddl_scenes   = "CREATE TABLE IF NOT EXISTS scenes (id TEXT PRIMARY KEY, data TEXT NOT NULL);";
    char* errmsg = nullptr;
    if (sqlite3_exec(db, ddl_chapters, nullptr, nullptr, &errmsg) != SQLITE_OK) {
        std::cerr << "DB error: " << errmsg << std::endl;
        sqlite3_free(errmsg);
    }
    if (sqlite3_exec(db, ddl_scenes, nullptr, nullptr, &errmsg) != SQLITE_OK) {
        std::cerr << "DB error: " << errmsg << std::endl;
        sqlite3_free(errmsg);
    }
    return SQLITE_OK;
}

// Extremely naive JSON extractor for string field values: "key":"value"
// Assumes double quotes and no escaped quotes in value.
static std::string json_get_string_field(const std::string &json, const std::string &key) {
    std::string pat = "\"" + key + "\"";
    size_t p = json.find(pat);
    if (p == std::string::npos) return "";
    p = json.find(':', p);
    if (p == std::string::npos) return "";
    p = json.find('"', p);
    if (p == std::string::npos) return "";
    size_t q = json.find('"', p + 1);
    if (q == std::string::npos) return "";
    return json.substr(p + 1, q - (p + 1));
}

static std::string json_array_from_rows(sqlite3_stmt* stmt) {
    std::ostringstream oss;
    oss << "[";
    bool first = true;
    while (sqlite3_step(stmt) == SQLITE_ROW) {
        const unsigned char* data = sqlite3_column_text(stmt, 0);
        if (!first) oss << ",";
        first = false;
        oss << (data ? reinterpret_cast<const char*>(data) : "null");
    }
    oss << "]";
    return oss.str();
}

static void upsert_row(const std::string &table, const std::string &id, const std::string &data, httplib::Response &res) {
    if (id.empty() || data.empty()) {
        res.status = 400;
        res.set_content("{\"message\":\"Missing id or body\"}", "application/json");
        return;
    }
    std::lock_guard<std::mutex> lock(db_mutex);
    sqlite3_stmt* stmt = nullptr;
    std::string sql = "INSERT INTO " + table + " (id, data) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET data=excluded.data";
    if (sqlite3_prepare_v2(db, sql.c_str(), -1, &stmt, nullptr) != SQLITE_OK) {
        res.status = 500;
        res.set_content("{\"message\":\"DB prepare failed\"}", "application/json");
        return;
    }
    sqlite3_bind_text(stmt, 1, id.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 2, data.c_str(), -1, SQLITE_TRANSIENT);
    if (sqlite3_step(stmt) != SQLITE_DONE) {
        sqlite3_finalize(stmt);
        res.status = 500;
        res.set_content("{\"message\":\"DB write failed\"}", "application/json");
        return;
    }
    sqlite3_finalize(stmt);
    res.set_content(data, "application/json");
}

static bool is_valid_c_identifier(const std::string &s) {
    if (s.empty() || !(std::isalpha(s[0]) || s[0] == '_')) return false;
    for (char c : s) {
        if (!(std::isalnum(c) || c == '_')) return false;
    }
    return true;
}

static std::string escape_c_string(const std::string &s) {
    std::string out;
    out.reserve(s.size() * 2);
    for (char c : s) {
        switch (c) {
            case '\\': out += "\\\\"; break;
            case '"': out += "\\\""; break;
            case '\n': out += "\\n"; break;
            case '\t': out += "\\t"; break;
            case '\r': /* skip */ break;
            default: out += c; break;
        }
    }
    return out;
}

// --- Minimal JSON helpers (naive) ---
static std::string get_string_in(const std::string &obj, const std::string &key) {
    std::string pat = "\"" + key + "\"";
    size_t p = obj.find(pat);
    if (p == std::string::npos) return "";
    p = obj.find(':', p);
    if (p == std::string::npos) return "";
    // skip spaces
    while (p < obj.size() && (obj[p] == ':' || obj[p] == ' ')) p++;
    if (p >= obj.size() || obj[p] != '"') return "";
    size_t q = obj.find('"', p + 1);
    if (q == std::string::npos) return "";
    return obj.substr(p + 1, q - (p + 1));
}

static bool get_bool_in(const std::string &obj, const std::string &key, bool defval = true) {
    std::string pat = "\"" + key + "\"";
    size_t p = obj.find(pat);
    if (p == std::string::npos) return defval;
    p = obj.find(':', p);
    if (p == std::string::npos) return defval;
    while (p < obj.size() && (obj[p] == ':' || obj[p] == ' ')) p++;
    if (obj.compare(p, 4, "true") == 0) return true;
    if (obj.compare(p, 5, "false") == 0) return false;
    return defval;
}

static std::string get_raw_in(const std::string &obj, const std::string &key) {
    std::string pat = "\"" + key + "\"";
    size_t p = obj.find(pat);
    if (p == std::string::npos) return "";
    p = obj.find(':', p);
    if (p == std::string::npos) return "";
    p++;
    while (p < obj.size() && (obj[p] == ' ')) p++;
    // if string
    if (p < obj.size() && obj[p] == '"') {
        size_t q = obj.find('"', p + 1);
        if (q == std::string::npos) return "";
        return obj.substr(p + 1, q - (p + 1));
    }
    // else until comma or end brace
    size_t q = p;
    while (q < obj.size() && obj[q] != ',' && obj[q] != '}' && obj[q] != '\n') q++;
    return obj.substr(p, q - p);
}

static std::string extract_array(const std::string &json, const std::string &key) {
    std::string pat = "\"" + key + "\"";
    size_t p = json.find(pat);
    if (p == std::string::npos) return "";
    p = json.find('[', p);
    if (p == std::string::npos) return "";
    int depth = 0;
    size_t start = p;
    for (size_t i = p; i < json.size(); ++i) {
        if (json[i] == '[') depth++;
        else if (json[i] == ']') {
            depth--;
            if (depth == 0) {
                return json.substr(start, i - start + 1);
            }
        }
    }
    return "";
}

static std::vector<std::string> split_top_level_objects(const std::string &arrayStr) {
    std::vector<std::string> objs;
    int depth = 0;
    bool in_array = false;
    size_t cur_start = std::string::npos;
    for (size_t i = 0; i < arrayStr.size(); ++i) {
        char c = arrayStr[i];
        if (!in_array) {
            if (c == '[') in_array = true;
            continue;
        }
        if (c == '{') {
            if (depth == 0) cur_start = i;
            depth++;
        } else if (c == '}') {
            depth--;
            if (depth == 0 && cur_start != std::string::npos) {
                objs.push_back(arrayStr.substr(cur_start, i - cur_start + 1));
                cur_start = std::string::npos;
            }
        }
    }
    return objs;
}

static std::string generate_scene_code_from_json(const std::string &sceneId, const std::string &chapterId, const std::string &json) {
    std::string sceneText = get_string_in(json, "sceneText");
    // Parse choices
    std::vector<std::tuple<std::string, std::string, bool>> choices; // text, nextScene, enabled
    std::string choicesArr = extract_array(json, "choices");
    if (!choicesArr.empty()) {
        for (const auto &obj : split_top_level_objects(choicesArr)) {
            std::string text = get_string_in(obj, "text");
            std::string next = get_string_in(obj, "nextScene");
            bool en = get_bool_in(obj, "enabled", true);
            if (!text.empty()) choices.emplace_back(text, next, en);
        }
    }
    // Parse state changes
    struct State { std::string var, op, val; };
    std::vector<State> states;
    std::string statesArr = extract_array(json, "stateChanges");
    if (!statesArr.empty()) {
        for (const auto &obj : split_top_level_objects(statesArr)) {
            State s;
            s.var = get_string_in(obj, "variable");
            s.op = get_string_in(obj, "operator");
            s.val = get_raw_in(obj, "value");
            if (!s.var.empty() && !s.op.empty() && !s.val.empty()) states.push_back(s);
        }
    }

    std::ostringstream oss;
    oss << "#include <loke/scene.h>\n";
    if (!chapterId.empty()) {
        oss << "#include \"" << chapterId << ".h\"\n";
    }
    oss << "\nvoid " << sceneId << "(GameState* state) {\n";
    oss << "    SceneContext* ctx = get_current_context();\n";
    // State changes first
    if (!states.empty()) {
        oss << "    // State modifications\n";
        for (const auto &st : states) {
            oss << "    state->" << st.var << " " << st.op << " " << st.val << ";\n";
        }
    }
    if (!sceneText.empty()) {
        oss << "    scene_set_text(ctx, \"" << escape_c_string(sceneText) << "\");\n";
    }
    if (!choices.empty()) {
        for (const auto &c : choices) {
            const std::string &t = std::get<0>(c);
            const std::string &n = std::get<1>(c);
            bool e = std::get<2>(c);
            oss << "    scene_add_option(ctx, \"" << escape_c_string(t) << "\", " << (n.empty()? "NULL" : n) << ", " << (e?"true":"false") << ");\n";
        }
    } else {
        // Default option if none provided
        oss << "    scene_add_option(ctx, \"Continue\", NULL, true);\n";
    }
    oss << "}\n";
    return oss.str();
}

static std::string generate_chapter_header_basic(const std::string &chapterId, const std::vector<std::string> &sceneIds) {
    std::ostringstream oss;
    std::string guard = chapterId;
    for (auto &c : guard) c = std::toupper(c);
    guard += "_H";
    oss << "#ifndef " << guard << "\n";
    oss << "#define " << guard << "\n\n";
    oss << "#include <loke/scene.h>\n";
    if (!sceneIds.empty()) {
        oss << "\n// Forward declarations for all scenes in this chapter\n";
        for (const auto &sid : sceneIds) {
            oss << "void " << sid << "(GameState* state);\n";
        }
    } else {
        oss << "\n// No scenes yet\n";
    }
    oss << "\n#endif // " << guard << "\n";
    return oss.str();
}

static bool ensure_dir(const std::string &path) {
    struct stat st;
    if (stat(path.c_str(), &st) == 0) {
        return S_ISDIR(st.st_mode);
    }
    // Try to create single-level directory "path"
    if (mkdir(path.c_str(), 0755) == 0) return true;
    // If it still doesn't exist, report failure
    return (stat(path.c_str(), &st) == 0) && S_ISDIR(st.st_mode);
}

int main(void) {
    // Open DB file in project dir; for dev simplicity use file "dev.db" in server folder
    if (open_db("dev.db") != SQLITE_OK) {
        std::cerr << "Failed to open SQLite database" << std::endl;
        return 1;
    }

    httplib::Server svr;

    // CORS: allow configurable origin (default: *)
    const char* cors_env = std::getenv("CORS_ALLOW_ORIGIN");
    std::string cors_origin = cors_env ? std::string(cors_env) : std::string("*");
    svr.set_default_headers({
        {"Access-Control-Allow-Origin", cors_origin},
        {"Access-Control-Allow-Headers", "*"},
        {"Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS"}
    });
    // Handle preflight
    svr.Options(R"(/.*)", [&](const httplib::Request&, httplib::Response& res) {
        res.status = 204;
    });

    // Health
    svr.Get("/api/health", [](const httplib::Request &, httplib::Response &res) {
        res.set_content("{\"status\":\"ok\"}", "application/json");
    });

    // Chapters
    svr.Get(R"(/api/chapters/(.+))", [](const httplib::Request &req, httplib::Response &res) {
        std::string id = req.matches[1];
        std::lock_guard<std::mutex> lock(db_mutex);
        sqlite3_stmt* stmt = nullptr;
        if (sqlite3_prepare_v2(db, "SELECT data FROM chapters WHERE id=?", -1, &stmt, nullptr) != SQLITE_OK) {
            res.status = 500;
            res.set_content("{\"message\":\"DB read failed\"}", "application/json");
            return;
        }
        sqlite3_bind_text(stmt, 1, id.c_str(), -1, SQLITE_TRANSIENT);
        int rc = sqlite3_step(stmt);
        if (rc == SQLITE_ROW) {
            const unsigned char* data = sqlite3_column_text(stmt, 0);
            res.set_content(data ? reinterpret_cast<const char*>(data) : "null", "application/json");
        } else {
            res.status = 404;
            res.set_content("{\"message\":\"Chapter not found\"}", "application/json");
        }
        sqlite3_finalize(stmt);
    });

    svr.Get("/api/chapters", [](const httplib::Request &, httplib::Response &res) {
        std::lock_guard<std::mutex> lock(db_mutex);
        sqlite3_stmt* stmt = nullptr;
        if (sqlite3_prepare_v2(db, "SELECT data FROM chapters ORDER BY id", -1, &stmt, nullptr) != SQLITE_OK) {
            res.status = 500;
            res.set_content("{\"message\":\"DB read failed\"}", "application/json");
            return;
        }
        auto json = json_array_from_rows(stmt);
        sqlite3_finalize(stmt);
        res.set_content(json, "application/json");
    });

    svr.Post("/api/chapters", [](const httplib::Request &req, httplib::Response &res) {
        if (req.body.empty()) {
            res.status = 400;
            res.set_content("{\"message\":\"Empty body\"}", "application/json");
            return;
        }
        std::string id = json_get_string_field(req.body, "id");
        if (id.empty() || !is_valid_c_identifier(id) || id.rfind("chapter", 0) != 0) {
            res.status = 400;
            res.set_content("{\"message\":\"Invalid chapter id\"}", "application/json");
            return;
        }
        upsert_row("chapters", id, req.body, res);
    });

    svr.Put(R"(/api/chapters/(.+))", [](const httplib::Request &req, httplib::Response &res) {
        std::string id = req.matches[1];
        if (req.body.empty()) {
            res.status = 400;
            res.set_content("{\"message\":\"Empty body\"}", "application/json");
            return;
        }
        upsert_row("chapters", id, req.body, res);
    });

    svr.Delete(R"(/api/chapters/(.+))", [](const httplib::Request &req, httplib::Response &res) {
        std::string id = req.matches[1];
        std::lock_guard<std::mutex> lock(db_mutex);
        sqlite3_stmt* stmt = nullptr;
        if (sqlite3_prepare_v2(db, "DELETE FROM chapters WHERE id=?", -1, &stmt, nullptr) != SQLITE_OK) {
            res.status = 500;
            res.set_content("{\"message\":\"DB write failed\"}", "application/json");
            return;
        }
        sqlite3_bind_text(stmt, 1, id.c_str(), -1, SQLITE_TRANSIENT);
        if (sqlite3_step(stmt) != SQLITE_DONE) {
            sqlite3_finalize(stmt);
            res.status = 500;
            res.set_content("{\"message\":\"DB write failed\"}", "application/json");
            return;
        }
        sqlite3_finalize(stmt);
        res.set_content("{\"ok\":true}", "application/json");
    });

    // Scenes
    svr.Get("/api/scenes", [](const httplib::Request &, httplib::Response &res) {
        std::lock_guard<std::mutex> lock(db_mutex);
        sqlite3_stmt* stmt = nullptr;
        if (sqlite3_prepare_v2(db, "SELECT data FROM scenes ORDER BY id", -1, &stmt, nullptr) != SQLITE_OK) {
            res.status = 500;
            res.set_content("{\"message\":\"DB read failed\"}", "application/json");
            return;
        }
        auto json = json_array_from_rows(stmt);
        sqlite3_finalize(stmt);
        res.set_content(json, "application/json");
    });

    svr.Get(R"(/api/scenes/(.+))", [](const httplib::Request &req, httplib::Response &res) {
        std::string id = req.matches[1];
        std::lock_guard<std::mutex> lock(db_mutex);
        sqlite3_stmt* stmt = nullptr;
        if (sqlite3_prepare_v2(db, "SELECT data FROM scenes WHERE id=?", -1, &stmt, nullptr) != SQLITE_OK) {
            res.status = 500;
            res.set_content("{\"message\":\"DB read failed\"}", "application/json");
            return;
        }
        sqlite3_bind_text(stmt, 1, id.c_str(), -1, SQLITE_TRANSIENT);
        int rc = sqlite3_step(stmt);
        if (rc == SQLITE_ROW) {
            const unsigned char* data = sqlite3_column_text(stmt, 0);
            res.set_content(data ? reinterpret_cast<const char*>(data) : "null", "application/json");
        } else {
            res.status = 404;
            res.set_content("{\"message\":\"Scene not found\"}", "application/json");
        }
        sqlite3_finalize(stmt);
    });

    svr.Post("/api/scenes", [](const httplib::Request &req, httplib::Response &res) {
        if (req.body.empty()) {
            res.status = 400;
            res.set_content("{\"message\":\"Empty body\"}", "application/json");
            return;
        }
        // Prefer "sceneId" if present, otherwise "id"
        std::string id = json_get_string_field(req.body, "sceneId");
        if (id.empty()) id = json_get_string_field(req.body, "id");
        std::string chapterId = json_get_string_field(req.body, "chapterId");
        std::string sceneText = json_get_string_field(req.body, "sceneText");
        if (id.empty() || !is_valid_c_identifier(id) || id.rfind("scene_", 0) != 0) {
            res.status = 400;
            res.set_content("{\"message\":\"Invalid sceneId\"}", "application/json");
            return;
        }
        if (chapterId.empty()) {
            res.status = 400;
            res.set_content("{\"message\":\"Missing chapterId\"}", "application/json");
            return;
        }
        upsert_row("scenes", id, req.body, res);
    });

    svr.Put(R"(/api/scenes/(.+))", [](const httplib::Request &req, httplib::Response &res) {
        std::string id = req.matches[1];
        if (req.body.empty()) {
            res.status = 400;
            res.set_content("{\"message\":\"Empty body\"}", "application/json");
            return;
        }
        if (id.empty() || !is_valid_c_identifier(id) || id.rfind("scene_", 0) != 0) {
            res.status = 400;
            res.set_content("{\"message\":\"Invalid sceneId\"}", "application/json");
            return;
        }
        upsert_row("scenes", id, req.body, res);
    });

    svr.Delete(R"(/api/scenes/(.+))", [](const httplib::Request &req, httplib::Response &res) {
        std::string id = req.matches[1];
        std::lock_guard<std::mutex> lock(db_mutex);
        sqlite3_stmt* stmt = nullptr;
        if (sqlite3_prepare_v2(db, "DELETE FROM scenes WHERE id=?", -1, &stmt, nullptr) != SQLITE_OK) {
            res.status = 500;
            res.set_content("{\"message\":\"DB write failed\"}", "application/json");
            return;
        }
        sqlite3_bind_text(stmt, 1, id.c_str(), -1, SQLITE_TRANSIENT);
        if (sqlite3_step(stmt) != SQLITE_DONE) {
            sqlite3_finalize(stmt);
            res.status = 500;
            res.set_content("{\"message\":\"DB write failed\"}", "application/json");
            return;
        }
        sqlite3_finalize(stmt);
        res.set_content("{\"ok\":true}", "application/json");
    });

    // Build/export: generate .c files from scenes JSON and chapter .h headers
    svr.Post("/api/build", [](const httplib::Request &, httplib::Response &res) {
        std::lock_guard<std::mutex> lock(db_mutex);
        sqlite3_stmt* stmt = nullptr;
        if (sqlite3_prepare_v2(db, "SELECT data FROM scenes ORDER BY id", -1, &stmt, nullptr) != SQLITE_OK) {
            res.status = 500;
            res.set_content("{\"message\":\"DB read failed\"}", "application/json");
            return;
        }
        // Write into the backend working directory under ./output
        std::string outdir = "output";
        if (!ensure_dir(outdir)) {
            sqlite3_finalize(stmt);
            res.status = 500;
            res.set_content("{\"message\":\"Failed to create output dir\"}", "application/json");
            return;
        }
        size_t sceneCount = 0;
        std::unordered_map<std::string, std::vector<std::string>> chapterScenes;
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            const unsigned char* data = sqlite3_column_text(stmt, 0);
            if (!data) continue;
            std::string json = reinterpret_cast<const char*>(data);
            std::string sceneId = json_get_string_field(json, "sceneId");
            if (sceneId.empty()) sceneId = json_get_string_field(json, "id");
            std::string chapterId = json_get_string_field(json, "chapterId");
            if (sceneId.empty()) continue;
            std::string code = generate_scene_code_from_json(sceneId, chapterId, json);
            std::string outfile = outdir + "/" + sceneId + ".c";
            std::ofstream ofs(outfile.c_str());
            if (ofs) {
                ofs << code;
                ofs.close();
                ++sceneCount;
            }
            if (!chapterId.empty()) {
                chapterScenes[chapterId].push_back(sceneId);
            }
        }
        sqlite3_finalize(stmt);

        // Determine chapters — prefer explicit chapters table, fall back to chapterIds seen in scenes
        std::set<std::string> chapterIds;
        sqlite3_stmt* ch = nullptr;
        if (sqlite3_prepare_v2(db, "SELECT data FROM chapters ORDER BY id", -1, &ch, nullptr) == SQLITE_OK) {
            while (sqlite3_step(ch) == SQLITE_ROW) {
                const unsigned char* data = sqlite3_column_text(ch, 0);
                if (!data) continue;
                std::string json = reinterpret_cast<const char*>(data);
                std::string cid = json_get_string_field(json, "id");
                if (!cid.empty()) chapterIds.insert(cid);
            }
        }
        if (ch) sqlite3_finalize(ch);
        if (chapterIds.empty()) {
            for (const auto &kv : chapterScenes) chapterIds.insert(kv.first);
        }

        size_t headerCount = 0;
        for (const auto &cid : chapterIds) {
            auto it = chapterScenes.find(cid);
            const auto &scenesForChapter = (it != chapterScenes.end()) ? it->second : std::vector<std::string>{};
            std::string header = generate_chapter_header_basic(cid, scenesForChapter);
            std::string hfile = outdir + "/" + cid + ".h";
            std::ofstream hofs(hfile.c_str());
            if (hofs) {
                hofs << header;
                hofs.close();
                ++headerCount;
            }
        }

        std::ostringstream resp;
        resp << "{\"ok\":true,\"scenes\":" << sceneCount << ",\"chapters\":" << headerCount << "}";
        res.set_content(resp.str(), "application/json");
    });

    // List generated artifacts in ./output
    svr.Get("/api/build/artifacts", [](const httplib::Request &, httplib::Response &res) {
        std::string outdir = "output";
        ensure_dir(outdir);
        std::ostringstream oss;
        oss << "[";
        bool first = true;
        DIR* dir = opendir(outdir.c_str());
        if (dir) {
            struct dirent* ent;
            while ((ent = readdir(dir)) != nullptr) {
                std::string name = ent->d_name;
                if (name.size() > 2 && (name.rfind(".c") == name.size()-2 || name.rfind(".h") == name.size()-2)) {
                    if (!first) oss << ",";
                    first = false;
                    oss << "\"" << name << "\"";
                }
            }
            closedir(dir);
        }
        oss << "]";
        res.set_content(oss.str(), "application/json");
    });

    std::cout << "SQLite API server is running on http://127.0.0.1:3000" << std::endl;
    svr.listen("0.0.0.0", 3000);
}
