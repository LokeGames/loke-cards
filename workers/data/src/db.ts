import type { Scene, Chapter } from '@schemas';

export interface CardsRepo {
  create(scene: Scene): Promise<Scene>;
  get(id: string): Promise<Scene | null>;
  list(): Promise<Scene[]>;
  update(scene: Scene): Promise<Scene>;
  delete(id: string): Promise<boolean>;
}

export interface ChaptersRepo {
  create(chapter: Chapter): Promise<Chapter>;
  get(id: string): Promise<Chapter | null>;
  list(): Promise<Chapter[]>;
  update(chapter: Chapter): Promise<Chapter>;
  delete(id: string): Promise<boolean>;
}

export interface DB {
  cards: CardsRepo;
  chapters: ChaptersRepo;
  edges: {
    create(sourceSceneId: string, targetSceneId: string): Promise<{ id: string; source: string; target: string }>;
    list(): Promise<Array<{ id: string; source: string; target: string }>>;
    delete(id: string): Promise<boolean>;
  };
  positions: {
    set(nodeId: string, x: number, y: number): Promise<void>;
    get(nodeId: string): Promise<{ x: number; y: number } | null>;
    all(): Promise<Array<{ nodeId: string; x: number; y: number }>>;
  };
  close(): Promise<void>;
}

class MemoryDB implements DB {
  private scenes = new Map<string, Scene>();
  private chaps = new Map<string, Chapter>();
  private links = new Map<string, { id: string; source: string; target: string }>();
  private pos = new Map<string, { x: number; y: number }>();
  cards: CardsRepo = {
    create: async (s) => { this.scenes.set(s.sceneId, s); return s; },
    get: async (id) => this.scenes.get(id) || null,
    list: async () => Array.from(this.scenes.values()),
    update: async (s) => { if (!this.scenes.has(s.sceneId)) throw new Error('not_found'); this.scenes.set(s.sceneId, s); return s; },
    delete: async (id) => this.scenes.delete(id),
  };
  chapters: ChaptersRepo = {
    create: async (c) => { this.chaps.set(c.chapterId, c); return c; },
    get: async (id) => this.chaps.get(id) || null,
    list: async () => Array.from(this.chaps.values()),
    update: async (c) => { if (!this.chaps.has(c.chapterId)) throw new Error('not_found'); this.chaps.set(c.chapterId, c); return c; },
    delete: async (id) => this.chaps.delete(id),
  };
  edges = {
    create: async (src: string, dst: string) => {
      const id = `${src}->${dst}-${Date.now()}`;
      const e = { id, source: src, target: dst };
      this.links.set(id, e);
      return e;
    },
    list: async () => Array.from(this.links.values()),
    delete: async (id: string) => this.links.delete(id),
  };
  positions = {
    set: async (nodeId: string, x: number, y: number) => {
      this.pos.set(nodeId, { x, y });
    },
    get: async (nodeId: string) => this.pos.get(nodeId) || null,
    all: async () => Array.from(this.pos.entries()).map(([nodeId, p]) => ({ nodeId, ...p })),
  };
  async close() {}
}

export async function createDB(): Promise<DB> {
  try {
    const db = await SQLiteDB.create();
    return db;
  } catch (_e) {
    return new MemoryDB();
  }
}

// Lightweight SQLite backend using wa-sqlite; falls back gracefully if init fails
import SQLiteESMFactory from 'wa-sqlite/dist/wa-sqlite.mjs';
import * as SQLite from 'wa-sqlite';

class SQLiteDB implements DB {
  private sqlite3: any;
  private db: number;

  static async create(): Promise<SQLiteDB> {
    const module = await SQLiteESMFactory();
    const sqlite3 = SQLite.Factory(module);
    // In-memory DB satisfies TODO requirement to use wa-sqlite without persistence concerns yet
    const db = await sqlite3.open_v2('file:loke-cards?mode=memory&cache=shared');
    const self = new SQLiteDB(sqlite3, db);
    await self.init();
    return self;
  }

  private constructor(sqlite3: any, db: number) {
    this.sqlite3 = sqlite3;
    this.db = db;
  }

  private async init(): Promise<void> {
    await this.exec(`CREATE TABLE IF NOT EXISTS scenes (id TEXT PRIMARY KEY, data TEXT NOT NULL)`);
    await this.exec(`CREATE TABLE IF NOT EXISTS chapters (id TEXT PRIMARY KEY, data TEXT NOT NULL)`);
    await this.exec(`CREATE TABLE IF NOT EXISTS edges (id TEXT PRIMARY KEY, source TEXT NOT NULL, target TEXT NOT NULL)`);
    await this.exec(`CREATE TABLE IF NOT EXISTS positions (node_id TEXT PRIMARY KEY, x REAL NOT NULL, y REAL NOT NULL)`);
  }

