import { APIEmbedField, Colors, EmbedBuilder } from 'discord.js';

export function dangerEmbeds(title: string) {
  return {
    embeds: [
      new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle(`:no_entry_sign: ${title}`)
    ],
    components: []
  };
}

export function successEmbeds(title: string, fields: APIEmbedField[] = []) {
  return {
    embeds: [
      new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle(title)
        .setFields(fields)
    ],
    components: []
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
    ],
    components: []
  };
}
