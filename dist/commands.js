"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = exports.subCommandsValue = exports.commandsValue = void 0;
exports.commandsValue = { dealer: 'dealer' };
exports.subCommandsValue = {
    list: 'list',
    create: 'create',
    remove: 'remove',
    add: 'add',
    member: 'member',
    deal: 'deal'
};
exports.commands = [
    {
        name: exports.commandsValue.dealer,
        description: 'ルートディーラー用',
        options: [
            {
                type: 1,
                name: exports.subCommandsValue.list,
                description: 'ptリストを返却します'
            },
            {
                type: 1,
                name: exports.subCommandsValue.create,
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
                name: exports.subCommandsValue.remove,
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
                name: exports.subCommandsValue.add,
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
                    {
                        type: 3,
                        name: 'repaircost',
                        description: '修理費を指定します',
                        required: true
                    }
                ]
            },
            {
                type: 1,
                name: exports.subCommandsValue.member,
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
                name: exports.subCommandsValue.deal,
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
                        description: '合計シルバーを指定します',
                        required: true
                    }
                ]
            }
        ]
    }
];
