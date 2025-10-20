#include <loke/scene.h>
#include "chapter_e2e_scene.h"

void scene_e2e_test(GameState* state) {
    SceneContext* ctx = get_current_context();
    scene_set_text(ctx, "E2E scene text");
    scene_add_option(ctx, "Continue", NULL, true);
}
