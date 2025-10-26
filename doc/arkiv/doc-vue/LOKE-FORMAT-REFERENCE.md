# Loke-Engine Format Reference

This document describes the exact C code format that loke-cards must generate.

## Scene Function Structure

Based on `/home/ubuntu/loke-engine/include/loke/scene.h` and examples from `simple-adventure`.

### Basic Scene Template

```c
#include <loke/scene.h>
#include "chapter_name.h"

void scene_NAME(GameState* state) {
    SceneContext* ctx = get_current_context();

    scene_set_text(ctx, "Scene description text here.\n");

    scene_add_option(ctx, "Choice 1 text", scene_next_1, true);
    scene_add_option(ctx, "Choice 2 text", scene_next_2, true);
}
```

### Scene with State Modifications

```c
void scene_NAME(GameState* state) {
    SceneContext* ctx = get_current_context();

    // Modify state BEFORE setting text
    state->gold += 10;
    state->has_key = true;
    state->health -= 5;

    scene_set_text(ctx, "You found 10 gold!\n");
    scene_add_option(ctx, "Continue", scene_next, true);
}
```

### Scene with Dynamic Text (snprintf)

```c
void scene_NAME(GameState* state) {
    SceneContext* ctx = get_current_context();

    char buffer[MAX_TEXT_LENGTH];
    snprintf(buffer, MAX_TEXT_LENGTH,
        "You enter the shop.\n\n"
        "[HP: %d | Gold: %d]\n",
        state->health, state->gold
    );

    scene_set_text(ctx, buffer);
    scene_add_option(ctx, "Leave", scene_forest, true);
}
```

### Scene with Conditional Options

```c
void scene_shop(GameState* state) {
    SceneContext* ctx = get_current_context();

    scene_set_text(ctx, "Welcome to the shop!\n");

    // Conditional option based on gold
    if (state->gold >= 50) {
        scene_add_option(ctx, "Buy sword (50g)", scene_buy_sword, true);
    } else {
        scene_add_option(ctx, "Buy sword (50g) - Too expensive!", NULL, false);
    }

    scene_add_option(ctx, "Leave", scene_forest, true);
}
```

### Scene with Forward Declaration

```c
#include <loke/scene.h>
#include "chapter01.h"

// Forward declaration to next chapter
extern void scene_ch02_riverside(GameState* state);

void scene_ch01_ending(GameState* state) {
    SceneContext* ctx = get_current_context();

    scene_set_text(ctx, "Chapter 1 complete!\n");
    scene_add_option(ctx, "Continue to Chapter 2", scene_ch02_riverside, true);
}
```

## GameState Structure

```c
typedef struct {
    // Core stats
    int health;         // 0-100 typical
    int gold;           // Money
    int karma;          // -100 to +100
    int progress;       // 0-100 percentage

    // Standard flags
    bool has_key;
    bool has_sword;
    bool has_map;

    // Custom flags
    int custom_flags[32];  // Use 0 or 1

    // Advanced (Phase 1-Extended)
    const char* boons[16];
    int boon_count;
    const char* inventory[32];
    int inventory_count;
    const char* equipped_weapon;
    const char* equipped_armor;

    // System (read-only)
    bool dev_mode;
    bool disable_save;
} GameState;
```

## File Organization

### Project Structure
```
/project_name/
├── chapter01/
│   ├── chapter01.h          # Header with forward declarations
│   ├── intro.c              # Scene: scene_ch01_intro
│   ├── forest_path.c        # Scene: scene_ch01_forest_path
│   └── investigate.c        # Scene: scene_ch01_investigate
├── chapter02/
│   ├── chapter02.h
│   ├── riverside.c
│   └── mountain_base.c
└── metadata.json            # Project metadata (TBD format)
```

### Chapter Header Template (chapter01.h)

```c
#ifndef CHAPTER01_H
#define CHAPTER01_H

#include <loke/scene.h>

// Forward declarations for all scenes in this chapter
void scene_ch01_intro(GameState* state);
void scene_ch01_forest_path(GameState* state);
void scene_ch01_investigate(GameState* state);

#endif // CHAPTER01_H
```

## Naming Conventions

### Scene Function Names
- Format: `scene_<chapter>_<name>`
- Examples:
  - `scene_ch01_intro`
  - `scene_ch01_forest_path`
  - `scene_ch02_riverside`
- Must be valid C identifiers (alphanumeric + underscore)
- No spaces, dashes, or special characters

