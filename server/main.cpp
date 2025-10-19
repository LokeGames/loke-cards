#include <iostream>
#include <vector>
#include <string>
#include <mutex>
#include "httplib.h"

// Very small in-memory dev stub for /api endpoints used by the frontend.
// This is NOT a production backend, only to enable local testing with Vite.

static std::vector<std::string> chapters;   // store raw JSON bodies (objects)
static std::vector<std::string> scenes;     // store raw JSON bodies (objects)
static std::mutex storage_mutex;

static std::string to_json_array(const std::vector<std::string> &items) {
    std::string out = "[";
    for (size_t i = 0; i < items.size(); ++i) {
        out += items[i];
        if (i + 1 < items.size()) out += ",";
    }
    out += "]";
    return out;
}

int main(void) {
    httplib::Server svr;

    // Simple health check
    svr.Get("/api/health", [](const httplib::Request &, httplib::Response &res) {
        res.set_content("{\"status\":\"ok\"}", "application/json");
    });

    // Chapters
    svr.Get("/api/chapters", [](const httplib::Request &, httplib::Response &res) {
        std::lock_guard<std::mutex> lock(storage_mutex);
        res.set_content(to_json_array(chapters), "application/json");
    });

    svr.Post("/api/chapters", [](const httplib::Request &req, httplib::Response &res) {
        std::lock_guard<std::mutex> lock(storage_mutex);
        // naive: assume req.body is a JSON object, store as-is
        if (req.body.empty()) {
            res.status = 400;
            res.set_content("{\"message\":\"Empty body\"}", "application/json");
            return;
        }
        chapters.push_back(req.body);
        res.set_content(req.body, "application/json");
    });

    // Scenes
    svr.Get("/api/scenes", [](const httplib::Request &, httplib::Response &res) {
        std::lock_guard<std::mutex> lock(storage_mutex);
        res.set_content(to_json_array(scenes), "application/json");
    });

    svr.Post("/api/scenes", [](const httplib::Request &req, httplib::Response &res) {
        std::lock_guard<std::mutex> lock(storage_mutex);
        if (req.body.empty()) {
            res.status = 400;
            res.set_content("{\"message\":\"Empty body\"}", "application/json");
            return;
        }
        scenes.push_back(req.body);
        res.set_content(req.body, "application/json");
    });

    // Legacy test endpoint
    svr.Get("/hi", [](const httplib::Request &, httplib::Response &res) {
        res.set_content("Hello World!", "text/plain");
    });

    std::cout << "Dev API server is running on http://127.0.0.1:3000" << std::endl;
    svr.listen("0.0.0.0", 3000);
}
