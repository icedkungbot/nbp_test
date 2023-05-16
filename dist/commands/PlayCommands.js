"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAY_COMMANDS = void 0;
const discord_js_1 = require("discord.js");
function toArray(trackInfo) {
    if (Array.isArray(trackInfo)) {
        return trackInfo;
    }
    return [trackInfo];
}
function now(interaction, bot) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = interaction.options.getString("url", true);
        const trackInfos = toArray(yield bot.getGuildMusicManager(interaction.guild).playNow(url, interaction.member.voice.channel));
        if (trackInfos.length === 0) {
            return "No song found.";
        }
        return (0, discord_js_1.escapeMarkdown)(`Playing "${trackInfos[0].title}"${trackInfos.length > 1 ? ` and added ${trackInfos.length - 1} more to play next` : ""}.`);
    });
}
function next(interaction, bot) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = interaction.options.getString("url", true);
        const trackInfos = toArray(yield bot.getGuildMusicManager(interaction.guild).playNext(url));
        if (trackInfos.length === 0) {
            return "No song found.";
        }
        return (0, discord_js_1.escapeMarkdown)(`Added "${trackInfos[0].title}"${trackInfos.length > 1 ? ` and ${trackInfos.length - 1} more` : ""} to play next.`);
    });
}
function queue(interaction, bot) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = interaction.options.getString("url", true);
        const trackInfos = toArray(yield bot.getGuildMusicManager(interaction.guild).queue(url));
        if (trackInfos.length === 0) {
            return "No song found.";
        }
        return (0, discord_js_1.escapeMarkdown)(`Appended "${trackInfos[0].title}"${trackInfos.length > 1 ? ` and ${trackInfos.length - 1} more` : ""} to queue.`);
    });
}
function urlOption() {
    return (option) => option.setName("url")
        .setDescription("A url or search term.")
        .setRequired(true)
        .setMinLength(1);
}
exports.PLAY_COMMANDS = [
    {
        data: new discord_js_1.SlashCommandBuilder()
            .setName("play")
            .setDescription("Play a song now.")
            .addStringOption(urlOption())
            .addStringOption(option => option.setName("when")
            .setDescription("When to play it. (Default: now)")
            .setRequired(false)
            .setChoices({
            name: "now",
            value: "now"
        }, {
            name: "next",
            value: "next"
        }, {
            name: "queue",
            value: "queue"
        })),
        execute(interaction, bot) {
            return __awaiter(this, void 0, void 0, function* () {
                const when = interaction.options.getString("when", false);
                if (when === "next") {
                    return yield next(interaction, bot);
                }
                else if (when === "queue") {
                    return yield queue(interaction, bot);
                }
                else {
                    return yield now(interaction, bot);
                }
            });
        }
    }, {
        data: new discord_js_1.SlashCommandBuilder()
            .setName("now")
            .setDescription("Play a song.")
            .addStringOption(urlOption()),
        execute(interaction, bot) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield now(interaction, bot);
            });
        }
    }, {
        data: new discord_js_1.SlashCommandBuilder()
            .setName("next")
            .setDescription("Play a song next.")
            .addStringOption(urlOption()),
        execute(interaction, bot) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield next(interaction, bot);
            });
        }
    }, {
        data: new discord_js_1.SlashCommandBuilder()
            .setName("queue")
            .setDescription("Append a song to the queue.")
            .addStringOption(urlOption()),
        execute(interaction, bot) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield queue(interaction, bot);
            });
        }
    }
];
//# sourceMappingURL=PlayCommands.js.map