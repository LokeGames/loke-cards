#include <loke/scene.h>
#include "chapter01.h"

void scene_playwright_test(GameState* state) {
    SceneContext* ctx = get_current_context();
    scene_set_text(ctx, "Hello from Playwright");
    scene_add_option(ctx, "Continue", NULL, true);
}
