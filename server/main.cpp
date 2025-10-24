// Phase 3: Minimal SQLite-backed API for local dev/testing
#include <iostream>
#include <vector>
#include <string>
#include <mutex>
#include <sstream>
#include <iomanip>
#include <cctype>
#include <fstream>
#include <sys/stat.h>
#include <sys/types.h>
#include <dirent.h>
#include <unordered_map>
#include <set>
#include <sqlite3.h>
#include "httplib.h"
#include "include/mini_json.hpp"
#include "include/codegen.hpp"

static std::mutex db_mutex;
static sqlite3* db = nullptr;

// === Project Management (v0.2.0) ===
static std::string current_project = "default";
static std::mutex project_mutex;

// Sanitize project name: lowercase alphanumeric + hyphens
static std::string sanitize_project_name(const std::string& name) {
    std::string result;
    for (char c : name) {
        if (std::isalnum(c)) {
            result += std::tolower(c);
        } else if (c == ' ' || c == '_') {
            result += '-';
        }
    }
    return result;
}

// Get project root directory
static std::string get_project_dir(const std::string& project) {
    return "projects/" + project;
}

// Get project database path
static std::string get_project_db_path(const std::string& project) {
    return get_project_dir(project) + "/data/" + project + ".db";
}

// Get project output directory
static std::string get_project_output_path(const std::string& project) {
    return get_project_dir(project) + "/output";
}

// Get project assets directory (future use)
static std::string get_project_assets_path(const std::string& project) {
    return get_project_dir(project) + "/assets";
}

// Create project directory structure
static bool create_project_dirs(const std::string& project) {
    std::string base = get_project_dir(project);
    std::string data_dir = base + "/data";
    std::string output_dir = base + "/output";
    std::string assets_dir = base + "/assets";

    // Create directories (ignore errors if already exist)
    mkdir(base.c_str(), 0755);
    mkdir(data_dir.c_str(), 0755);
    mkdir(output_dir.c_str(), 0755);
    mkdir(assets_dir.c_str(), 0755);

    // Verify data directory exists
    struct stat st;
    return (stat(data_dir.c_str(), &st) == 0 && S_ISDIR(st.st_mode));
}

// Check if project exists
static bool project_exists(const std::string& project) {
    struct stat st;
    std::string path = get_project_dir(project);
    return (stat(path.c_str(), &st) == 0 && S_ISDIR(st.st_mode));
}

// List all projects
static std::vector<std::string> list_projects() {
    std::vector<std::string> projects;
    DIR* dir = opendir("projects");
    if (!dir) return projects;

    struct dirent* entry;
    while ((entry = readdir(dir)) != nullptr) {
        if (entry->d_type == DT_DIR &&
            strcmp(entry->d_name, ".") != 0 &&
            strcmp(entry->d_name, "..") != 0) {
            projects.push_back(entry->d_name);
        }
    }
    closedir(dir);
    return projects;
}

// Count records in a table
static int count_records(const std::string& table) {
    std::lock_guard<std::mutex> lock(db_mutex);
    sqlite3_stmt* stmt = nullptr;
    std::string sql = "SELECT COUNT(*) FROM " + table;

    if (sqlite3_prepare_v2(db, sql.c_str(), -1, &stmt, nullptr) != SQLITE_OK) {
        return 0;
    }

    int count = 0;
    if (sqlite3_step(stmt) == SQLITE_ROW) {
        count = sqlite3_column_int(stmt, 0);
    }
    sqlite3_finalize(stmt);
    return count;
}

// Migrate v0.1.0 dev.db to v0.2.0 project structure
static void migrate_from_v0_1_0() {
    struct stat st;

    // Check if old dev.db exists
    if (stat("dev.db", &st) != 0 || !S_ISREG(st.st_mode)) {
        return; // No migration needed
    }

    std::cout << "Migrating v0.1.0 database to v0.2.0..." << std::endl;

    // Create default project
    create_project_dirs("default");

    // Copy dev.db to default project
    std::string dest = get_project_db_path("default");
    std::ifstream src("dev.db", std::ios::binary);
    std::ofstream dst(dest, std::ios::binary);
    dst << src.rdbuf();
    src.close();
    dst.close();

    // Move output files if they exist
    if (stat("output", &st) == 0 && S_ISDIR(st.st_mode)) {
        std::string cmd = "cp -r output/* " + get_project_output_path("default") + "/ 2>/dev/null";
        system(cmd.c_str());
    }

    // Backup old database
    std::rename("dev.db", "dev.db.v0.1.0.backup");

    std::cout << "Migration complete! Old database backed up to dev.db.v0.1.0.backup" << std::endl;
}

