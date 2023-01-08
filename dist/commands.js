"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = exports.subCommands = exports.command = void 0;
exports.command = 'dealer';
exports.subCommands = {
    list: 'list',
    create: 'create',
    remove: 'remove',
    add: 'add',
    member: 'member',
    deal: 'deal'
};
exports.commands = [{
        name: exports.command,
        description: 'ルートディーラー用',
        options: [
            {
                type: 1,
                name: exports.subCommands.list,
                description: 'ptリストを返却します'
            },
            {
                type: 1,
                name: exports.subCommands.create,
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
                name: exports.subCommands.remove,
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
                name: exports.subCommands.add,
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
                        name: 'ip',
                        description: 'ipを指定します',
                        required: true
                    },
                ]
            },
            {
                type: 1,
                name: exports.subCommands.member,
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
                name: exports.subCommands.deal,
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
