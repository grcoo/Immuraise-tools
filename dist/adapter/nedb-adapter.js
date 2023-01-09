"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nedb = void 0;
const nedb_promises_1 = __importDefault(require("nedb-promises"));
class Nedb {
    constructor() {
        this.db = nedb_promises_1.default.create({ autoload: true, inMemoryOnly: true });
    }
    create(name, creatorId, list = []) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.insert({ name: name, creatorId: creatorId, list: list });
        });
    }
    get(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.findOne({ name: name });
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.find({});
        });
    }
    delete(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.remove({ name: name }, {});
        });
    }
    update(name, list) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.update({ name: name }, { $set: { list: list } }, { multi: true });
        });
    }
}
exports.Nedb = Nedb;
