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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const AdminRole = { admin: 'Discord Admin', officer: 'Officer' };
function isAuth(interaction, pt) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        console.log(pt, 2);
        const roles = yield ((_b = (yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.fetch(interaction.user.id)))) === null || _b === void 0 ? void 0 : _b.roles.cache.map(role => role.name));
        const isExist = roles === null || roles === void 0 ? void 0 : roles.some(role => role === AdminRole.admin || role === AdminRole.officer);
        const isCreator = interaction.user.id === pt.creatorId;
        return isExist || isCreator;
    });
}
exports.isAuth = isAuth;
