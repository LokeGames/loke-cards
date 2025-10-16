#include <iostream>
#include "httplib.h"

int main(void) {
    httplib::Server svr;

    svr.Get("/hi", [](const httplib::Request &, httplib::Response &res) {
        res.set_header("Access-Control-Allow-Origin", "https://loke.tail2d448.ts.net:8443");
        res.set_content("Hello World!", "text/plain");
    });

    std::cout << "Server is running on port 3000..." << std::endl;
    svr.listen("0.0.0.0", 3000);
}
