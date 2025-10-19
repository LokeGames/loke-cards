#include <loke/scene.h>
#include "chapter01.h"

void scene_house(GameState* state) {
    SceneContext* ctx = get_current_context();
    scene_set_text(ctx, "The home");
    scene_add_option(ctx, "Continue", NULL, true);
}
