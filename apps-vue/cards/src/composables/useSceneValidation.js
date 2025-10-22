import { ref, computed, watch } from 'vue';
import { isValidCIdentifier } from '@shared/lib/validation.js';

/**
 * useSceneValidation - Composable for validating scene editor form data
 *
 * Provides real-time validation for scene data following loke-engine requirements
 * and C language identifier rules.
 *
 * @param {Object} sceneData - Reactive scene data object to validate
 * @returns {Object} - Validation state and functions
 */
export function useSceneValidation(sceneData) {
  const errors = ref({
    sceneId: '',
    chapterId: '',
    sceneText: '',
    choices: [],
    stateChanges: []
  });

  const isValid = computed(() => {
    return (
      !errors.value.sceneId &&
      !errors.value.chapterId &&
      !errors.value.sceneText &&
      errors.value.choices.every(e => !e) &&
      errors.value.stateChanges.every(e => !e)
    );
  });

  /**
   * Validate Scene ID
   * Must be a valid C identifier (alphanumeric + underscore, no spaces)
   * Should follow convention: scene_<name> or scene_ch01_<name>
   */
  function validateSceneId(sceneId) {
    if (!sceneId || sceneId.trim() === '') {
      return 'Scene ID is required';
    }

    if (!isValidCIdentifier(sceneId)) {
      return 'Scene ID must be a valid C identifier (letters, numbers, underscores only)';
    }

    if (!sceneId.startsWith('scene_')) {
      return 'Scene ID should start with "scene_" (e.g., scene_forest_entrance)';
    }

    if (sceneId.length > 64) {
      return 'Scene ID is too long (max 64 characters)';
    }

    return '';
  }

  /**
   * Validate Chapter ID
   * Must be a valid C identifier
   * Should follow convention: chapter01 or chapter01_name
   */
  function validateChapterId(chapterId) {
    const id = (chapterId || '').trim();
    // Chapter is optional for form validity; if empty, treat as valid
    if (!id) {
      return '';
    }

    if (!isValidCIdentifier(id)) {
      return 'Chapter ID must be a valid C identifier';
    }

    if (!id.toLowerCase().startsWith('chapter')) {
      return 'Chapter ID should start with "chapter" (e.g., chapter01)';
    }

    return '';
  }

  /**
   * Validate Scene Text
   * Must not be empty
   * Should be within MAX_TEXT_LENGTH (2048 chars for loke-engine)
   */
  function validateSceneText(sceneText) {
    if (!sceneText || sceneText.trim() === '') {
      return 'Scene text is required';
    }

    if (sceneText.length > 2048) {
      return `Scene text is too long (${sceneText.length}/2048 characters)`;
    }

    return '';
  }

  /**
   * Validate a single choice
   * Text must not be empty
   * Option text limited to 256 chars
   */
  function validateChoice(choice, index) {
    if (!choice.text || choice.text.trim() === '') {
      return `Choice ${index + 1}: Text is required`;
    }

    if (choice.text.length > 256) {
      return `Choice ${index + 1}: Text too long (${choice.text.length}/256 characters)`;
    }

    // nextScene is optional (can be NULL for disabled options)
    if (choice.nextScene) {
      if (!isValidCIdentifier(choice.nextScene)) {
        return `Choice ${index + 1}: Next scene must be a valid C identifier or empty`;
      }
      if (!choice.nextScene.startsWith('scene_')) {
        return `Choice ${index + 1}: Next scene should start with "scene_"`;
      }
    }

    return '';
  }

  /**
   * Validate all choices
   * At least one choice required
   * Maximum 10 options per scene (loke-engine limit)
   */
  function validateChoices(choices) {
    if (!choices || choices.length === 0) {
      return { general: '', choices: [] };
    }

    if (choices.length > 10) {
      return `Too many choices (${choices.length}/10 maximum)`;
    }

    // Validate each individual choice
    const choiceErrors = choices.map((choice, i) => validateChoice(choice, i));

    return { general: '', choices: choiceErrors };
  }

  /**
   * Validate a single state change
   * Variable must be valid GameState field
   * Operator must be valid C operator
   * Value must be appropriate for type
   */
  function validateStateChange(change, index) {
    if (!change.variable || change.variable.trim() === '') {
      return `State change ${index + 1}: Variable is required`;
    }

    if (!isValidCIdentifier(change.variable)) {
      return `State change ${index + 1}: Variable must be a valid C identifier`;
    }

    const validOperators = ['=', '+=', '-=', '*=', '/=', '%='];
    if (!validOperators.includes(change.operator)) {
      return `State change ${index + 1}: Invalid operator`;
    }

    if (change.value === undefined || change.value === '') {
      return `State change ${index + 1}: Value is required`;
    }

    // Validate boolean values
    if (change.value !== 'true' && change.value !== 'false') {
      // Check if numeric value is valid
      if (change.operator !== '=' && isNaN(Number(change.value))) {
        return `State change ${index + 1}: Value must be a number or boolean`;
      }
    }

    return '';
  }

  /**
   * Validate all state changes
   * All fields optional, but if provided must be valid
   */
  function validateStateChanges(stateChanges) {
    if (!stateChanges || stateChanges.length === 0) {
      return {
        general: '',
        stateChanges: []
      };
    }

    const stateErrors = stateChanges.map((change, i) => validateStateChange(change, i));

    return {
      general: '',
      stateChanges: stateErrors
    };
  }

  /**
   * Validate entire scene data object
   * Returns true if all validations pass
   */
  function validateAll() {
    errors.value.sceneId = validateSceneId(sceneData.sceneId);
    errors.value.chapterId = validateChapterId(sceneData.chapterId);
    errors.value.sceneText = validateSceneText(sceneData.sceneText);

    const choiceValidation = validateChoices(sceneData.choices);
    errors.value.choices = choiceValidation.choices;

    const stateValidation = validateStateChanges(sceneData.stateChanges);
    errors.value.stateChanges = stateValidation.stateChanges;

    return isValid.value;
  }

  /**
   * Clear all validation errors
   */
  function clearErrors() {
    errors.value = {
      sceneId: '',
      chapterId: '',
      sceneText: '',
      choices: [],
      stateChanges: []
    };
  }

  /**
   * Watch sceneData and validate on change (optional - can enable real-time validation)
   */
  function enableRealtimeValidation() {
    watch(
      () => sceneData.sceneId,
      (newVal) => {
        errors.value.sceneId = validateSceneId(newVal);
      }
    );

    watch(
      () => sceneData.chapterId,
      (newVal) => {
        errors.value.chapterId = validateChapterId(newVal);
      }
    );

    watch(
      () => sceneData.sceneText,
      (newVal) => {
        errors.value.sceneText = validateSceneText(newVal);
      }
    );

    // Re‑validate choices when edited (add/remove/change)
    watch(
      () => sceneData.choices,
      (newVal) => {
        const v = validateChoices(newVal || []);
        errors.value.choices = v.choices || [];
      },
      { deep: true }
    );

    // Re‑validate state changes when edited (add/remove/change)
    watch(
      () => sceneData.stateChanges,
      (newVal) => {
        const v = validateStateChanges(newVal || []);
        errors.value.stateChanges = v.stateChanges || [];
      },
      { deep: true }
    );
  }

  return {
    errors: computed(() => errors.value),
    isValid,
    validateSceneId,
    validateChapterId,
    validateSceneText,
    validateChoice,
    validateChoices,
    validateStateChange,
    validateStateChanges,
    validateAll,
    clearErrors,
    enableRealtimeValidation
  };
}
