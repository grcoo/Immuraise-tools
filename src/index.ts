import { face } from './discord/face';
import { Nedb, Pt, Remind } from './adapter/nedb-adapter';
import {
  APIEmbedField,
  CacheType,
  ChannelType,
  Client,
  Collection,
  GuildMember,
  Interaction
} from 'discord.js';
import dotenv from 'dotenv';
import { commandsValue, commands, subCommandsValue } from './discord/commands';
import { isAuth } from './utility/auth';
import {
  dangerEmbeds,
  remindEmbed,
  successEmbeds,
  successEmbedsWithDescription
} from './discord/embeds';
import { createDummyServer } from './dummy-server';
import { add } from 'date-fns';
import { processReminder } from './discord/remind';
import { shuffle } from './utility/shuffle';

createDummyServer(Number(process.env.PORT) || 8080);
dotenv.config();

const ptDB = new Nedb();
const remindDB = new Nedb();
const client = new Client({
  intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent']
});

async function onInteraction(interaction: Interaction<CacheType>) {
  if (!interaction.isCommand()) return;
  if (!interaction.isChatInputCommand()) return;
  const guild = await client.guilds.fetch(process.env.SERVER_ID ?? '');
  if (interaction.commandName === commandsValue.dealer) {
    if (interaction.channelId !== process.env.DEAL_CHANNEL_ID) {
      await interaction.reply(
        dangerEmbeds('コマンドを実行するchが違うようです。')
      );
      return;
    }
    if (interaction.options.getSubcommand() === subCommandsValue.create) {
      const ptname = interaction.options.getString('ptname') ?? '';
      const isExist = await ptDB.get({ name: ptname });
      if (isExist) {
        await interaction.reply(dangerEmbeds('既に存在するptです。'));
        return;
      }
      await ptDB.create<Pt>({
        name: ptname,
        creatorId: interaction.user.id,
        list: []
      });
      await interaction.reply(
        successEmbeds(`:triangular_flag_on_post: ${ptname} 作成完了!`)
      );
    }
    if (interaction.options.getSubcommand() === subCommandsValue.list) {
      const list = await ptDB.getAll<Pt>();
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
      const pt = await ptDB.get<Pt>({ name: ptname });

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
        await ptDB.delete({ name: ptname });
        await interaction.reply(
          successEmbeds(`:triangular_flag_on_post: ${ptname} 削除完了!`)
        );
      } else {
        await interaction.reply(dangerEmbeds(`pt: ${ptname}は未登録です。`));
      }
    }
    if (interaction.options.getSubcommand() === subCommandsValue.add) {
      const ptname = interaction.options.getString('ptname') ?? '';
      const pt = await ptDB.get<Pt>({ name: ptname });

      if (pt !== null) {
        const userName =
          (await (
            await guild?.members?.fetch(interaction.user.id)
          )?.displayName) ?? '';
        pt.list.push({
          userId: interaction.user.id,
          name: userName,
          ip: interaction.options.getNumber('ip') ?? 0,
          repairCost: interaction.options.getNumber('repaircost') ?? 0
        });
        await ptDB.updatePt(ptname, pt.list);
        await interaction.reply(
          successEmbeds(
            `:triangular_flag_on_post: ${ptname}に ${userName}::crossed_swords: ${interaction.options.getNumber(
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
      const pt = await ptDB.get<Pt>({ name: ptname });

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
      const pt = await ptDB.get<Pt>({ name: ptname });

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
          .reduce((a, b) => a + b);
        const totalCost = pt.list
          .map((member) => member.repairCost)
          .reduce((a, b) => a + b);
        const silver = interaction.options.getNumber('silver') ?? 0;
        const substanceSilver = (silver - totalCost) * 0.8;
        const fields: APIEmbedField[] = pt.list.map((member) => {
          return {
            name: `${face[Math.floor(Math.random() * face.length)]} ${
              member.name
            }: ${member.ip}`,
            value: `${(
              (substanceSilver * (member.ip / totalIp) + member.repairCost) /
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
        await ptDB.delete({ name: ptname });
      } else {
        await interaction.reply(dangerEmbeds(`pt: ${ptname}は未登録です。`));
      }
    }
  }

  if (interaction.commandName === commandsValue.remind) {
    if (interaction.channelId !== process.env.REMIND_CHANNEL_ID) {
      await interaction.reply(
        dangerEmbeds('コマンドを実行するchが違うようです。')
      );
      return;
    }
    if (interaction.options.getSubcommand() === subCommandsValue.list) {
      const reminders = await remindDB.getAll<Remind>();
      if (reminders === null || reminders.length === 0) {
        await interaction.reply(
          dangerEmbeds('リマインドは1件も登録されていません。')
        );
        return;
      }
      const embed = reminders.map((remind) => remindEmbed(remind));
      await interaction.reply({ embeds: embed });
    }
    if (interaction.options.getSubcommand() === subCommandsValue.create) {
      const mapImage = interaction.options.getAttachment('mapimage', true);
      const mapObject = interaction.options.getString('objectname') ?? '';
      const isExist = await remindDB.get<Remind>({
        mapImage: mapImage.url
      });
      if (isExist) {
        await interaction.reply(dangerEmbeds('既に存在するリマインドです。'));
        return;
      }
      const remind = {
        mapImage: mapImage.url,
        objectName: mapObject,
        timestamp: add(new Date(), {
          hours: 9,
          minutes: interaction.options.getNumber('time') ?? 0
        }).getTime()
      };
      if (interaction.options.getNumber('time') ?? 0 > 1) {
        await remindDB.create<Remind>(remind);
      }
      await interaction.reply({
        embeds: [
          remindEmbed(remind, interaction.options.getNumber('time') ?? 0)
        ],
        content: `<@&${process.env.OUTLAND_MENTION_ID}>`
      });
    }
  }

  if (interaction.commandName === commandsValue.shuffle) {
    if (interaction.channelId !== process.env.SHUFFLE_CHANNEL_ID) {
      await interaction.reply(
        dangerEmbeds('コマンドを実行するchが違うようです。')
      );
      return;
    }

    const excludesUser = interaction.options.getString('excludes') ?? '';
    const targetChannel = await guild.channels.fetch(
      interaction.options.getChannel('currentch')?.id ?? ''
    );
    const channel1 = await guild.channels.fetch(
      interaction.options.getChannel('ch1')?.id ?? ''
    );
    const channel2 = await guild.channels.fetch(
      interaction.options.getChannel('ch2')?.id ?? ''
    );
    const targetMember = targetChannel?.members;
    let member: GuildMember[] = [];
    if (targetMember instanceof Collection<string, GuildMember>) {
      targetMember.forEach((target) => {
        if (target.id === process.env.READ_BOT_ID) return;
        if (excludesUser !== '' && target.id.includes(excludesUser)) return;
        member.push(target);
      });
    }
    const shuffledMember = shuffle<GuildMember>(member);
    shuffledMember.forEach((m, index) => {
      if (index < Math.ceil(shuffledMember.length / 2)) {
        m.voice.setChannel(
          channel1?.type === ChannelType.GuildVoice ? channel1 : null
        );
      } else {
        m.voice.setChannel(
          channel2?.type === ChannelType.GuildVoice ? channel2 : null
        );
      }
    });
    await interaction.reply(
      successEmbeds(':triangular_flag_on_post: 割り振り完了！')
    );
  }
}

client.once('ready', async () => {
  await client.application?.commands.set(commands, process.env.SERVER_ID ?? '');
  console.log('Ready!');
});

client.on('interactionCreate', (interaction) =>
  onInteraction(interaction).catch((err) => console.error(err))
);

setInterval(
  () =>
    processReminder(remindDB, client, add(new Date(), { hours: 9 }).getTime()),
  60000
);

client.login(process.env.TOKEN);
