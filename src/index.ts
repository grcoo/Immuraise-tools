import { face } from './face';
import { Nedb } from './adapter/nedb-adapter';
import { APIEmbedField, CacheType, Client, Interaction } from 'discord.js';
import dotenv from 'dotenv';
import { commandsValue, commands, subCommandsValue } from './commands';
import { isAuth } from './auth';
import {
  dangerEmbeds,
  successEmbeds,
  successEmbedsWithDescription
} from './embeds';
import express from 'express';

const app = express();
app.get('/', (_req, res) => {
  res.send('🤖Bot is running!!🤖');
});

// GAEで最小インスタンス数を指定するには、Warmup Endpoint を有効にする必要がある
app.get('/_ah/warmup', (_req, res) => {
  res.sendStatus(200);
});

// Start the server
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

dotenv.config();

const ptList = new Nedb();
const client = new Client({
  intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent']
});

client.once('ready', async () => {
  await client.application?.commands.set(commands, process.env.SERVER_ID ?? '');
  console.log('Ready!');
});

client.on('interactionCreate', (interaction) =>
  onInteraction(interaction).catch((err) => console.error(err))
);

async function onInteraction(interaction: Interaction<CacheType>) {
  if (!interaction.isCommand()) {
    return;
  }
  if (interaction.channelId !== process.env.DEAL_CHANNEL_ID) {
    await interaction.reply(
      dangerEmbeds('コマンドを実行するchが違うようです。')
    );
    return;
  }
  const guild = client.guilds.cache.get(process.env.SERVER_ID ?? '');
  if (interaction.commandName === commandsValue.dealer) {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.options.getSubcommand() === subCommandsValue.create) {
      const ptname = interaction.options.getString('ptname') ?? '';
      const isExist = await ptList.get(ptname);
      if (isExist) {
        await interaction.reply(dangerEmbeds('既に存在するptです。'));
        return;
      }
      await ptList.create(ptname, interaction.user.id);
      await interaction.reply(
        successEmbeds(`:triangular_flag_on_post: ${ptname} 作成完了!`)
      );
    }
    if (interaction.options.getSubcommand() === subCommandsValue.list) {
      const list = await ptList.getAll();
      if (list !== null && list.length !== 0) {
        const fields: APIEmbedField[] = list.map((pt) => {
          return {
            name: pt.name,
            value: `${pt.list.length}名の参加者`,
            inline: true
          };
        });
        await interaction.reply(successEmbeds(':family_mmgb: PT一覧', fields));
      } else {
        await interaction.reply(dangerEmbeds('ptは1件も登録されていません。'));
      }
    }
    if (interaction.options.getSubcommand() === subCommandsValue.remove) {
      const ptname = interaction.options.getString('ptname') ?? '';
      const pt = await ptList.get(ptname);

      if (pt !== null) {
        if (!(await isAuth(interaction, pt))) {
          const creator = await (
            await guild?.members?.fetch(pt.creatorId)
          )?.displayName;
          await interaction.reply(
            dangerEmbeds(
              `pt: ${ptname}を削除する権限がありません。${creator}かロールDiscord AdminまたはOfficerのみ削除できます。`
            )
          );
        }
        await ptList.delete(ptname);
        await interaction.reply(
          successEmbeds(`:triangular_flag_on_post: ${ptname} 削除完了!`)
        );
      } else {
        await interaction.reply(dangerEmbeds(`pt: ${ptname}は未登録です。`));
      }
    }
    if (interaction.options.getSubcommand() === subCommandsValue.add) {
      const ptname = interaction.options.getString('ptname') ?? '';
      const pt = await ptList.get(ptname);

      if (pt !== null) {
        const userName =
          (await (
            await guild?.members?.fetch(interaction.user.id)
          )?.displayName) ?? '';
        pt.list.push({
          userId: interaction.user.id,
          name: userName,
          ip: Number(interaction.options.getString('ip')),
          repairCost: Number(interaction.options.getString('repaircost'))
        });
        await ptList.update(ptname, pt.list);
        await interaction.reply(
          successEmbeds(
            `:triangular_flag_on_post: ${ptname}に ${userName}::crossed_swords: ${interaction.options.getString(
              'ip'
            )}:tools: ${interaction.options.getString(
              'repaircost'
            )}    追加完了!`
          )
        );
      } else {
        await interaction.reply(dangerEmbeds(`pt: ${ptname}は未登録です。`));
      }
    }
    if (interaction.options.getSubcommand() === subCommandsValue.member) {
      const ptname = interaction.options.getString('ptname') ?? '';
      const pt = await ptList.get(ptname);

      if (pt !== null) {
        const fields: APIEmbedField[] = pt.list.map((pt) => {
          return {
            name: `${face[Math.floor(Math.random() * face.length)]} ${pt.name}`,
            value: `:crossed_swords: ${pt.ip.toString()}`,
            inline: true
          };
        });
        await interaction.reply(
          successEmbeds(`:family_mmgb: ${ptname} 参加者一覧!`, fields)
        );
      } else {
        await interaction.reply(dangerEmbeds(`pt: ${ptname}は未登録です。`));
      }
    }
    if (interaction.options.getSubcommand() === subCommandsValue.deal) {
      const ptname = interaction.options.getString('ptname') ?? '';
      const pt = await ptList.get(ptname);

      if (pt !== null) {
        if (!(await isAuth(interaction, pt))) {
          const creator = await (
            await guild?.members?.fetch(pt.creatorId)
          )?.displayName;
          await interaction.reply(
            dangerEmbeds(
              `pt: ${ptname}を清算する権限がありません。${creator}かロールDiscord AdminまたはOfficerのみ清算できます。`
            )
          );
        }
        const totalIp = pt.list
          .map((member) => member.ip)
          .reduce((a, b) => Number(a) + Number(b));
        const totalCost = pt.list
          .map((member) => member.repairCost)
          .reduce((a, b) => Number(a) + Number(b));
        const silver = Number(interaction.options.getString('silver') ?? '0');
        const substanceSilver = (silver - totalCost) * 0.8;
        const fields: APIEmbedField[] = pt.list.map((member) => {
          return {
            name: `${face[Math.floor(Math.random() * face.length)]} ${
              member.name
            }: ${member.ip}`,
            value: `${(
              (substanceSilver * (Number(member.ip) / totalIp) +
                member.repairCost) /
              1000000
            ).toFixed(2)}M`,
            inline: true
          };
        });
        await interaction.reply(
          successEmbedsWithDescription(
            `:confetti_ball: ${pt.name} 清算！`,
            fields,
            `:moneybag:合計: ${(silver / 1000000).toFixed(2)}M 修理費: ${(
              totalCost / 1000000
            ).toFixed(2)}M 分配金: × 0.8 = ${(
              substanceSilver / 1000000
            ).toFixed(2)}M \n:crossed_swords:平均IP: ${Math.floor(
              totalIp / pt.list.length
            )} \n:family_mmgb:参加人数: ${pt.list.length}名`
          )
        );
        await ptList.delete(ptname);
      } else {
        await interaction.reply(dangerEmbeds(`pt: ${ptname}は未登録です。`));
      }
    }
  }
}

client.login(process.env.TOKEN);
