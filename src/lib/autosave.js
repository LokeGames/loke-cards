/**
 * Auto-save Functionality
 * Debounced auto-save for draft scenes
 */

import { saveDraft } from './storage.js';
import { setSyncStatus } from './state.js';

let saveTimeout = null;
const AUTOSAVE_DELAY = 2000; // 2 seconds

/**
 * Auto-save a scene draft with debouncing
 * @param {string} sceneId - Scene identifier
 * @param {Object} data - Scene data to save
 * @returns {Promise<void>}
 */
export function autoSave(sceneId, data) {
  // Clear existing timeout
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  // Set new timeout
  saveTimeout = setTimeout(async () => {
    try {
      setSyncStatus('syncing');
      await saveDraft(sceneId, data);
      setSyncStatus('synced');
      console.log(`Auto-saved draft: ${sceneId}`);

      // Emit custom event for UI feedback
      window.dispatchEvent(new CustomEvent('autosave', {
        detail: { sceneId, timestamp: Date.now() }
      }));
    } catch (error) {
      console.error('Auto-save error:', error);
      setSyncStatus('error');
    }
  }, AUTOSAVE_DELAY);
}

/**
 * Cancel pending auto-save
 */
export function cancelAutoSave() {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = null;
  }
}

/**
 * Force immediate save (bypass debounce)
 * @param {string} sceneId - Scene identifier
 * @param {Object} data - Scene data to save
 * @returns {Promise<void>}
 */
export async function forceSave(sceneId, data) {
  cancelAutoSave();

  try {
    setSyncStatus('syncing');
    await saveDraft(sceneId, data);
    setSyncStatus('synced');
    console.log(`Force-saved draft: ${sceneId}`);

    window.dispatchEvent(new CustomEvent('autosave', {
      detail: { sceneId, timestamp: Date.now(), forced: true }
    }));
  } catch (error) {
    console.error('Force save error:', error);
    setSyncStatus('error');
    throw error;
  }
}

/**
 * Setup auto-save listeners for a form
 * @param {HTMLElement} form - Form element
 * @param {string} sceneId - Scene identifier
 * @param {Function} getDataFn - Function to extract form data
 */
export function setupFormAutoSave(form, sceneId, getDataFn) {
  if (!form || !sceneId || !getDataFn) {
    console.error('setupFormAutoSave: Missing required parameters');
    return;
  }

  // Listen to input events
  form.addEventListener('input', (e) => {
    const data = getDataFn();
    autoSave(sceneId, data);
  });

  // Force save on form blur (when user leaves the form)
  form.addEventListener('blur', (e) => {
    const data = getDataFn();
    forceSave(sceneId, data);
  }, true); // Use capture phase to catch all blur events

  // Save before page unload
  window.addEventListener('beforeunload', () => {
    const data = getDataFn();
    // Use synchronous localStorage as fallback for beforeunload
    try {
      localStorage.setItem(`draft_${sceneId}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Beforeunload save error:', error);
    }
  });

  console.log(`Auto-save setup for scene: ${sceneId}`);
}

/**
 * Show auto-save indicator
 */
export function showAutoSaveIndicator() {
  const indicator = document.getElementById('autosave-indicator');
  if (indicator) {
    indicator.classList.remove('hidden');
    indicator.textContent = '💾 Saving...';

    setTimeout(() => {
      indicator.textContent = '✓ Saved';
      setTimeout(() => {
        indicator.classList.add('hidden');
      }, 1000);
    }, 500);
  }
}

// Listen for autosave events
window.addEventListener('autosave', (e) => {
  showAutoSaveIndicator();
  console.log('Auto-save completed:', e.detail);
});
