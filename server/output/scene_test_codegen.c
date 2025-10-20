#include <loke/scene.h>

void scene_test_codegen(GameState* state) {
    SceneContext* ctx = get_current_context();
    scene_add_option(ctx, "Continue", NULL, true);
}
