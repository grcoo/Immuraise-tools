import Datastore from 'nedb-promises'

export interface PtList {
    name: string;
    creatorId: string;
    list: {
        userId: string;
        name: string;
        ip: number;
    }[];
}

export class Nedb {
    private db;

    constructor() {
        this.db = Datastore.create({ autoload: true, inMemoryOnly: true, })
    }

    public async create(name: string, creatorId: string, list = []) {
        await this.db.insert({ name: name, creatorId: creatorId, list: list });
    }

    public async get(name: string): Promise<PtList | null> {
        return await this.db.findOne<PtList>({ name: name });
    }

    public async getAll(): Promise<PtList[] | null> {
        return await this.db.find<PtList>({});
    }

    public async delete(name: string) {
        await this.db.remove({ name: name }, {});
    }

    public async update(name: string, list: { userId: string, name: string; ip: number; }[]) {
        await this.db.update<PtList>({ name: name }, { $set: { list: list } }, { multi: true });
    }
}