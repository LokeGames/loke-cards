#pragma once
#include <string>
#include <vector>

// Generate scene C code from JSON payload (frontend format)
std::string generate_scene_code_from_json(const std::string &sceneId,
                                          const std::string &chapterId,
                                          const std::string &json);

// Generate simple chapter header with forward declarations and optional meta comment
std::string generate_chapter_header_basic(const std::string &chapterId,
                                          const std::vector<std::string> &sceneIds,
                                          const std::string &meta = "");