### File Names
- Use lowercase with underscores
- Match scene name (without `scene_` prefix)
- Examples:
  - `intro.c` for `scene_ch01_intro`
  - `forest_path.c` for `scene_ch01_forest_path`

### Chapter Names
- Format: `chapter<number>` or `chapter<number>_<name>`
- Examples:
  - `chapter01`
  - `chapter01_awakening`
  - `chapter02_journey`

## API Limits

```c
#define MAX_TEXT_LENGTH 2048    // Maximum scene text length
#define MAX_OPTIONS 10          // Maximum options per scene
#define MAX_OPTION_TEXT 256     // Maximum option text length
```

## Common State Operations

### Health Management
```c
state->health += 10;   // Heal
state->health -= 20;   // Damage
if (state->health <= 0) {
    scene_add_option(ctx, "You died...", scene_game_over, true);
}
```

### Gold Management
```c
state->gold += 50;     // Gain gold
state->gold -= 100;    // Spend gold
if (state->gold >= 100) {
    // Player can afford item
}
```

### Item Flags
```c
state->has_key = true;       // Pick up item
state->has_sword = true;
state->has_map = true;

if (state->has_key) {
    scene_add_option(ctx, "Unlock door", scene_inside, true);
}
```

### Custom Flags
```c
state->custom_flags[0] = 1;  // met_wizard
state->custom_flags[1] = 1;  // solved_puzzle
state->custom_flags[2] = 1;  // saw_dragon

if (state->custom_flags[0]) {
    // Player has met wizard
}
```

### Progress Tracking
```c
set_progress(state, 25);     // Set to 25%
increment_progress(state, 5); // Add 5%
int prog = get_progress(state);
```

## Scene Patterns

### Pattern 1: Simple Linear Scene
```c
void scene_name(GameState* state) {
    SceneContext* ctx = get_current_context();
    scene_set_text(ctx, "Description.\n");
    scene_add_option(ctx, "Continue", scene_next, true);
}
```

### Pattern 2: Branching Scene
```c
void scene_name(GameState* state) {
    SceneContext* ctx = get_current_context();
    scene_set_text(ctx, "Which way?\n");
    scene_add_option(ctx, "Left", scene_left, true);
    scene_add_option(ctx, "Right", scene_right, true);
}
```

### Pattern 3: State-Changing Scene
```c
void scene_name(GameState* state) {
    SceneContext* ctx = get_current_context();

    state->gold += 50;
    state->karma += 10;

    scene_set_text(ctx, "You helped the old man. He gives you 50 gold.\n");
    scene_add_option(ctx, "Continue", scene_next, true);
}
```

### Pattern 4: Conditional Scene
```c
void scene_name(GameState* state) {
    SceneContext* ctx = get_current_context();

    scene_set_text(ctx, "A locked door blocks your path.\n");

    if (state->has_key) {
        scene_add_option(ctx, "Unlock door", scene_inside, true);
    } else {
        scene_add_option(ctx, "Door is locked (need key)", NULL, false);
    }

    scene_add_option(ctx, "Go back", scene_previous, true);
}
```

### Pattern 5: Game Over Scene
```c
void scene_victory(GameState* state) {
    SceneContext* ctx = get_current_context();
    scene_set_text(ctx, "You won! Congratulations!\n");
    scene_end_game(ctx);  // No options - game ends
}
```

## String Escaping

C string literals require escaping:
- `\n` - Newline
- `\"` - Quote
- `\\` - Backslash
- `\t` - Tab

### Example
```c
scene_set_text(ctx, "He said, \"Hello!\"\n");
// Output: He said, "Hello!"
```

## Multi-line Strings

Use string concatenation for long text:

```c
scene_set_text(ctx,
    "This is a very long description "
    "that spans multiple lines.\n\n"
    "You can break it up like this.\n"
);
```

## Comments

```c
// Single-line comment

/*
 * Multi-line comment
 * for longer explanations
 */
```

## Error Handling

### Invalid Scene Reference
```c
// If next_scene doesn't exist, use NULL and disabled:
scene_add_option(ctx, "Not yet implemented", NULL, false);
```

### Missing State Initialization
```c
// Always initialize state on first scene:
if (state->health == 0) {
    state->health = 100;
    state->gold = 0;
    state->karma = 0;
}
```

## References

- **API Header**: `/home/ubuntu/loke-engine/include/loke/scene.h`
- **Man Page**: `man scene.h`
- **Examples**: `/home/ubuntu/loke-engine/examples/simple-adventure/`
- **Documentation**: `~/loke-docs/man/GAME-INTEGRATION-GUIDE.md`
