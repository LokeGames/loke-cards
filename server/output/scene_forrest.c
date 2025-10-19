#include <loke/scene.h>
#include "chapter01.h"

void scene_forrest(GameState* state) {
    SceneContext* ctx = get_current_context();
    scene_set_text(ctx, "Skoven ");
    scene_add_option(ctx, "Tag hjem", scene_home, true);
}
