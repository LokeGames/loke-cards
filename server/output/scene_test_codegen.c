#include <loke/scene.h>
#include "chapter01.h"

void scene_test_codegen(GameState* state) {
    SceneContext* ctx = get_current_context();
    scene_set_text(ctx, "Test");
    scene_add_option(ctx, "Continue", NULL, true);
}
