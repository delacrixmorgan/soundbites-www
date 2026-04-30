import Dexie, { type Table } from 'dexie';

export interface Soundbite {
  id?: number;
  name: string;
  emoji: string;
  audioBlob: Blob;
  createdAt: number;
}

export class SoundbitesDB extends Dexie {
  soundbites!: Table<Soundbite>;

  constructor() {
    super('SoundbitesDB');
    this.version(1).stores({
      soundbites: '++id, name, createdAt'
    });
  }
}

export const db = new SoundbitesDB();
