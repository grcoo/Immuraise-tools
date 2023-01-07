import { ChatInputApplicationCommandData } from "discord.js";

export const command: string = 'dealer';
export const subCommands = {
    list: 'list',
    create: 'create',
    remove: 'remove',
    add: 'add',
    member: 'member',
    deal: 'deal'
} as const;

export const commands: ChatInputApplicationCommandData[] = [{
    name: command,
    description: 'ルートディーラー用',
    options: [
        {
            type: 1,
            name: subCommands.list,
            description: 'ptリストを返却します'
        },
        {
            type: 1,
            name: subCommands.create,
            description: 'ptリストにptを作成します',
            options: [
                {
                    type: 3,
                    name: 'ptname',
                    description: 'ptの名前を指定します',
                    required: true
                }
            ]
        },
        {
            type: 1,
            name: subCommands.remove,
            description: '指定したptをptリストから削除します',
            options: [
                {
                    type: 3,
                    name: 'ptname',
                    description: 'ptの名前を指定します',
                    required: true
                }
            ]
        },
        {
            type: 1,
            name: subCommands.add,
            description: 'メンバーを追加します',
            options: [
                {
                    type: 3,
                    name: 'ptname',
                    description: 'ptの名前を指定します',
                    required: true
                },
                {
                    type: 3,
                    name: 'name',
                    description: 'ptの名前を指定します',
                    required: true
                },
                {
                    type: 3,
                    name: 'ip',
                    description: 'ipを指定します',
                    required: true
                },
            ]
        },
        {
            type: 1,
            name: subCommands.member,
            description: 'メンバーをリストで表示します',
            options: [
                {
                    type: 3,
                    name: 'ptname',
                    description: 'ptの名前を指定します',
                    required: true
                }
            ]
        },
        {
            type: 1,
            name: subCommands.deal,
            description: '清算します',
            options: [
                {
                    type: 3,
                    name: 'ptname',
                    description: 'ptの名前を指定します',
                    required: true
                },
                {
                    type: 3,
                    name: 'silver',
                    description: 'シルバー',
                    required: true
                }
            ]
        }
    ]
}];