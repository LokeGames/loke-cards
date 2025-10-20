export interface Chapter {
  id: string;
  name?: string;
  order?: number;
  position?: { x: number; y: number };
  createdAt?: number;
  updatedAt?: number;
}

export interface Choice {
  text: string;
  nextScene?: string;
  enabled?: boolean;
}

export interface StateChange {
  variable: string;
  operator: string;
  value: string | number | boolean;
}

export interface Scene {
  id: string; // normalized id
  sceneId?: string; // original field name in some APIs
  chapterId?: string;
  chapter?: string;
  sceneText?: string;
  choices?: Choice[];
  stateChanges?: StateChange[];
  createdAt?: number;
  updatedAt?: number;
  generatedCode?: string;
  position?: { x: number; y: number };
}

export type LinkType = 'jump' | 'condition' | 'return' | 'fork';
export interface Link {
  id: string;
  sourceSceneId: string;
  targetSceneId: string;
  type: LinkType;
}