  private async exec(sql: string, onRow?: (row: unknown[], columns: string[]) => void): Promise<void> {
    await this.sqlite3.exec(this.db, sql, onRow);
  }

  private q(value: string): string {
    return `'${value.replace(/'/g, "''")}'`;
  }

  cards: CardsRepo = {
    create: async (s) => {
      const json = JSON.stringify(s);
      await this.exec(
        `INSERT INTO scenes(id,data) VALUES(${this.q(s.sceneId)}, ${this.q(json)}) ON CONFLICT(id) DO UPDATE SET data=excluded.data`
      );
      return s;
    },
    get: async (id) => {
      let out: Scene | null = null;
      await this.exec(`SELECT data FROM scenes WHERE id=${this.q(id)}`, (row) => {
        const data = row?.[0] as string | undefined;
        if (data) out = JSON.parse(data);
      });
      return out;
    },
    list: async () => {
      const list: Scene[] = [];
      await this.exec(`SELECT data FROM scenes`, (row) => {
        const data = row?.[0] as string | undefined;
        if (data) list.push(JSON.parse(data));
      });
      return list;
    },
    update: async (s) => {
      const json = JSON.stringify(s);
      const id = this.q(s.sceneId);
      await this.exec(`UPDATE scenes SET data=${this.q(json)} WHERE id=${id}`);
      return s;
    },
    delete: async (id) => {
      await this.exec(`DELETE FROM scenes WHERE id=${this.q(id)}`);
      return true;
    },
  };

  chapters: ChaptersRepo = {
    create: async (c) => {
      const json = JSON.stringify(c);
      await this.exec(
        `INSERT INTO chapters(id,data) VALUES(${this.q(c.chapterId)}, ${this.q(json)}) ON CONFLICT(id) DO UPDATE SET data=excluded.data`
      );
      return c;
    },
    get: async (id) => {
      let out: Chapter | null = null;
      await this.exec(`SELECT data FROM chapters WHERE id=${this.q(id)}`, (row) => {
        const data = row?.[0] as string | undefined;
        if (data) out = JSON.parse(data);
      });
      return out;
    },
    list: async () => {
      const list: Chapter[] = [];
      await this.exec(`SELECT data FROM chapters`, (row) => {
        const data = row?.[0] as string | undefined;
        if (data) list.push(JSON.parse(data));
      });
      return list;
    },
    update: async (c) => {
      const json = JSON.stringify(c);
      const id = this.q(c.chapterId);
      await this.exec(`UPDATE chapters SET data=${this.q(json)} WHERE id=${id}`);
      return c;
    },
    delete: async (id) => {
      await this.exec(`DELETE FROM chapters WHERE id=${this.q(id)}`);
      return true;
    },
  };

  edges = {
    create: async (src: string, dst: string) => {
      const id = `${src}->${dst}-${Date.now()}`;
      await this.exec(`INSERT INTO edges(id,source,target) VALUES(${this.q(id)}, ${this.q(src)}, ${this.q(dst)})`);
      return { id, source: src, target: dst };
    },
    list: async () => {
      const list: Array<{ id: string; source: string; target: string }> = [];
      await this.exec(`SELECT id, source, target FROM edges`, (row) => {
        const [id, src, dst] = row as unknown as [string, string, string];
        if (id) list.push({ id, source: src, target: dst });
      });
      return list;
    },
    delete: async (id: string) => {
      await this.exec(`DELETE FROM edges WHERE id=${this.q(id)}`);
      return true;
    },
  };

  positions = {
    set: async (nodeId: string, x: number, y: number) => {
      await this.exec(`INSERT INTO positions(node_id,x,y) VALUES(${this.q(nodeId)}, ${x}, ${y}) ON CONFLICT(node_id) DO UPDATE SET x=${x}, y=${y}`);
    },
    get: async (nodeId: string) => {
      let out: { x: number; y: number } | null = null;
      await this.exec(`SELECT x,y FROM positions WHERE node_id=${this.q(nodeId)}`, (row) => {
        const [x, y] = row as unknown as [number, number];
        if (typeof x === 'number' && typeof y === 'number') out = { x, y };
      });
      return out;
    },
    all: async () => {
      const list: Array<{ nodeId: string; x: number; y: number }> = [];
      await this.exec(`SELECT node_id, x, y FROM positions`, (row) => {
        const [nodeId, x, y] = row as unknown as [string, number, number];
        if (nodeId) list.push({ nodeId, x, y });
      });
      return list;
    },
  };

  async close(): Promise<void> {
    await this.sqlite3.close(this.db);
  }
}
