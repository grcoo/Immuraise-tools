import { Interaction, CacheType } from 'discord.js';
import { PtList } from './adapter/nedb-adapter';

const AdminRole = { admin: 'Discord Admin', officer: 'Officer' } as const;

export async function isAuth(interaction: Interaction<CacheType>, pt: PtList) {
    console.log(pt, 2)
    const roles = await (await interaction.guild?.members.fetch(interaction.user.id))?.roles.cache.map(role => role.name);
    const isExist = roles?.some(role => role === AdminRole.admin || role === AdminRole.officer);
    const isCreator = interaction.user.id === pt.creatorId;

    return isExist || isCreator;
}