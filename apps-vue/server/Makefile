CXX ?= clang++
CXXFLAGS ?= -I. -Iinclude -std=c++17 -pthread -O0 -g -Wall -Wextra
LDFLAGS = -lsqlite3

all: server

SRC := main.cpp src/codegen.cpp
server: $(SRC)
	$(CXX) $(CXXFLAGS) -o server $(SRC) $(LDFLAGS)

# ===== Loke Engine integration (compile generated scenes) =====
# Set LOKE_ENGINE_INC to the include directory that contains loke/scene.h
# e.g., export LOKE_ENGINE_INC=/opt/homebrew/include or $(LOKE_ENGINE_ROOT)/include
LOKE_ENGINE_INC ?=

SCENES_DIR ?= output
BUILD_DIR ?= build

.PHONY: build-scenes clean-scenes check-loke help

help:
	@echo "Targets:"
	@echo "  make server          - build API server"
	@echo "  make build-scenes    - compile generated .c scenes in $(SCENES_DIR) (needs LOKE_ENGINE_INC)"
	@echo "  make clean-scenes    - remove compiled scene objects in $(BUILD_DIR)"
	@echo "  make check-loke      - check for Loke Engine headers"

check-loke:
	@if [ -z "$(LOKE_ENGINE_INC)" ]; then \
	  echo "LOKE_ENGINE_INC is not set. Set it to the include path containing loke/scene.h"; \
	  echo "Example: export LOKE_ENGINE_INC=/opt/homebrew/include"; \
	  exit 1; \
	fi
	@if [ ! -f "$(LOKE_ENGINE_INC)/loke/scene.h" ]; then \
	  echo "loke/scene.h not found under $(LOKE_ENGINE_INC)."; \
	  exit 1; \
	else \
	  echo "Found Loke Engine headers at $(LOKE_ENGINE_INC)"; \
	fi

$(BUILD_DIR):
	@mkdir -p $(BUILD_DIR)

build-scenes: check-loke $(BUILD_DIR)
	@set -e; \
	shopt -s nullglob; \
	for f in $(SCENES_DIR)/*.c; do \
	  echo "Compiling $$f"; \
	  $(CC) -I"$(LOKE_ENGINE_INC)" -c "$$f" -o "$(BUILD_DIR)/$$(basename $$f .c).o"; \
	done; \
	echo "Done. Objects in $(BUILD_DIR)";

clean-scenes:
	@rm -rf $(BUILD_DIR)

doxygen: Doxyfile
	doxygen Doxyfile

doc: doxygen

clean:
	rm -f server
	rm -rf man
	rm -rf $(BUILD_DIR)

.PHONY: all server doxygen doc clean
