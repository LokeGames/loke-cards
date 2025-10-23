/**
 * State variable definition
 */
export interface StateVariable {
  id: string;
  name: string;
  type: 'number' | 'boolean' | 'string';
  scope: 'global' | 'chapter';
  chapterId?: string; // Only for chapter-scoped states
  defaultValue: string | number | boolean;
  description?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * State change in a scene
 */
export interface StateChange {
  stateId: string; // Reference to StateVariable.id
  operation: 'set' | 'add' | 'subtract' | 'toggle';
  value: string | number | boolean;
}
