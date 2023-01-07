"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successEmbedsWithDescription = exports.successEmbeds = exports.dangerEmbeds = void 0;
const discord_js_1 = require("discord.js");
function dangerEmbeds(title) {
    return {
        embeds: [
            new discord_js_1.EmbedBuilder()
                .setColor(discord_js_1.Colors.Red)
                .setTitle(`:no_entry_sign: ${title}`)
        ],
        components: []
    };
}
exports.dangerEmbeds = dangerEmbeds;
function successEmbeds(title, fields = []) {
    return {
        embeds: [
            new discord_js_1.EmbedBuilder()
                .setColor(discord_js_1.Colors.Green)
                .setTitle(title)
                .setFields(fields)
        ],
        components: []
    };
}
exports.successEmbeds = successEmbeds;
function successEmbedsWithDescription(title, fields = [], description) {
    return {
        embeds: [
            new discord_js_1.EmbedBuilder()
                .setColor(discord_js_1.Colors.Green)
                .setTitle(title)
                .setDescription(description)
                .setFields(fields)
        ],
        components: []
    };
}
exports.successEmbedsWithDescription = successEmbedsWithDescription;
