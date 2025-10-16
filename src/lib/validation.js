/**
 * Validation Utilities
 * Functions for validating form inputs.
 */

/**
 * Checks if a string is a valid C identifier.
 * @param {string} str - The string to check.
 * @returns {boolean}
 */
export function isValidCIdentifier(str) {
  if (!str) {
    return false;
  }
  // C identifiers must start with a letter or underscore,
  // and can be followed by letters, numbers, or underscores.
  const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  return regex.test(str);
}
