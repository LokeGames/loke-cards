#include <loke/scene.h>
#include "chapter01.h"

void scene_hills(GameState* state) {
    SceneContext* ctx = get_current_context();
    scene_set_text(ctx, "Nogle bakker");
    scene_add_option(ctx, "Løb hjem", scene_home, true);
}
