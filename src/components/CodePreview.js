/**
 * Code Preview Component
 * Generates and displays C code for a scene.
 */

/**
 * Generates C code for a scene.
 * @param {Object} sceneData - The scene data.
 * @returns {string}
 */
export function generateCCode(sceneData) {
  let code = `#include <loke/scene.h>\n#include "${sceneData.chapter || 'chapter_name'}.h"\n\n`;
  code += `void ${sceneData.id || 'scene_name'}(GameState* state) {\n`;
  code += `    SceneContext* ctx = get_current_context();\n\n`;

  if (sceneData.stateChanges && sceneData.stateChanges.length > 0) {
    sceneData.stateChanges.forEach(change => {
      code += `    state->${change.variable} ${change.operator} ${change.value};\n`;
    });
    code += `\n`;
  }

  code += `    scene_set_text(ctx, "${(sceneData.sceneText || '').replace(/\n/g, '\\n')}");\n`;

  if (sceneData.choices && sceneData.choices.length > 0) {
    sceneData.choices.forEach(choice => {
      code += `    scene_add_option(ctx, "${choice.text}", ${choice.nextScene || 'NULL'}, ${choice.enabled});\n`;
    });
  }

  code += `}\n`;

  return code;
}

/**
 * Creates the code preview element.
 * @param {Object} sceneData - The scene data.
 * @returns {HTMLElement}
 */
export function createCodePreview(sceneData) {
  const codePreview = document.createElement('div');
  codePreview.className = 'bg-gray-800 text-white p-4 rounded-md';
  codePreview.innerHTML = `
    <h3 class="text-lg font-medium text-gray-200 mb-2">C Code Preview</h3>
    <pre><code id="code-preview-content" class="language-c"></code></pre>
    <button id="copy-code-button" class="mt-2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">Copy Code</button>
  `;

  const codeContent = codePreview.querySelector('#code-preview-content');
  codeContent.textContent = generateCCode(sceneData);

  const copyButton = codePreview.querySelector('#copy-code-button');
  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(codeContent.textContent);
  });

  return codePreview;
}
