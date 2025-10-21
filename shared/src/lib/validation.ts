export function isValidCIdentifier(str: string): boolean {
  if (!str) return false;
  const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  return regex.test(str);
}

