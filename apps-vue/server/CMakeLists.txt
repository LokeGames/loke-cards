cmake_minimum_required(VERSION 3.15)
project(loke-cards-server VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Include directories
include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/include
    ${CMAKE_CURRENT_SOURCE_DIR}/../external/cpp-httplib
    ${CMAKE_CURRENT_SOURCE_DIR}/../external/json/include
)

# Server executable
add_executable(loke-cards-server
    src/main.cpp
    src/code_generator.cpp
    src/file_manager.cpp
)

# Enable CORS for cpp-httplib
target_compile_definitions(loke-cards-server PRIVATE CPPHTTPLIB_OPENSSL_SUPPORT)

# Link libraries
find_package(Threads REQUIRED)
find_package(OpenSSL REQUIRED)
target_link_libraries(loke-cards-server PRIVATE
    Threads::Threads
    OpenSSL::SSL
    OpenSSL::Crypto
)

# Install target
install(TARGETS loke-cards-server DESTINATION bin)
