
import * as Comlink from 'comlink';

// In-memory data store
let cardsStore: Map<string, any> = new Map();
let chaptersStore: Map<string, any> = new Map();

let nextId = 1;

const cards = {
  async create(data: any) {
    const id = `card_${nextId++}`;
    const newCard = { id, ...data };
    cardsStore.set(id, newCard);
    return newCard;
  },
  async get(id: string) {
    if (!cardsStore.has(id)) {
      throw new Error(`Card with id ${id} not found`);
    }
    return cardsStore.get(id);
  },
  async list() {
    return Array.from(cardsStore.values());
  },
  async update(id: string, data: any) {
    if (!cardsStore.has(id)) {
      throw new Error(`Card with id ${id} not found`);
    }
    const existingCard = cardsStore.get(id);
    const updatedCard = { ...existingCard, ...data };
    cardsStore.set(id, updatedCard);
    return updatedCard;
  },
  async delete(id: string) {
    if (!cardsStore.has(id)) {
      throw new Error(`Card with id ${id} not found`);
    }
    cardsStore.delete(id);
    return true;
  },
};

const chapters = {
  async create(data: any) {
    const id = `chapter_${nextId++}`;
    const newChapter = { id, ...data };
    chaptersStore.set(id, newChapter);
    return newChapter;
  },
  async get(id: string) {
    if (!chaptersStore.has(id)) {
      throw new Error(`Chapter with id ${id} not found`);
    }
    return chaptersStore.get(id);
  },
  async list() {
    return Array.from(chaptersStore.values());
  },
  async update(id: string, data: any) {
    if (!chaptersStore.has(id)) {
      throw new Error(`Chapter with id ${id} not found`);
    }
    const existingChapter = chaptersStore.get(id);
    const updatedChapter = { ...existingChapter, ...data };
    chaptersStore.set(id, updatedChapter);
    return updatedChapter;
  },
  async delete(id: string) {
    if (!chaptersStore.has(id)) {
      throw new Error(`Chapter with id ${id} not found`);
    }
    chaptersStore.delete(id);
    return true;
  },
};

export const api = {
  cards,
  chapters,
  graph: {
    async updateNodePosition(nodeId: string, position: { x: number, y: number }) {
      console.log(`Node ${nodeId} moved to x: ${position.x}, y: ${position.y}`);
      // For now, just log. Later, this will update a persistent store.
      return true;
    },
  },
  reset() {
    cardsStore.clear();
    chaptersStore.clear();
    nextId = 1;
  }
};

Comlink.expose(api);

export type API = typeof api;
