#include "../include/mini_json.hpp"
#include "../include/codegen.hpp"
#include <sstream>
#include <tuple>
#include <iomanip>

static std::string escape_c_string(const std::string &s) {
    std::string out; out.reserve(s.size()*2);
    for (char c : s) {
        switch (c) {
            case '\\': out += "\\\\"; break;
            case '"': out += "\\\""; break;
            case '\n': out += "\\n"; break;
            case '\t': out += "\\t"; break;
            case '\r': break;
            default: out += c; break;
        }
    }
    return out;
}

static std::string num_to_str(double d) {
    std::ostringstream os;
    os << std::setprecision(15) << d;
    std::string s = os.str();
    if (s.find('.') != std::string::npos) {
        while (!s.empty() && s.back() == '0') s.pop_back();
        if (!s.empty() && s.back() == '.') s.pop_back();
    }
    if (s.empty()) s = "0";
    return s;
}

std::string generate_scene_code_from_json(const std::string &sceneId,
                                          const std::string &chapterId,
                                          const std::string &json) {
    using namespace mini_json;
    Value root = parse(json);
    std::string sceneText;
    std::vector<std::tuple<std::string, std::string, bool>> choices;
    struct State { std::string var, op, val; };
    std::vector<State> states;

    if (root.isObject()) {
        const Value &txt = root["sceneText"]; if (txt.isString()) sceneText = txt.s;
        const Value &arrC = root["choices"];
        if (arrC.isArray()) {
            for (const auto &item : arrC.a) {
                if (!item.isObject()) continue;
                std::string text, next; bool en = true;
                const Value &t = item["text"]; if (t.isString()) text = t.s;
                const Value &n = item["nextScene"]; if (n.isString()) next = n.s;
                const Value &e = item["enabled"]; if (e.isBool()) en = e.b;
                if (!text.empty()) choices.emplace_back(text, next, en);
            }
        }
        const Value &arrS = root["stateChanges"];
        if (arrS.isArray()) {
            for (const auto &item : arrS.a) {
                if (!item.isObject()) continue;
                State st;
                const Value &v = item["variable"]; if (v.isString()) st.var = v.s;
                const Value &op = item["operator"]; if (op.isString()) st.op = op.s;
                const Value &val = item["value"];
                if (val.isBool()) st.val = val.b ? "true" : "false";
                else if (val.isNumber()) st.val = num_to_str(val.n);
                else if (val.isString()) st.val = val.s;
                if (!st.var.empty() && !st.op.empty() && !st.val.empty()) states.push_back(st);
            }
        }
    }

    std::ostringstream oss;
    oss << "#include <loke/scene.h>\n";
    if (!chapterId.empty()) oss << "#include \"" << chapterId << ".h\"\n";
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

std::string generate_chapter_header_basic(const std::string &chapterId,
                                          const std::vector<std::string> &sceneIds) {
    std::ostringstream oss;
    std::string guard = chapterId; for (auto &c : guard) c = std::toupper(c); guard += "_H";
    oss << "#ifndef " << guard << "\n#define " << guard << "\n\n#include <loke/scene.h>\n";
    if (!sceneIds.empty()) {
        oss << "\n// Forward declarations for all scenes in this chapter\n";
        for (const auto &sid : sceneIds) oss << "void " << sid << "(GameState* state);\n";
    } else {
        oss << "\n// No scenes yet\n";
    }
    oss << "\n#endif // " << guard << "\n";
    return oss.str();
}

