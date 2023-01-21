import { format } from 'date-fns';
import { APIEmbedField, Colors, EmbedBuilder } from 'discord.js';
import { Remind } from './adapter/nedb-adapter';

export function dangerEmbeds(title: string) {
  return {
    embeds: [
      new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle(`:no_entry_sign: ${title}`)
    ]
  };
}

export function successEmbeds(title: string, fields: APIEmbedField[] = []) {
  return {
    embeds: [
      new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle(title)
        .setFields(fields)
    ]
  };
}

export function successEmbedsWithDescription(
  title: string,
  fields: APIEmbedField[] = [],
  description: string
) {
  return {
    embeds: [
      new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle(title)
        .setDescription(description)
        .setFields(fields)
    ]
  };
}

export function remindEmbed(remind: Remind, timeLeft?: number) {
  let emoji = ':heart_eyes: ';
  if (remind.objectName.includes('core')) emoji = ':coin: ';
  if (remind.objectName.includes('chest')) emoji = ':gift: ';
  if (remind.objectName.includes('pristine')) emoji = ':sparkles: ';
  if (remind.objectName.includes('spider')) emoji = ':spider_web: ';
  const timeLeftString = timeLeft ? `あと${timeLeft}分後` : '';

  return new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle(`${emoji}${remind.objectName}${emoji}`)
    .setDescription(
      `予定時刻: ${format(
        remind.timestamp,
        'yyyy/MM/dd HH:mm'
      )} ${timeLeftString} `
    )
    .setImage(remind.mapImage);
}
