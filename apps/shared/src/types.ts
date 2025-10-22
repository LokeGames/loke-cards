// Shared types
export interface Scene {
  id: string;
  title: string;
  content: string;
  choices?: Choice[];
}

export interface Choice {
  id: string;
  text: string;
  next?: string;
}

export interface Chapter {
  id: string;
  title: string;
  scenes: Scene[];
}
