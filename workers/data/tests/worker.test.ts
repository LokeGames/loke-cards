import { describe, it, expect, beforeEach } from 'vitest';
import { api } from '../src/worker';

describe('Data Worker API', () => {
  beforeEach(() => {
    // Reset data before each test
    api.reset();
  });

  describe('cards', () => {
    it('should create, get, list, update, and delete a card', async () => {
      // 1. Create
      const newCard = await api.cards.create({ title: 'Test Card', content: 'Hello' });
      expect(newCard).toBeDefined();
      expect(newCard.id).toBeTypeOf('string');
      expect(newCard.title).toBe('Test Card');

      // 2. Get
      const fetchedCard = await api.cards.get(newCard.id);
      expect(fetchedCard).toEqual(newCard);

      // 3. List
      let cards = await api.cards.list();
      expect(cards).toHaveLength(1);
      expect(cards[0]).toEqual(newCard);

      // 4. Update
      const updatedCard = await api.cards.update(newCard.id, { title: 'Updated Title' });
      expect(updatedCard.title).toBe('Updated Title');
      const fetchedAfterUpdate = await api.cards.get(newCard.id);
      expect(fetchedAfterUpdate.title).toBe('Updated Title');

      // 5. Delete
      await api.cards.delete(newCard.id);
      cards = await api.cards.list();
      expect(cards).toHaveLength(0);
      await expect(api.cards.get(newCard.id)).rejects.toThrow();
    });
  });

  describe('chapters', () => {
    it('should create, get, list, update, and delete a chapter', async () => {
      // 1. Create
      const newChapter = await api.chapters.create({ title: 'Test Chapter' });
      expect(newChapter).toBeDefined();
      expect(newChapter.id).toBeTypeOf('string');
      expect(newChapter.title).toBe('Test Chapter');

      // 2. Get
      const fetchedChapter = await api.chapters.get(newChapter.id);
      expect(fetchedChapter).toEqual(newChapter);

      // 3. List
      let chapters = await api.chapters.list();
      expect(chapters).toHaveLength(1);
      expect(chapters[0]).toEqual(newChapter);

      // 4. Update
      const updatedChapter = await api.chapters.update(newChapter.id, { title: 'Updated Title' });
      expect(updatedChapter.title).toBe('Updated Title');
      const fetchedAfterUpdate = await api.chapters.get(newChapter.id);
      expect(fetchedAfterUpdate.title).toBe('Updated Title');

      // 5. Delete
      await api.chapters.delete(newChapter.id);
      chapters = await api.chapters.list();
      expect(chapters).toHaveLength(0);
      await expect(api.chapters.get(newChapter.id)).rejects.toThrow();
    });
  });
});