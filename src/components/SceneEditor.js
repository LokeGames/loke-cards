/**
 * Scene Editor Component
 * Form for creating and editing scenes.
 */

import { isValidCIdentifier } from '../lib/validation.js';
import { setMainContent } from './Layout.js';
import { createCodePreview } from './CodePreview.js';
import { saveScene, getAllChapters, saveDraft } from '../lib/storage.js';
import { emit } from '../lib/state.js';

function createChoice(choice = {}) {
  const choiceElement = document.createElement('div');
  choiceElement.className = 'flex items-center space-x-4';
  choiceElement.innerHTML = `
    <input type="text" value="${choice.text || ''}" class="flex-1 rounded-md border-gray-300 shadow-sm choice-text" placeholder="Choice Text">
    <input type="text" value="${choice.nextScene || ''}" class="flex-1 rounded-md border-gray-300 shadow-sm choice-next-scene" placeholder="Next Scene">
    <label class="flex items-center"><input type="checkbox" ${choice.enabled ? 'checked' : ''} class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 choice-enabled"> Enabled</label>
    <button type="button" class="text-red-500 hover:text-red-700 remove-choice">Remove</button>
  `;
  return choiceElement;
}

function createStateChange(stateChange = {}) {
  const stateChangeElement = document.createElement('div');
  stateChangeElement.className = 'flex items-center space-x-4';
  stateChangeElement.innerHTML = `
    <input type="text" value="${stateChange.variable || ''}" class="flex-1 rounded-md border-gray-300 shadow-sm state-variable" placeholder="Variable (e.g., gold)">
    <select class="rounded-md border-gray-300 shadow-sm state-operator">
      <option ${stateChange.operator === '=' ? 'selected' : ''}>=</option>
      <option ${stateChange.operator === '+' ? 'selected' : ''}>+</option>
      <option ${stateChange.operator === '-' ? 'selected' : ''}>-</option>
    </select>
    <input type="text" value="${stateChange.value || ''}" class="flex-1 rounded-md border-gray-300 shadow-sm state-value" placeholder="Value (e.g., 10)">
    <button type="button" class="text-red-500 hover:text-red-700 remove-state-change">Remove</button>
  `;
  return stateChangeElement;
}

