#include <httplib.h>
#include <nlohmann/json.hpp>
#include "code_generator.h"
#include "file_manager.h"
#include <iostream>
#include <string>

using json = nlohmann::json;

// CORS middleware
void setup_cors(httplib::Response& res) {
    res.set_header("Access-Control-Allow-Origin", "*");
    res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

int main(int argc, char* argv[]) {
    // Configuration
    const char* host = "0.0.0.0";
    int port = 3000;
    std::string projects_base_path = "./projects";

    // Parse command line arguments
    for (int i = 1; i < argc; i++) {
        std::string arg = argv[i];
        if (arg == "--port" && i + 1 < argc) {
            port = std::stoi(argv[++i]);
        } else if (arg == "--projects-path" && i + 1 < argc) {
            projects_base_path = argv[++i];
        } else if (arg == "--help") {
            std::cout << "Loke Cards Server\n";
            std::cout << "Usage: loke-cards-server [options]\n";
            std::cout << "Options:\n";
            std::cout << "  --port <port>           Port to listen on (default: 3000)\n";
            std::cout << "  --projects-path <path>  Base path for projects (default: ./projects)\n";
            std::cout << "  --help                  Show this help message\n";
            return 0;
        }
    }

    // Initialize file manager
    FileManager file_manager(projects_base_path);

    // Create HTTP server
    httplib::Server svr;

    std::cout << "🚀 Loke Cards Server starting...\n";
    std::cout << "📁 Projects path: " << projects_base_path << "\n";
    std::cout << "🌐 Listening on http://" << host << ":" << port << "\n";

    // CORS preflight for all routes
    svr.Options(".*", [](const httplib::Request&, httplib::Response& res) {
        setup_cors(res);
        res.set_content("", "text/plain");
    });

    // =============================================================================
    // API ENDPOINTS
    // =============================================================================

    // GET /api/health - Health check
    svr.Get("/api/health", [](const httplib::Request&, httplib::Response& res) {
        setup_cors(res);
        json response = {
            {"status", "ok"},
            {"service", "loke-cards-server"},
            {"version", "1.0.0"}
        };
        res.set_content(response.dump(), "application/json");
    });

    // POST /api/projects/:project/chapters/:chapter/scenes - Create/update scene
    svr.Post("/api/projects/:project/chapters/:chapter/scenes",
        [&file_manager](const httplib::Request& req, httplib::Response& res) {
            setup_cors(res);

            try {
                std::string project_name = req.path_params.at("project");
                std::string chapter = req.path_params.at("chapter");

                // Parse JSON body
                json scene_data = json::parse(req.body);
                SceneCard card = parse_scene_json(scene_data);

                // Validate scene ID
                if (!validate_scene_id(card.scene_id)) {
                    json error_response = {
                        {"success", false},
                        {"error", "Invalid scene ID: must be valid C identifier"}
                    };
                    res.status = 400;
                    res.set_content(error_response.dump(), "application/json");
                    return;
                }

                // Generate C code
                std::string code = generate_scene_code(card);

                // Write scene file
                bool success = file_manager.write_scene(project_name, chapter, card.scene_id, code);

                if (!success) {
                    json error_response = {
                        {"success", false},
                        {"error", "Failed to write scene file"}
                    };
                    res.status = 500;
                    res.set_content(error_response.dump(), "application/json");
                    return;
                }

                // Update chapter header
                std::vector<std::string> scenes = file_manager.list_scenes(project_name, chapter);
                std::string header_code = generate_chapter_header(chapter, scenes);
                file_manager.write_chapter_header(project_name, chapter, header_code);

                // Success response
                json response = {
                    {"success", true},
                    {"scene_id", card.scene_id},
                    {"chapter", chapter},
                    {"file_path", "./" + project_name + "/" + chapter + "/" + card.scene_id + ".c"}
                };
                res.set_content(response.dump(), "application/json");

            } catch (const json::exception& e) {
                json error_response = {
                    {"success", false},
                    {"error", std::string("JSON parse error: ") + e.what()}
                };
                res.status = 400;
                res.set_content(error_response.dump(), "application/json");
            } catch (const std::exception& e) {
                json error_response = {
                    {"success", false},
                    {"error", std::string("Server error: ") + e.what()}
                };
                res.status = 500;
                res.set_content(error_response.dump(), "application/json");
            }
        });

    // GET /api/projects/:project/chapters/:chapter/scenes - List scenes
    svr.Get("/api/projects/:project/chapters/:chapter/scenes",
        [&file_manager](const httplib::Request& req, httplib::Response& res) {
            setup_cors(res);

            std::string project_name = req.path_params.at("project");
            std::string chapter = req.path_params.at("chapter");

            std::vector<std::string> scenes = file_manager.list_scenes(project_name, chapter);

            json response = {
                {"success", true},
                {"project", project_name},
                {"chapter", chapter},
                {"scenes", scenes},
                {"count", scenes.size()}
            };

            res.set_content(response.dump(), "application/json");
        });

    // GET /api/projects/:project/chapters/:chapter/scenes/:scene - Get scene source
    svr.Get("/api/projects/:project/chapters/:chapter/scenes/:scene",
        [&file_manager](const httplib::Request& req, httplib::Response& res) {
            setup_cors(res);

            std::string project_name = req.path_params.at("project");
            std::string chapter = req.path_params.at("chapter");
            std::string scene_id = req.path_params.at("scene");

            std::string code = file_manager.read_scene(project_name, chapter, scene_id);

            if (code.empty()) {
                json error_response = {
                    {"success", false},
                    {"error", "Scene not found"}
                };
                res.status = 404;
                res.set_content(error_response.dump(), "application/json");
                return;
            }

            json response = {
                {"success", true},
                {"scene_id", scene_id},
                {"chapter", chapter},
                {"code", code}
            };

            res.set_content(response.dump(), "application/json");
        });

    // DELETE /api/projects/:project/chapters/:chapter/scenes/:scene - Delete scene
    svr.Delete("/api/projects/:project/chapters/:chapter/scenes/:scene",
        [&file_manager](const httplib::Request& req, httplib::Response& res) {
            setup_cors(res);

            std::string project_name = req.path_params.at("project");
            std::string chapter = req.path_params.at("chapter");
            std::string scene_id = req.path_params.at("scene");

            bool success = file_manager.delete_scene(project_name, chapter, scene_id);

            if (!success) {
                json error_response = {
                    {"success", false},
                    {"error", "Failed to delete scene"}
                };
                res.status = 404;
                res.set_content(error_response.dump(), "application/json");
                return;
            }

            // Regenerate chapter header
            std::vector<std::string> scenes = file_manager.list_scenes(project_name, chapter);
            std::string header_code = generate_chapter_header(chapter, scenes);
            file_manager.write_chapter_header(project_name, chapter, header_code);

            json response = {
                {"success", true},
                {"deleted", scene_id}
            };

            res.set_content(response.dump(), "application/json");
        });

    // GET /api/projects/:project/chapters - List chapters
    svr.Get("/api/projects/:project/chapters",
        [&file_manager](const httplib::Request& req, httplib::Response& res) {
            setup_cors(res);

            std::string project_name = req.path_params.at("project");
            std::vector<std::string> chapters = file_manager.list_chapters(project_name);

            json response = {
                {"success", true},
                {"project", project_name},
                {"chapters", chapters},
                {"count", chapters.size()}
            };

            res.set_content(response.dump(), "application/json");
        });

    // GET /api/projects/:project - Get project info
    svr.Get("/api/projects/:project",
        [&file_manager](const httplib::Request& req, httplib::Response& res) {
            setup_cors(res);

            std::string project_name = req.path_params.at("project");
            json metadata = file_manager.get_project_metadata(project_name);
            std::vector<std::string> chapters = file_manager.list_chapters(project_name);

            // Count total scenes
            int total_scenes = 0;
            for (const auto& chapter : chapters) {
                total_scenes += file_manager.list_scenes(project_name, chapter).size();
            }

            json response = {
                {"success", true},
                {"project", project_name},
                {"metadata", metadata},
                {"chapters", chapters},
                {"chapter_count", chapters.size()},
                {"scene_count", total_scenes}
            };

            res.set_content(response.dump(), "application/json");
        });

    // POST /api/projects - Create new project
    svr.Post("/api/projects",
        [&file_manager](const httplib::Request& req, httplib::Response& res) {
            setup_cors(res);

            try {
                json project_data = json::parse(req.body);
                std::string project_name = project_data.value("project_name", "");

                if (project_name.empty()) {
                    json error_response = {
                        {"success", false},
                        {"error", "Project name is required"}
                    };
                    res.status = 400;
                    res.set_content(error_response.dump(), "application/json");
                    return;
                }

                // Create metadata
                json metadata = {
                    {"project_name", project_name},
                    {"created_at", std::time(nullptr)},
                    {"description", project_data.value("description", "")},
                    {"author", project_data.value("author", "")}
                };

                bool success = file_manager.update_project_metadata(project_name, metadata);

                json response = {
                    {"success", success},
                    {"project", project_name},
                    {"metadata", metadata}
                };

                res.set_content(response.dump(), "application/json");

            } catch (const json::exception& e) {
                json error_response = {
                    {"success", false},
                    {"error", std::string("JSON parse error: ") + e.what()}
                };
                res.status = 400;
                res.set_content(error_response.dump(), "application/json");
            }
        });

    // Start server
    std::cout << "✅ Server ready!\n\n";

    if (!svr.listen(host, port)) {
        std::cerr << "❌ Failed to start server on port " << port << std::endl;
        return 1;
    }

    return 0;
}
