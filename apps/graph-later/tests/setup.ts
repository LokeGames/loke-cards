import '@testing-library/jest-dom';

declare global {
   
  var $state: <T>(value: T) => T;
}

if (typeof globalThis.$state === 'undefined') {
  globalThis.$state = (value) => value;
}
