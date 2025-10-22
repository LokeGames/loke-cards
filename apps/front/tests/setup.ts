import '@testing-library/jest-dom';

declare global {
  // eslint-disable-next-line no-var
  var $state: <T>(value: T) => T;
}

if (typeof globalThis.$state === 'undefined') {
  globalThis.$state = (value) => value;
}
