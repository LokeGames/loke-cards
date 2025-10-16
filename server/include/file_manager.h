#ifndef FILE_MANAGER_H
#define FILE_MANAGER_H

#include <string>
#include <vector>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

/**
 * @brief File manager for loke-engine project structure
 *
 * Manages:
 * - /projects/{project_name}/
 * - /projects/{project_name}/{chapter}/
 * - /projects/{project_name}/{chapter}/{scene}.c
 * - /projects/{project_name}/{chapter}/{chapter}.h
 */
class FileManager {
public:
    /**
     * @brief Constructor
     * @param base_path Base path for all projects (e.g., "/home/loke/projects")
     */
    explicit FileManager(const std::string& base_path);

    /**
     * @brief Write scene file
     * @param project_name Project name
     * @param chapter Chapter name
     * @param scene_id Scene ID (without "scene_" prefix)
     * @param code C source code
     * @return true on success
     */
    bool write_scene(const std::string& project_name,
                     const std::string& chapter,
                     const std::string& scene_id,
                     const std::string& code);

    /**
     * @brief Write chapter header
     * @param project_name Project name
     * @param chapter Chapter name
     * @param header_code C header code
     * @return true on success
     */
    bool write_chapter_header(const std::string& project_name,
                              const std::string& chapter,
                              const std::string& header_code);

    /**
     * @brief List all scenes in chapter
     * @param project_name Project name
     * @param chapter Chapter name
     * @return List of scene IDs
     */
    std::vector<std::string> list_scenes(const std::string& project_name,
                                          const std::string& chapter);

    /**
     * @brief Read scene file
     * @param project_name Project name
     * @param chapter Chapter name
     * @param scene_id Scene ID
     * @return Scene C source code
     */
    std::string read_scene(const std::string& project_name,
                           const std::string& chapter,
                           const std::string& scene_id);

    /**
     * @brief Delete scene file
     * @param project_name Project name
     * @param chapter Chapter name
     * @param scene_id Scene ID
     * @return true on success
     */
    bool delete_scene(const std::string& project_name,
                      const std::string& chapter,
                      const std::string& scene_id);

    /**
     * @brief List all chapters in project
     * @param project_name Project name
     * @return List of chapter names
     */
    std::vector<std::string> list_chapters(const std::string& project_name);

    /**
     * @brief Get project metadata
     * @param project_name Project name
     * @return JSON metadata (or empty if not found)
     */
    json get_project_metadata(const std::string& project_name);

    /**
     * @brief Update project metadata
     * @param project_name Project name
     * @param metadata JSON metadata
     * @return true on success
     */
    bool update_project_metadata(const std::string& project_name,
                                  const json& metadata);

private:
    std::string base_path_;

    std::string get_project_path(const std::string& project_name);
    std::string get_chapter_path(const std::string& project_name,
                                  const std::string& chapter);
    std::string get_scene_path(const std::string& project_name,
                                const std::string& chapter,
                                const std::string& scene_id);
    bool ensure_directory(const std::string& path);
};

#endif // FILE_MANAGER_H