export async function createSceneEditor(scene = {}) {
  // Load chapters for dropdown
  const chapters = await getAllChapters();

  const editor = document.createElement('div');
  editor.className = 'w-full max-w-4xl mx-auto';

  // Build chapter options HTML
  const chapterOptions = chapters.length > 0
    ? chapters.map(ch => `<option value="${ch.id}" ${scene.chapter === ch.id ? 'selected' : ''}>${ch.name || ch.id}</option>`).join('')
    : `<option value="chapter01">Chapter 01</option><option value="chapter02">Chapter 02</option>`;

  editor.innerHTML = `
    <form id="scene-editor-form" class="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-800">${scene.id ? 'Edit Scene' : 'New Scene'}</h2>
        <button type="button" id="toggle-preview" class="text-sm font-medium text-blue-600 hover:text-blue-700">Show Preview</button>
      </div>

      <div>
        <label for="scene-id" class="block text-sm font-medium text-gray-700">Scene ID</label>
        <input type="text" id="scene-id" name="scene-id" value="${scene.id || ''}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="e.g., scene_ch01_start">
        <p id="scene-id-error" class="text-red-500 text-sm mt-1 hidden">Invalid Scene ID. Must be a valid C identifier.</p>
      </div>

      <div>
        <label for="chapter" class="block text-sm font-medium text-gray-700">Chapter</label>
        <select id="chapter" name="chapter" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
          ${chapterOptions}
        </select>
      </div>

      <div>
        <label for="scene-text" class="block text-sm font-medium text-gray-700">Scene Text</label>
        <textarea id="scene-text" name="scene-text" rows="10" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Enter scene text here...">${scene.sceneText || ''}</textarea>
      </div>

      <div>
        <h3 class="text-lg font-medium text-gray-900">Choices</h3>
        <div id="choices-container" class="space-y-4 mt-2">
        </div>
        <button type="button" id="add-choice" class="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700">+ Add Choice</button>
      </div>

      <div>
        <h3 class="text-lg font-medium text-gray-900">State Changes</h3>
        <div id="state-changes-container" class="space-y-4 mt-2">
        </div>
        <button type="button" id="add-state-change" class="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700">+ Add State Change</button>
      </div>

      <div id="save-message" class="hidden text-sm"></div>

      <div class="flex justify-end space-x-4">
        <button type="button" id="cancel-button" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
        <button type="submit" id="save-button" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Save Scene</button>
      </div>
    </form>
    <div id="code-preview-container" class="mt-6 hidden"></div>
  `;

  const form = editor.querySelector('#scene-editor-form');
  const sceneIdInput = editor.querySelector('#scene-id');
  const chapterInput = editor.querySelector('#chapter');
  const sceneTextInput = editor.querySelector('#scene-text');
  const sceneIdError = editor.querySelector('#scene-id-error');
  const saveButton = editor.querySelector('#save-button');
  const togglePreviewButton = editor.querySelector('#toggle-preview');
  const codePreviewContainer = editor.querySelector('#code-preview-container');
  const saveMessage = editor.querySelector('#save-message');
  const cancelButton = editor.querySelector('#cancel-button');

  function validateForm() {
    const isSceneIdValid = isValidCIdentifier(sceneIdInput.value);
    const isChapterValid = chapterInput.value.trim() !== '';
    const isSceneTextValid = sceneTextInput.value.trim() !== '';

    sceneIdError.classList.toggle('hidden', isSceneIdValid);

    const isFormValid = isSceneIdValid && isChapterValid && isSceneTextValid;
    saveButton.disabled = !isFormValid;
  }

  form.addEventListener('input', validateForm);

  function getSceneData() {
    const choices = Array.from(editor.querySelectorAll('#choices-container > div')).map(choiceElement => ({
      text: choiceElement.querySelector('.choice-text').value,
      nextScene: choiceElement.querySelector('.choice-next-scene').value,
      enabled: choiceElement.querySelector('.choice-enabled').checked,
    }));

    const stateChanges = Array.from(editor.querySelectorAll('#state-changes-container > div')).map(stateChangeElement => ({
      variable: stateChangeElement.querySelector('.state-variable').value,
      operator: stateChangeElement.querySelector('.state-operator').value,
      value: stateChangeElement.querySelector('.state-value').value,
    }));

    return {
      id: sceneIdInput.value,
      chapter: editor.querySelector('#chapter').value,
      sceneText: editor.querySelector('#scene-text').value,
      choices,
      stateChanges,
    };
  }

  function updatePreview() {
    const sceneData = getSceneData();
    codePreviewContainer.innerHTML = '';
    codePreviewContainer.appendChild(createCodePreview(sceneData));
  }

  form.addEventListener('input', updatePreview);

  togglePreviewButton.addEventListener('click', () => {
    const isHidden = codePreviewContainer.classList.toggle('hidden');
    togglePreviewButton.textContent = isHidden ? 'Show Preview' : 'Hide Preview';
    if (!isHidden) {
      updatePreview();
    }
  });

  sceneIdInput.addEventListener('input', () => {
    if (isValidCIdentifier(sceneIdInput.value)) {
      sceneIdError.classList.add('hidden');
      saveButton.disabled = false;
    } else {
      sceneIdError.classList.remove('hidden');
      saveButton.disabled = true;
    }
  });

  const choicesContainer = editor.querySelector('#choices-container');
  const addChoiceButton = editor.querySelector('#add-choice');

  addChoiceButton.addEventListener('click', () => {
    choicesContainer.appendChild(createChoice());
  });

  choicesContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-choice')) {
      e.target.parentElement.remove();
    }
  });

  const stateChangesContainer = editor.querySelector('#state-changes-container');
  const addStateChangeButton = editor.querySelector('#add-state-change');

  addStateChangeButton.addEventListener('click', () => {
    stateChangesContainer.appendChild(createStateChange());
  });

  stateChangesContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-state-change')) {
      e.target.parentElement.remove();
    }
  });

  // Load existing choices and state changes if editing
  if (scene.choices) {
    scene.choices.forEach(choice => {
      choicesContainer.appendChild(createChoice(choice));
    });
  }

  if (scene.stateChanges) {
    scene.stateChanges.forEach(stateChange => {
      stateChangesContainer.appendChild(createStateChange(stateChange));
    });
  }

  // Cancel button - return to dashboard
  cancelButton.addEventListener('click', async () => {
    const { loadDashboard } = await import('../main.js');
    if (loadDashboard) {
      await loadDashboard();
    }
  });

  // Form submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const sceneData = getSceneData();

    // Generate C code
    const { generateCCode } = await import('./CodePreview.js');
    sceneData.generatedCode = generateCCode ? generateCCode(sceneData) : '';
    sceneData.synced = false;

    try {
      await saveScene(sceneData);

      // Show success message
      saveMessage.textContent = '✓ Scene saved successfully!';
      saveMessage.className = 'text-green-600 text-sm font-medium';
      saveMessage.classList.remove('hidden');

      // Emit scene saved event
      emit('sceneSaved', sceneData);

      // Hide message after 3 seconds
      setTimeout(() => {
        saveMessage.classList.add('hidden');
      }, 3000);

      console.log('Scene saved:', sceneData);
    } catch (error) {
      console.error('Error saving scene:', error);
      saveMessage.textContent = '✗ Error saving scene. Please try again.';
      saveMessage.className = 'text-red-600 text-sm font-medium';
      saveMessage.classList.remove('hidden');
    }
  });

  // Auto-save draft every 2 seconds
  let autoSaveTimeout;
  form.addEventListener('input', () => {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(async () => {
      const sceneData = getSceneData();
      try {
        await saveDraft(sceneData.id || 'draft', sceneData);
        console.log('Draft auto-saved');
      } catch (error) {
        console.error('Error auto-saving draft:', error);
      }
    }, 2000);
  });

  setMainContent(editor);
}
