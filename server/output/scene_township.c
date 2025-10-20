/*
META:
Dette er den lille by i nord
*/
#include <loke/scene.h>
#include "chapter01.h"

void scene_township(GameState* state) {
    SceneContext* ctx = get_current_context();
    // State modifications
    state->Forrest = 1;
    scene_set_text(ctx, "Bla bla bla");
    scene_add_option(ctx, "walk to forrest ", scene_forrest, true);
    scene_add_option(ctx, "walk to house", scene_house, true);
}
