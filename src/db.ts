import Dexie, { type Table } from 'dexie';

export interface Soundbite {
  id?: number;
  name: string;
  emoji: string;
  audioBlob: Blob;
  createdAt: number;
  order?: number;
}

export class SoundbitesDB extends Dexie {
  soundbites!: Table<Soundbite>;

  constructor() {
    super('SoundbitesDB');
    this.version(1).stores({
      soundbites: '++id, name, createdAt'
    });
    this.version(2).stores({
      soundbites: '++id, name, createdAt, order'
    }).upgrade(async (tx) => {
      const all = await tx.table('soundbites').orderBy('createdAt').toArray();
      await Promise.all(
        all.map((item, i) => tx.table('soundbites').update(item.id, { order: i }))
      );
    });
  }
}

export const db = new SoundbitesDB();
