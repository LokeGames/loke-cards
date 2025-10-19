#include "code_generator.h"
#include <sstream>
#include <algorithm>
#include <regex>

std::string escape_c_string(const std::string& input) {
    std::string output;
    output.reserve(input.size());

    for (char c : input) {
        switch (c) {
            case '\n': output += "\\n"; break;
            case '\r': output += "\\r"; break;
            case '\t': output += "\\t"; break;
            case '\"': output += "\\\""; break;
            case '\\': output += "\\\\"; break;
            default:   output += c; break;
        }
    }

    return output;
}

bool validate_scene_id(const std::string& scene_id) {
    if (scene_id.empty()) return false;

    // Must start with letter or underscore
    if (!std::isalpha(scene_id[0]) && scene_id[0] != '_') return false;

    // Rest must be alphanumeric or underscore
    for (char c : scene_id) {
        if (!std::isalnum(c) && c != '_') return false;
    }

    return true;
}

SceneCard parse_scene_json(const json& json_data) {
    SceneCard card;

    card.scene_id = json_data.value("scene_id", "");
    card.chapter = json_data.value("chapter", "chapter01");
    card.scene_text = json_data.value("scene_text", "");
    card.uses_dynamic_text = json_data.value("uses_dynamic_text", false);

    // Parse choices
    if (json_data.contains("choices") && json_data["choices"].is_array()) {
        for (const auto& choice_json : json_data["choices"]) {
            Choice choice;
            choice.text = choice_json.value("text", "");
            choice.next_scene = choice_json.value("next_scene", "");
            choice.enabled = choice_json.value("enabled", true);
            choice.condition = choice_json.value("condition", "");
            card.choices.push_back(choice);
        }
    }

    // Parse state changes
    if (json_data.contains("state_changes") && json_data["state_changes"].is_array()) {
        for (const auto& change_json : json_data["state_changes"]) {
            StateChange change;
            change.variable = change_json.value("variable", "");
            change.op = change_json.value("operator", "=");
            change.value = change_json.value("value", "");
            card.state_changes.push_back(change);
        }
    }

    return card;
}

std::string generate_scene_code(const SceneCard& card) {
    std::stringstream code;

    // File header
    code << "#include <loke/scene.h>\n";
    code << "#include \"" << card.chapter << ".h\"\n";
    code << "\n";

    // Forward declarations for next scenes (if needed)
    for (const auto& choice : card.choices) {
        if (!choice.next_scene.empty() && choice.next_scene != "NULL") {
            // Extract chapter from scene name if it follows pattern scene_chXX_name
            std::regex chapter_pattern("scene_(ch[0-9]+)_");
            std::smatch match;
            if (std::regex_search(choice.next_scene, match, chapter_pattern)) {
                std::string next_chapter = match[1].str();
                if (next_chapter != card.chapter.substr(0, 4)) {  // Different chapter
                    code << "extern void " << choice.next_scene << "(GameState* state);\n";
                }
            }
        }
    }
    if (!card.choices.empty()) {
        code << "\n";
    }

    // Scene function
    code << "void scene_" << card.scene_id << "(GameState* state) {\n";
    code << "    SceneContext* ctx = get_current_context();\n";
    code << "\n";

    // State modifications BEFORE text
    if (!card.state_changes.empty()) {
        code << "    // State modifications\n";
        for (const auto& change : card.state_changes) {
            code << "    state->" << change.variable << " " << change.op << " " << change.value << ";\n";
        }
        code << "\n";
    }

    // Scene text
    if (card.uses_dynamic_text) {
        code << "    // Dynamic text with state variables\n";
        code << "    char buffer[MAX_TEXT_LENGTH];\n";
        code << "    snprintf(buffer, MAX_TEXT_LENGTH,\n";
        code << "        \"" << escape_c_string(card.scene_text) << "\"\n";
        code << "    );\n";
        code << "    scene_set_text(ctx, buffer);\n";
    } else {
        code << "    scene_set_text(ctx, \"" << escape_c_string(card.scene_text) << "\");\n";
    }
    code << "\n";

    // Choices
    if (!card.choices.empty()) {
        code << "    // Choices\n";
        for (const auto& choice : card.choices) {
            std::string next_scene_func = choice.next_scene.empty() ? "NULL" : choice.next_scene;
            std::string enabled_str = choice.enabled ? "true" : "false";

            if (!choice.condition.empty()) {
                // Conditional choice
                code << "    if (" << choice.condition << ") {\n";
                code << "        scene_add_option(ctx, \"" << escape_c_string(choice.text) << "\", ";
                code << next_scene_func << ", true);\n";
                code << "    } else {\n";
                code << "        scene_add_option(ctx, \"" << escape_c_string(choice.text) << " (Locked)\", ";
                code << "NULL, false);\n";
                code << "    }\n";
            } else {
                // Simple choice
                code << "    scene_add_option(ctx, \"" << escape_c_string(choice.text) << "\", ";
                code << next_scene_func << ", " << enabled_str << ");\n";
            }
        }
    }

    code << "}\n";

    return code.str();
}

std::string generate_chapter_header(const std::string& chapter_name,
                                     const std::vector<std::string>& scene_ids) {
    std::stringstream header;

    // Header guard
    std::string guard = chapter_name;
    std::transform(guard.begin(), guard.end(), guard.begin(), ::toupper);
    guard += "_H";

    header << "#ifndef " << guard << "\n";
    header << "#define " << guard << "\n";
    header << "\n";
    header << "#include <loke/scene.h>\n";
    header << "\n";
    header << "// Forward declarations for all scenes in this chapter\n";

    for (const auto& scene_id : scene_ids) {
        header << "void scene_" << scene_id << "(GameState* state);\n";
    }

    header << "\n";
    header << "#endif // " << guard << "\n";

    return header.str();
}
