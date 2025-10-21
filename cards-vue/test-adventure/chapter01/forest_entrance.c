#include <loke/scene.h>
#include "chapter01.h"


void scene_forest_entrance(GameState* state) {
    SceneContext* ctx = get_current_context();

    scene_set_text(ctx, "You stand at the entrance to a dark forest.\\nA narrow path leads deeper into the trees.\\n");

    // Choices
    scene_add_option(ctx, "Enter the forest", scene_forest_path, true);
    scene_add_option(ctx, "Return to village", scene_village, true);
}