// Open database for a specific project
// Closes existing connection if open, creates tables if needed
static int open_db_for_project(const std::string &project_name) {
    std::lock_guard<std::mutex> lock(db_mutex);

    // Close existing connection if open
    if (db) {
        sqlite3_close(db);
        db = nullptr;
    }

    // Get path for this project
    std::string db_path = get_project_db_path(project_name);

    // Ensure project directories exist
    if (!create_project_dirs(project_name)) {
        std::cerr << "Failed to create project directories for: " << project_name << std::endl;
        return SQLITE_ERROR;
    }

    // Open database
    int rc = sqlite3_open(db_path.c_str(), &db);
    if (rc != SQLITE_OK) {
        std::cerr << "Failed to open database: " << db_path << std::endl;
        return rc;
    }

    // Create tables (same schema as v0.1.0)
    const char* ddl_chapters = "CREATE TABLE IF NOT EXISTS chapters (id TEXT PRIMARY KEY, data TEXT NOT NULL);";
    const char* ddl_scenes   = "CREATE TABLE IF NOT EXISTS scenes (id TEXT PRIMARY KEY, data TEXT NOT NULL);";
    const char* ddl_states   = "CREATE TABLE IF NOT EXISTS states (id TEXT PRIMARY KEY, data TEXT NOT NULL);";

    char* errmsg = nullptr;
    if (sqlite3_exec(db, ddl_chapters, nullptr, nullptr, &errmsg) != SQLITE_OK) {
        std::cerr << "DB error: " << errmsg << std::endl;
        sqlite3_free(errmsg);
    }
    if (sqlite3_exec(db, ddl_scenes, nullptr, nullptr, &errmsg) != SQLITE_OK) {
        std::cerr << "DB error: " << errmsg << std::endl;
        sqlite3_free(errmsg);
    }
    if (sqlite3_exec(db, ddl_states, nullptr, nullptr, &errmsg) != SQLITE_OK) {
        std::cerr << "DB error: " << errmsg << std::endl;
        sqlite3_free(errmsg);
    }

    std::cout << "Opened database for project: " << project_name << " (" << db_path << ")" << std::endl;
    return SQLITE_OK;
}

