import { e as expose } from "./chunks/comlink.js";
let cardsStore = /* @__PURE__ */ new Map();
let chaptersStore = /* @__PURE__ */ new Map();
let nextId = 1;
const cards = {
  async create(data) {
    const id = `card_${nextId++}`;
    const newCard = { id, ...data };
    cardsStore.set(id, newCard);
    return newCard;
  },
  async get(id) {
    if (!cardsStore.has(id)) {
      throw new Error(`Card with id ${id} not found`);
    }
    return cardsStore.get(id);
  },
  async list() {
    return Array.from(cardsStore.values());
  },
  async update(id, data) {
    if (!cardsStore.has(id)) {
      throw new Error(`Card with id ${id} not found`);
    }
    const existingCard = cardsStore.get(id);
    const updatedCard = { ...existingCard, ...data };
    cardsStore.set(id, updatedCard);
    return updatedCard;
  },
  async delete(id) {
    if (!cardsStore.has(id)) {
      throw new Error(`Card with id ${id} not found`);
    }
    cardsStore.delete(id);
    return true;
  }
};
const chapters = {
  async create(data) {
    const id = `chapter_${nextId++}`;
    const newChapter = { id, ...data };
    chaptersStore.set(id, newChapter);
    return newChapter;
  },
  async get(id) {
    if (!chaptersStore.has(id)) {
      throw new Error(`Chapter with id ${id} not found`);
    }
    return chaptersStore.get(id);
  },
  async list() {
    return Array.from(chaptersStore.values());
  },
  async update(id, data) {
    if (!chaptersStore.has(id)) {
      throw new Error(`Chapter with id ${id} not found`);
    }
    const existingChapter = chaptersStore.get(id);
    const updatedChapter = { ...existingChapter, ...data };
    chaptersStore.set(id, updatedChapter);
    return updatedChapter;
  },
  async delete(id) {
    if (!chaptersStore.has(id)) {
      throw new Error(`Chapter with id ${id} not found`);
    }
    chaptersStore.delete(id);
    return true;
  }
};
const api = {
  cards,
  chapters,
  graph: {
    async updateNodePosition(nodeId, position) {
      console.log(`Node ${nodeId} moved to x: ${position.x}, y: ${position.y}`);
      return true;
    }
  },
  reset() {
    cardsStore.clear();
    chaptersStore.clear();
    nextId = 1;
  }
};
expose(api);
export {
  api
};
