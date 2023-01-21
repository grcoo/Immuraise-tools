import {
  ApplicationCommandOptionType,
  ChatInputApplicationCommandData
} from 'discord.js';
import { mapObject } from './map-object';

export const commandsValue = {
  dealer: 'dealer',
  remind: 'remind'
} as const;
export const subCommandsValue = {
  list: 'list',
  create: 'create',
  remove: 'remove',
  add: 'add',
  member: 'member',
  deal: 'deal'
} as const;

export const commands: ChatInputApplicationCommandData[] = [
  {
    name: commandsValue.dealer,
    description: 'ルート分配',
    options: [
      {
        type: 1,
        name: subCommandsValue.list,
        description: 'PT登録済み一覧'
      },
      {
        type: 1,
        name: subCommandsValue.create,
        description: 'PT作成',
        options: [
          {
            type: ApplicationCommandOptionType.String,
            name: 'ptname',
            description: 'PT名',
            required: true
          }
        ]
      },
      {
        type: 1,
        name: subCommandsValue.remove,
        description: 'PT削除',
        options: [
          {
            type: ApplicationCommandOptionType.String,
            name: 'ptname',
            description: 'PT名',
            required: true
          }
        ]
      },
      {
        type: 1,
        name: subCommandsValue.add,
        description: 'メンバー追加',
        options: [
          {
            type: ApplicationCommandOptionType.String,
            name: 'ptname',
            description: 'PT名',
            required: true
          },
          {
            type: ApplicationCommandOptionType.Number,
            name: 'ip',
            description: 'IP',
            required: true
          },
          {
            type: ApplicationCommandOptionType.Number,
            name: 'repaircost',
            description: '修理費',
            required: true
          }
        ]
      },
      {
        type: 1,
        name: subCommandsValue.member,
        description: 'メンバーリスト',
        options: [
          {
            type: ApplicationCommandOptionType.String,
            name: 'ptname',
            description: 'PT名',
            required: true
          }
        ]
      },
      {
        type: 1,
        name: subCommandsValue.deal,
        description: '清算',
        options: [
          {
            type: ApplicationCommandOptionType.String,
            name: 'ptname',
            description: 'PT名',
            required: true
          },
          {
            type: ApplicationCommandOptionType.Number,
            name: 'silver',
            description: 'ルートシルバー',
            required: true
          }
        ]
      }
    ]
  },
  {
    name: commandsValue.remind,
    description: '各種情報リマインド',
    options: [
      {
        type: 1,
        name: subCommandsValue.list,
        description: 'リマインド一覧'
      },
      {
        type: 1,
        name: subCommandsValue.create,
        description: 'リマインド作成',
        options: [
          {
            type: ApplicationCommandOptionType.Attachment,
            name: 'mapimage',
            description: '画像を登録（マップ名が含まれたもの）',
            required: true
          },
          {
            type: ApplicationCommandOptionType.String,
            name: 'objectname',
            description: 'オブジェクト名',
            required: true,
            choices: mapObject
          },
          {
            type: ApplicationCommandOptionType.Number,
            name: 'time',
            description: '残り時間（単位：分）',
            required: true
          }
        ]
      }
    ]
  }
];
