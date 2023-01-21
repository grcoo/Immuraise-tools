import { getSeconds } from 'date-fns';
import { Client } from 'discord.js';
import { Nedb, Remind } from '../adapter/nedb-adapter';
import { isRemining1minutes, isRemining5minutes } from '../utility/date';
import { remindEmbed } from './embeds';

export async function processReminder(
  remindDB: Nedb,
  client: Client,
  now: number
) {
  const reminders = await remindDB.getAll<Remind>();
  if (reminders == null || reminders.length === 0) return;

  await Promise.all(
    reminders.map(async (remind) => sendEmbed(client, now, remind))
  );
  await Promise.all(
    reminders.map(async (remind) => deleteRemind(remindDB, now, remind))
  );
  console.log(`${reminders?.length} reminders.`);
}

async function sendEmbed(
  client: Client,
  now: number,
  remind: Remind
): Promise<void> {
  const channel = client.channels.cache.get(
    process.env.REMIND_CHANNEL_ID ?? ''
  );
  if (!channel?.isTextBased()) return;
  if (isRemining5minutes(now, remind.timestamp))
    await channel?.send({
      embeds: [remindEmbed(remind, 5)],
      content: `<@&${process.env.OUTLAND_MENTION_ID}>`
    });
  if (isRemining1minutes(now, remind.timestamp))
    await channel?.send({
      embeds: [remindEmbed(remind, 1)],
      content: `<@&${process.env.OUTLAND_MENTION_ID}>`
    });
}

async function deleteRemind(
  remindDB: Nedb,
  now: number,
  remind: Remind
): Promise<void> {
  if (isRemining1minutes(now, remind.timestamp))
    await remindDB.delete({
      mapImage: remind.mapImage
    });
}
