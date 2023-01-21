import { Interaction, CacheType } from 'discord.js';
import { Pt } from './adapter/nedb-adapter';

const AdminRole = { admin: 'Discord Admin', officer: 'Officer' } as const;

export async function isAuth(interaction: Interaction<CacheType>, pt: Pt) {
  const roles = await (
    await interaction.guild?.members.fetch(interaction.user.id)
  )?.roles.cache.map((role) => role.name);
  const isExist = roles?.some(
    (role) => role === AdminRole.admin || role === AdminRole.officer
  );
  const isCreator = interaction.user.id === pt.creatorId;

  return isExist || isCreator;
}
