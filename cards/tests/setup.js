import '@testing-library/jest-dom';

if (typeof globalThis.$state === 'undefined') {
  globalThis.$state = (value) => value;
}
