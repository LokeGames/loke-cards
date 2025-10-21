import { ref, computed } from 'vue';

/**
 * useCodeGenerator - Composable for generating loke-engine compatible C code
 *
 * Generates C code from scene data following the loke-engine format specification
 * as defined in /doc/LOKE-FORMAT-REFERENCE.md
 *
 * @returns {Object} - Code generation functions and reactive generated code
 */
export function useCodeGenerator() {
  const generatedCode = ref('');

  /**
   * Escape C string literals
   * Handles: quotes, backslashes, newlines, tabs
   */
  function escapeCString(str) {
    if (!str) return '';
    return str
      .replace(/\\/g, '\\\\')   // Backslash must be first
      .replace(/"/g, '\\"')      // Escape quotes
      .replace(/\n/g, '\\n')     // Newline
      .replace(/\t/g, '\\t')     // Tab
      .replace(/\r/g, '');       // Remove carriage returns
  }

  /**
   * Split long text into multiple lines for better readability
   * Max 80 chars per line (C convention)
   */
  function splitLongText(text, maxLength = 80) {
    if (!text || text.length <= maxLength) {
      return [`"${escapeCString(text)}"`];
    }

    const lines = [];
    let current = '';
    const words = text.split(' ');

    for (const word of words) {
      if (current.length + word.length + 1 > maxLength) {
        if (current) {
          lines.push(`"${escapeCString(current)} "`);
          current = word;
        } else {
          // Word itself is longer than maxLength
          lines.push(`"${escapeCString(word)} "`);
        }
      } else {
        current += (current ? ' ' : '') + word;
      }
    }

    if (current) {
      lines.push(`"${escapeCString(current)}"`);
    }

    return lines;
  }

  /**
   * Generate state modifications code
   */
  function generateStateChanges(stateChanges) {
    if (!stateChanges || stateChanges.length === 0) {
      return '';
    }

    const lines = stateChanges
      .filter(change => change.variable && change.operator && change.value !== undefined)
      .map(change => {
        const { variable, operator, value } = change;

        // Handle boolean values
        if (value === 'true' || value === 'false') {
          return `    state->${variable} = ${value};`;
        }

        // Handle numeric values
        if (operator === '=') {
          return `    state->${variable} = ${value};`;
        } else {
          return `    state->${variable} ${operator} ${value};`;
        }
      });

    return lines.length > 0
      ? '\n    // State modifications\n' + lines.join('\n') + '\n'
      : '';
  }

  /**
   * Generate scene options code
   */
  function generateOptions(choices) {
    if (!choices || choices.length === 0) {
      return '    scene_add_option(ctx, "Continue", NULL, true);  // TODO: Set next scene\n';
    }

    return choices
      .map(choice => {
        const text = escapeCString(choice.text || 'Option');
        const nextScene = choice.nextScene || 'NULL';
        const enabled = choice.enabled !== false ? 'true' : 'false';

        return `    scene_add_option(ctx, "${text}", ${nextScene}, ${enabled});`;
      })
      .join('\n') + '\n';
  }

  /**
   * Generate complete scene function code
   *
   * @param {Object} sceneData - Scene data object
   * @param {string} sceneData.sceneId - Scene function name (e.g., "scene_forest_entrance")
   * @param {string} sceneData.chapterId - Chapter ID (e.g., "chapter01")
   * @param {string} sceneData.sceneText - Scene description text
   * @param {Array} sceneData.choices - Array of choice objects
   * @param {Array} sceneData.stateChanges - Array of state modification objects
   * @returns {string} - Complete C code for the scene
   */
  function generateSceneCode(sceneData) {
    const {
      sceneId = 'scene_unnamed',
      chapterId = 'chapter01',
      sceneText = '',
      choices = [],
      stateChanges = []
    } = sceneData;

    // Generate includes
    const includes = `#include <loke/scene.h>\n#include "${chapterId}.h"\n`;

    // Generate function signature
    const signature = `\nvoid ${sceneId}(GameState* state) {`;

    // Generate context
    const context = `\n    SceneContext* ctx = get_current_context();`;

    // Generate state changes (before text)
    const stateCode = generateStateChanges(stateChanges);

    // Generate scene text
    const textLines = splitLongText(sceneText);
    let textCode = '\n    scene_set_text(ctx,\n';
    if (textLines.length === 1) {
      textCode = `\n    scene_set_text(ctx, ${textLines[0]});\n`;
    } else {
      textCode += textLines.map((line, i) =>
        i === textLines.length - 1
          ? `        ${line}\n    );`
          : `        ${line}`
      ).join('\n') + '\n';
    }

    // Generate options
    const optionsCode = '\n' + generateOptions(choices);

    // Combine all parts
    const closeFunction = '}\n';

    generatedCode.value =
      includes +
      signature +
      context +
      stateCode +
      textCode +
      optionsCode +
      closeFunction;

    return generatedCode.value;
  }

  /**
   * Generate chapter header file (.h)
   *
   * @param {string} chapterId - Chapter ID (e.g., "chapter01")
   * @param {Array} sceneIds - Array of scene function names
   * @returns {string} - Complete chapter header code
   */
  function generateChapterHeader(chapterId, sceneIds = []) {
    const guardName = chapterId.toUpperCase() + '_H';

    const includes = `#ifndef ${guardName}\n#define ${guardName}\n\n#include <loke/scene.h>\n`;

    const declarations = sceneIds.length > 0
      ? '\n// Forward declarations for all scenes in this chapter\n' +
        sceneIds.map(id => `void ${id}(GameState* state);`).join('\n') + '\n'
      : '\n// Add scene declarations here\n';

    const close = `\n#endif // ${guardName}\n`;

    return includes + declarations + close;
  }

  return {
    generatedCode: computed(() => generatedCode.value),
    generateSceneCode,
    generateChapterHeader,
    escapeCString,
  };
}
