#include <loke/scene.h>
#include "chapter01.h"

void scene_path(GameState* state) {
    SceneContext* ctx = get_current_context();
    // State modifications
    state->has_key = false;
    scene_set_text(ctx, "En route");
    scene_add_option(ctx, "Go to the forrest", scene_forrest, true);
}