// Legacy function for compatibility (deprecated)
static int open_db(const std::string &path) {
    int rc = sqlite3_open(path.c_str(), &db);
    if (rc != SQLITE_OK) return rc;
    const char* ddl_chapters = "CREATE TABLE IF NOT EXISTS chapters (id TEXT PRIMARY KEY, data TEXT NOT NULL);";
    const char* ddl_scenes   = "CREATE TABLE IF NOT EXISTS scenes (id TEXT PRIMARY KEY, data TEXT NOT NULL);";
    const char* ddl_states   = "CREATE TABLE IF NOT EXISTS states (id TEXT PRIMARY KEY, data TEXT NOT NULL);";
    char* errmsg = nullptr;
    if (sqlite3_exec(db, ddl_chapters, nullptr, nullptr, &errmsg) != SQLITE_OK) {
        std::cerr << "DB error: " << errmsg << std::endl;
        sqlite3_free(errmsg);
    }
    if (sqlite3_exec(db, ddl_scenes, nullptr, nullptr, &errmsg) != SQLITE_OK) {
        std::cerr << "DB error: " << errmsg << std::endl;
        sqlite3_free(errmsg);
    }
    if (sqlite3_exec(db, ddl_states, nullptr, nullptr, &errmsg) != SQLITE_OK) {
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

#if 0
#if 0
static std::string generate_scene_code_from_json(const std::string &sceneId, const std::string &chapterId, const std::string &json) {
    using namespace mini_json;
    Value root = parse(json);
    std::string sceneText;
    std::vector<std::tuple<std::string, std::string, bool>> choices;
    struct State { std::string var, op, val; };
    std::vector<State> states;

    if (root.isObject()) {
        const Value &txt = root["sceneText"];
        if (txt.isString()) sceneText = txt.s;
        const Value &arrC = root["choices"];
        if (arrC.isArray()) {
            for (const auto &item : arrC.a) {
                if (!item.isObject()) continue;
                std::string text, next; bool en = true;
                const Value &t = item.o.count("text")? item.o.at("text") : Value();
                const Value &n = item.o.count("nextScene")? item.o.at("nextScene") : Value();
                const Value &e = item.o.count("enabled")? item.o.at("enabled") : Value();
                if (t.isString()) text = t.s;
                if (n.isString()) next = n.s;
                if (e.isBool()) en = e.b;
                if (!text.empty()) choices.emplace_back(text, next, en);
            }
        }
        const Value &arrS = root["stateChanges"];
        if (arrS.isArray()) {
            for (const auto &item : arrS.a) {
                if (!item.isObject()) continue;
                State st;
                const Value &v = item.o.count("variable")? item.o.at("variable") : Value();
                const Value &op = item.o.count("operator")? item.o.at("operator") : Value();
                const Value &val = item.o.count("value")? item.o.at("value") : Value();
                if (v.isString()) st.var = v.s;
                if (op.isString()) st.op = op.s;
                if (val.isBool()) st.val = val.b ? "true" : "false";
                else if (val.isNumber()) st.val = num_to_str(val.n);
                else if (val.isString()) st.val = val.s; // user-provided token
                if (!st.var.empty() && !st.op.empty() && !st.val.empty()) states.push_back(st);
            }
        }
    }

    std::ostringstream oss;
    oss << "#include <loke/scene.h>\n";
    if (!chapterId.empty()) {
        oss << "#include \"" << chapterId << ".h\"\n";
    }
    oss << "\nvoid " << sceneId << "(GameState* state) {\n";
    oss << "    SceneContext* ctx = get_current_context();\n";
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
        oss << "    scene_add_option(ctx, \"Continue\", NULL, true);\n";
    }
    oss << "}\n";
    return oss.str();
}
#endif
#endif

// use generate_chapter_header_basic from codegen

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
    // === v0.2.0 Multi-Project Architecture ===

    // Run migration if needed (v0.1.0 → v0.2.0)
    migrate_from_v0_1_0();

    // Ensure projects directory exists
    mkdir("projects", 0755);

    // Create default project if no projects exist
    auto projects = list_projects();
    if (projects.empty()) {
        std::cout << "No projects found, creating default project..." << std::endl;
        create_project_dirs("default");
    }

    // Open default project database
    current_project = "default";
    if (open_db_for_project(current_project) != SQLITE_OK) {
        std::cerr << "Failed to open project database: " << current_project << std::endl;
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

    // === Project Management API (v0.2.0) ===

    // GET /api/projects - List all projects with stats
    svr.Get("/api/projects", [&](const httplib::Request &, httplib::Response &res) {
        auto projects = list_projects();

        std::ostringstream json;
        json << "[";
        bool first = true;

        // Save current project to restore later
        std::string saved_project = current_project;

        for (const auto& proj : projects) {
            // Temporarily switch to get stats
            open_db_for_project(proj);

            int scenes = count_records("scenes");
            int chapters = count_records("chapters");
            int states = count_records("states");

            if (!first) json << ",";
            first = false;

            json << "{"
                 << "\"id\":\"" << proj << "\","
                 << "\"name\":\"" << proj << "\","
                 << "\"sceneCount\":" << scenes << ","
                 << "\"chapterCount\":" << chapters << ","
                 << "\"stateCount\":" << states
                 << "}";
        }
        json << "]";

        // Restore original project
        open_db_for_project(saved_project);

        res.set_content(json.str(), "application/json");
    });

    // POST /api/projects - Create new project
    svr.Post("/api/projects", [&](const httplib::Request &req, httplib::Response &res) {
        std::string name = json_get_string_field(req.body, "name");
        if (name.empty()) {
            res.status = 400;
            res.set_content("{\"message\":\"Project name required\"}", "application/json");
            return;
        }

        std::string project_id = sanitize_project_name(name);
        if (project_id.empty()) {
            res.status = 400;
            res.set_content("{\"message\":\"Invalid project name\"}", "application/json");
            return;
        }

        if (project_exists(project_id)) {
            res.status = 409;
            res.set_content("{\"message\":\"Project already exists\"}", "application/json");
            return;
        }

        if (!create_project_dirs(project_id)) {
            res.status = 500;
            res.set_content("{\"message\":\"Failed to create project directories\"}", "application/json");
            return;
        }

        // Switch to new project and create database
        std::lock_guard<std::mutex> lock(project_mutex);
        current_project = project_id;
        if (open_db_for_project(project_id) != SQLITE_OK) {
            res.status = 500;
            res.set_content("{\"message\":\"Failed to create project database\"}", "application/json");
            return;
        }

        std::ostringstream json;
        json << "{"
             << "\"id\":\"" << project_id << "\","
             << "\"name\":\"" << name << "\","
             << "\"sceneCount\":0,"
             << "\"chapterCount\":0,"
             << "\"stateCount\":0"
             << "}";

        res.set_content(json.str(), "application/json");
    });

    // POST /api/projects/switch - Switch current project pointer
    svr.Post("/api/projects/switch", [&](const httplib::Request &req, httplib::Response &res) {
        std::string project = json_get_string_field(req.body, "project");

        if (project.empty()) {
            res.status = 400;
            res.set_content("{\"message\":\"Project name required\"}", "application/json");
            return;
        }

        if (!project_exists(project)) {
            res.status = 404;
            res.set_content("{\"message\":\"Project not found\"}", "application/json");
            return;
        }

        std::lock_guard<std::mutex> lock(project_mutex);
        current_project = project;
        if (open_db_for_project(current_project) != SQLITE_OK) {
            res.status = 500;
            res.set_content("{\"message\":\"Failed to open project database\"}", "application/json");
            return;
        }

        std::ostringstream json;
        json << "{\"message\":\"Switched to project: " << project << "\"}";
        res.set_content(json.str(), "application/json");
    });

    // GET /api/projects/current - Get current project info
    svr.Get("/api/projects/current", [&](const httplib::Request &, httplib::Response &res) {
        int scenes = count_records("scenes");
        int chapters = count_records("chapters");
        int states = count_records("states");

        std::ostringstream json;
        json << "{"
             << "\"id\":\"" << current_project << "\","
             << "\"name\":\"" << current_project << "\","
             << "\"sceneCount\":" << scenes << ","
             << "\"chapterCount\":" << chapters << ","
             << "\"stateCount\":" << states
             << "}";

        res.set_content(json.str(), "application/json");
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
        if (sqlite3_prepare_v2(db, "SELECT json_object('id', id, 'data', data) FROM chapters ORDER BY id", -1, &stmt, nullptr) != SQLITE_OK) {
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
        if (sqlite3_prepare_v2(db, "SELECT json_object('id', id, 'data', data) FROM scenes ORDER BY id", -1, &stmt, nullptr) != SQLITE_OK) {
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

    // Generate code for a single scene (on-demand)
    svr.Get(R"(/api/scenes/(.+)/code)", [](const httplib::Request &req, httplib::Response &res) {
        std::string id = req.matches[1];
        std::lock_guard<std::mutex> lock(db_mutex);
        sqlite3_stmt* stmt = nullptr;
        if (sqlite3_prepare_v2(db, "SELECT data FROM scenes WHERE id=?", -1, &stmt, nullptr) != SQLITE_OK) {
            res.status = 500;
            res.set_content("DB read failed", "text/plain");
            return;
        }
        sqlite3_bind_text(stmt, 1, id.c_str(), -1, SQLITE_TRANSIENT);
        int rc = sqlite3_step(stmt);
        if (rc == SQLITE_ROW) {
            const unsigned char* data = sqlite3_column_text(stmt, 0);
            std::string json = data ? reinterpret_cast<const char*>(data) : std::string();
            std::string sceneId = json_get_string_field(json, "sceneId");
            if (sceneId.empty()) sceneId = json_get_string_field(json, "id");
            std::string chapterId = json_get_string_field(json, "chapterId");
            if (sceneId.empty()) {
                res.status = 400;
                res.set_content("Invalid scene", "text/plain");
            } else {
                auto code = generate_scene_code_from_json(sceneId, chapterId, json);
                res.set_content(code, "text/plain");
            }
        } else {
            res.status = 404;
            res.set_content("Scene not found", "text/plain");
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

    // === States API ===
    svr.Get("/api/states", [](const httplib::Request &, httplib::Response &res) {
        std::lock_guard<std::mutex> lock(db_mutex);
        sqlite3_stmt* stmt = nullptr;
        if (sqlite3_prepare_v2(db, "SELECT data FROM states ORDER BY id", -1, &stmt, nullptr) != SQLITE_OK) {
            res.status = 500;
            res.set_content("{\"message\":\"DB read failed\"}", "application/json");
            return;
        }
        std::string result = json_array_from_rows(stmt);
        sqlite3_finalize(stmt);
        res.set_content(result, "application/json");
    });

    svr.Get(R"(/api/states/(.+))", [](const httplib::Request &req, httplib::Response &res) {
        std::string id = req.matches[1];
        std::lock_guard<std::mutex> lock(db_mutex);
        sqlite3_stmt* stmt = nullptr;
        if (sqlite3_prepare_v2(db, "SELECT data FROM states WHERE id=?", -1, &stmt, nullptr) != SQLITE_OK) {
            res.status = 500;
            res.set_content("{\"message\":\"DB read failed\"}", "application/json");
            return;
        }
        sqlite3_bind_text(stmt, 1, id.c_str(), -1, SQLITE_TRANSIENT);
        if (sqlite3_step(stmt) == SQLITE_ROW) {
            const unsigned char* data = sqlite3_column_text(stmt, 0);
            std::string result = data ? reinterpret_cast<const char*>(data) : "null";
            sqlite3_finalize(stmt);
            res.set_content(result, "application/json");
        } else {
            sqlite3_finalize(stmt);
            res.status = 404;
            res.set_content("{\"message\":\"State not found\"}", "application/json");
        }
    });

    svr.Post("/api/states", [](const httplib::Request &req, httplib::Response &res) {
        std::string id = json_get_string_field(req.body, "id");
        if (id.empty()) {
            res.status = 400;
            res.set_content("{\"message\":\"Missing id in request body\"}", "application/json");
            return;
        }
        upsert_row("states", id, req.body, res);
    });

    svr.Put(R"(/api/states/(.+))", [](const httplib::Request &req, httplib::Response &res) {
        std::string id = req.matches[1];
        upsert_row("states", id, req.body, res);
    });

    svr.Delete(R"(/api/states/(.+))", [](const httplib::Request &req, httplib::Response &res) {
        std::string id = req.matches[1];
        std::lock_guard<std::mutex> lock(db_mutex);
        sqlite3_stmt* stmt = nullptr;
        if (sqlite3_prepare_v2(db, "DELETE FROM states WHERE id=?", -1, &stmt, nullptr) != SQLITE_OK) {
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
    svr.Post("/api/build", [&](const httplib::Request &, httplib::Response &res) {
        std::lock_guard<std::mutex> lock(db_mutex);
        sqlite3_stmt* stmt = nullptr;
        if (sqlite3_prepare_v2(db, "SELECT json_object('id', id, 'data', data) FROM scenes ORDER BY id", -1, &stmt, nullptr) != SQLITE_OK) {
            res.status = 500;
            res.set_content("{\"message\":\"DB read failed\"}", "application/json");
            return;
        }
        // Write into the current project's output directory
        std::string outdir = get_project_output_path(current_project);
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
        std::unordered_map<std::string, std::string> chapterMeta;
        if (sqlite3_prepare_v2(db, "SELECT json_object('id', id, 'data', data) FROM chapters ORDER BY id", -1, &ch, nullptr) == SQLITE_OK) {
            while (sqlite3_step(ch) == SQLITE_ROW) {
                const unsigned char* data = sqlite3_column_text(ch, 0);
                if (!data) continue;
                std::string json = reinterpret_cast<const char*>(data);
                std::string cid = json_get_string_field(json, "id");
                // extract meta (naive)
                size_t mp = json.find("\"meta\"");
                if (mp != std::string::npos) {
                    // very naive string value extract
                    size_t q1 = json.find('"', json.find(':', mp));
                    if (q1 != std::string::npos) {
                        size_t q2 = json.find('"', q1 + 1);
                        if (q2 != std::string::npos) {
                            chapterMeta[cid] = json.substr(q1 + 1, q2 - (q1 + 1));
                        }
                    }
                }
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
            std::string header = generate_chapter_header_basic(cid, scenesForChapter, chapterMeta.count(cid)? chapterMeta[cid] : "");
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

    // List generated artifacts in current project's output directory
    svr.Get("/api/build/artifacts", [&](const httplib::Request &, httplib::Response &res) {
        std::string outdir = get_project_output_path(current_project);
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
    auto num_to_str = [](double d) {
        std::ostringstream os;
        os << std::setprecision(15) << d;
        std::string s = os.str();
        // trim trailing zeros and possible trailing dot
        if (s.find('.') != std::string::npos) {
            while (!s.empty() && s.back() == '0') s.pop_back();
            if (!s.empty() && s.back() == '.') s.pop_back();
        }
        if (s.empty()) s = "0";
        return s;
    };
