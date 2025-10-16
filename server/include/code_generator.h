#ifndef CODE_GENERATOR_H
#define CODE_GENERATOR_H

#include <string>
#include <vector>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

/**
 * @brief Choice/option structure for scene
 */
struct Choice {
    std::string text;           // "Enter forest"
    std::string next_scene;     // "scene_ch01_forest_path"
    bool enabled;               // true/false or conditional expression
    std::string condition;      // Optional: "state->gold >= 50"
};

/**
 * @brief State change operation
 */
struct StateChange {
    std::string variable;       // "health", "gold", "has_key"
    std::string op;             // "+=", "-=", "="
    std::string value;          // "10", "true", "50"
};

/**
 * @brief Scene card data (from frontend JSON)
 */
struct SceneCard {
    std::string scene_id;       // "forest_entrance"
    std::string chapter;        // "chapter01"
    std::string scene_text;     // Multi-line description
    std::vector<Choice> choices;
    std::vector<StateChange> state_changes;
    bool uses_dynamic_text;     // Uses snprintf with state vars
};

/**
 * @brief Generate loke-engine compatible C code from scene card
 *
 * @param card Scene card data from frontend
 * @return Generated C source code
 */
std::string generate_scene_code(const SceneCard& card);

/**
 * @brief Generate chapter header file with forward declarations
 *
 * @param chapter_name Chapter name (e.g., "chapter01")
 * @param scene_ids List of scene IDs in chapter
 * @return Generated C header code
 */
std::string generate_chapter_header(const std::string& chapter_name,
                                     const std::vector<std::string>& scene_ids);

/**
 * @brief Parse scene card from JSON (from frontend)
 *
 * @param json_data JSON object from POST request
 * @return SceneCard structure
 */
SceneCard parse_scene_json(const json& json_data);

/**
 * @brief Validate scene ID (must be valid C identifier)
 *
 * @param scene_id Scene ID to validate
 * @return true if valid, false otherwise
 */
bool validate_scene_id(const std::string& scene_id);

/**
 * @brief Escape string for C string literal
 *
 * @param input Raw string
 * @return Escaped string (e.g., quotes, newlines)
 */
std::string escape_c_string(const std::string& input);

#endif // CODE_GENERATOR_H
