#include "file_manager.h"
#include <fstream>
#include <filesystem>
#include <iostream>

namespace fs = std::filesystem;

FileManager::FileManager(const std::string& base_path)
    : base_path_(base_path) {
    // Ensure base path exists
    ensure_directory(base_path_);
}

std::string FileManager::get_project_path(const std::string& project_name) {
    return base_path_ + "/" + project_name;
}

std::string FileManager::get_chapter_path(const std::string& project_name,
                                           const std::string& chapter) {
    return get_project_path(project_name) + "/" + chapter;
}

std::string FileManager::get_scene_path(const std::string& project_name,
                                         const std::string& chapter,
                                         const std::string& scene_id) {
    return get_chapter_path(project_name, chapter) + "/" + scene_id + ".c";
}

bool FileManager::ensure_directory(const std::string& path) {
    try {
        return fs::create_directories(path) || fs::exists(path);
    } catch (const std::exception& e) {
        std::cerr << "Failed to create directory " << path << ": " << e.what() << std::endl;
        return false;
    }
}

bool FileManager::write_scene(const std::string& project_name,
                               const std::string& chapter,
                               const std::string& scene_id,
                               const std::string& code) {
    try {
        std::string chapter_path = get_chapter_path(project_name, chapter);
        if (!ensure_directory(chapter_path)) {
            return false;
        }

        std::string scene_path = get_scene_path(project_name, chapter, scene_id);
        std::ofstream file(scene_path);
        if (!file.is_open()) {
            std::cerr << "Failed to open file: " << scene_path << std::endl;
            return false;
        }

        file << code;
        file.close();

        std::cout << "Wrote scene: " << scene_path << std::endl;
        return true;

    } catch (const std::exception& e) {
        std::cerr << "Error writing scene: " << e.what() << std::endl;
        return false;
    }
}

bool FileManager::write_chapter_header(const std::string& project_name,
                                        const std::string& chapter,
                                        const std::string& header_code) {
    try {
        std::string chapter_path = get_chapter_path(project_name, chapter);
        if (!ensure_directory(chapter_path)) {
            return false;
        }

        std::string header_path = chapter_path + "/" + chapter + ".h";
        std::ofstream file(header_path);
        if (!file.is_open()) {
            std::cerr << "Failed to open header file: " << header_path << std::endl;
            return false;
        }

        file << header_code;
        file.close();

        std::cout << "Wrote chapter header: " << header_path << std::endl;
        return true;

    } catch (const std::exception& e) {
        std::cerr << "Error writing chapter header: " << e.what() << std::endl;
        return false;
    }
}

std::vector<std::string> FileManager::list_scenes(const std::string& project_name,
                                                    const std::string& chapter) {
    std::vector<std::string> scenes;

    try {
        std::string chapter_path = get_chapter_path(project_name, chapter);
        if (!fs::exists(chapter_path)) {
            return scenes;
        }

        for (const auto& entry : fs::directory_iterator(chapter_path)) {
            if (entry.is_regular_file() && entry.path().extension() == ".c") {
                scenes.push_back(entry.path().stem().string());
            }
        }

    } catch (const std::exception& e) {
        std::cerr << "Error listing scenes: " << e.what() << std::endl;
    }

    return scenes;
}

std::string FileManager::read_scene(const std::string& project_name,
                                     const std::string& chapter,
                                     const std::string& scene_id) {
    try {
        std::string scene_path = get_scene_path(project_name, chapter, scene_id);
        std::ifstream file(scene_path);
        if (!file.is_open()) {
            std::cerr << "Failed to open scene file: " << scene_path << std::endl;
            return "";
        }

        std::stringstream buffer;
        buffer << file.rdbuf();
        return buffer.str();

    } catch (const std::exception& e) {
        std::cerr << "Error reading scene: " << e.what() << std::endl;
        return "";
    }
}

bool FileManager::delete_scene(const std::string& project_name,
                                const std::string& chapter,
                                const std::string& scene_id) {
    try {
        std::string scene_path = get_scene_path(project_name, chapter, scene_id);
        if (!fs::exists(scene_path)) {
            return false;
        }

        fs::remove(scene_path);
        std::cout << "Deleted scene: " << scene_path << std::endl;
        return true;

    } catch (const std::exception& e) {
        std::cerr << "Error deleting scene: " << e.what() << std::endl;
        return false;
    }
}

std::vector<std::string> FileManager::list_chapters(const std::string& project_name) {
    std::vector<std::string> chapters;

    try {
        std::string project_path = get_project_path(project_name);
        if (!fs::exists(project_path)) {
            return chapters;
        }

        for (const auto& entry : fs::directory_iterator(project_path)) {
            if (entry.is_directory()) {
                std::string dir_name = entry.path().filename().string();
                if (dir_name != "metadata.json") {
                    chapters.push_back(dir_name);
                }
            }
        }

    } catch (const std::exception& e) {
        std::cerr << "Error listing chapters: " << e.what() << std::endl;
    }

    return chapters;
}

json FileManager::get_project_metadata(const std::string& project_name) {
    try {
        std::string metadata_path = get_project_path(project_name) + "/metadata.json";
        if (!fs::exists(metadata_path)) {
            return json::object();
        }

        std::ifstream file(metadata_path);
        if (!file.is_open()) {
            return json::object();
        }

        json metadata;
        file >> metadata;
        return metadata;

    } catch (const std::exception& e) {
        std::cerr << "Error reading metadata: " << e.what() << std::endl;
        return json::object();
    }
}

bool FileManager::update_project_metadata(const std::string& project_name,
                                           const json& metadata) {
    try {
        std::string project_path = get_project_path(project_name);
        if (!ensure_directory(project_path)) {
            return false;
        }

        std::string metadata_path = project_path + "/metadata.json";
        std::ofstream file(metadata_path);
        if (!file.is_open()) {
            std::cerr << "Failed to open metadata file: " << metadata_path << std::endl;
            return false;
        }

        file << metadata.dump(2);  // Pretty print with 2 spaces
        file.close();

        std::cout << "Updated project metadata: " << metadata_path << std::endl;
        return true;

    } catch (const std::exception& e) {
        std::cerr << "Error updating metadata: " << e.what() << std::endl;
        return false;
    }
}
