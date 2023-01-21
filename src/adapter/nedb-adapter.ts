import Datastore from 'nedb-promises';

export interface Pt {
  name: string;
  creatorId: string;
  list: Member[];
}

export interface Remind {
  mapImage: string;
  objectName: string;
  timestamp: number;
}

export interface Member {
  userId: string;
  name: string;
  ip: number;
  repairCost: number;
}

export type Query = {
  [key: string]: any;
};

export class Nedb {
  private db;

  constructor() {
    this.db = Datastore.create({ autoload: true, inMemoryOnly: true });
  }

  public async create<T>(t: T) {
    await this.db.insert(t);
  }

  public async get<T>(query: Query): Promise<T | null> {
    return await this.db.findOne<T>(query);
  }

  public async getAll<T>(): Promise<T[] | null> {
    return await this.db.find<T>({});
  }

  public async delete(query: Query) {
    await this.db.remove(query, {});
  }

  public async updatePt(name: string, list: Member[]) {
    await this.db.update<Pt>(
      { name: name },
      { $set: { list: list } },
      { multi: true }
    );
  }
}
