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
exports.MUSIC_CONTROL_COMMANDS = void 0;
const discord_js_1 = require("discord.js");
function tryJoin(interaction, bot) {
    bot.getGuildMusicManager(interaction.guild).tryJoin(interaction.member.voice.channel);
}
function seek(musicManager, seconds) {
    if (!musicManager.isVoiceConnected() || !musicManager.getCurrentTrack().url) {
        return "Nothing currently playing.";
    }
    seconds = Math.min(Math.max(seconds, 0), musicManager.getCurrentTrack().duration);
    musicManager.seek(seconds);
    return `Jumped to ${seconds}s.`;
}
exports.MUSIC_CONTROL_COMMANDS = [
    {
        data: new discord_js_1.SlashCommandBuilder()
            .setName("pause")
            .setDescription("Pauses the song."),
        execute(interaction, bot) {
            bot.getGuildMusicManager(interaction.guild).pause();
            return "Paused.";
        }
    }, {
        data: new discord_js_1.SlashCommandBuilder()
            .setName("resume")
            .setDescription("Resumes the song."),
        execute(interaction, bot) {
            tryJoin(interaction, bot);
            bot.getGuildMusicManager(interaction.guild).resume();
            return "Resumed.";
        }
    }, {
        data: new discord_js_1.SlashCommandBuilder()
            .setName("skip")
            .setDescription("Skip to the next song."),
        execute(interaction, bot) {
            return __awaiter(this, void 0, void 0, function* () {
                tryJoin(interaction, bot);
                yield bot.getGuildMusicManager(interaction.guild).skip();
                return "Skipped.";
            });
        }
    }, {
        data: new discord_js_1.SlashCommandBuilder()
            .setName("previous")
            .setDescription("Skip to the previous song."),
        execute(interaction, bot) {
            tryJoin(interaction, bot);
            bot.getGuildMusicManager(interaction.guild).skipBack();
            return "Going back.";
        }
    }, {
        data: new discord_js_1.SlashCommandBuilder()
            .setName("restart")
            .setDescription("Restart the current song."),
        execute(interaction, bot) {
            tryJoin(interaction, bot);
            bot.getGuildMusicManager(interaction.guild).restart();
            return "Restarting song.";
        }
    }, {
        data: new discord_js_1.SlashCommandBuilder()
            .setName("volume")
            .setDescription("Set the volume")
            .addIntegerOption(option => option.setName("volume")
            .setDescription("0 - 150")
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(150)),
        execute(interaction, bot) {
            tryJoin(interaction, bot);
            const volume = interaction.options.getInteger("volume", true);
            bot.getGuildMusicManager(interaction.guild).setVolume(volume);
            return "Volume set to " + volume;
        }
    }, {
        data: new discord_js_1.SlashCommandBuilder()
            .setName("seekfromstart")
            .setDescription("Seek in the song.")
            .addIntegerOption(option => option.setName("seconds")
            .setDescription("Seconds from start.")
            .setRequired(true)
            .setMinValue(0)),
        execute(interaction, bot) {
            tryJoin(interaction, bot);
            const seconds = interaction.options.getInteger("seconds", true);
            const musicManager = bot.getGuildMusicManager(interaction.guild);
            return seek(musicManager, seconds);
        }
    }, {
        data: new discord_js_1.SlashCommandBuilder()
            .setName("seek")
            .setDescription("Seek in the song relative to current position.")
            .addIntegerOption(option => option.setName("seconds")
            .setDescription("+/- seconds from current position.")
            .setRequired(true)),
        execute(interaction, bot) {
            tryJoin(interaction, bot);
            const seconds = interaction.options.getInteger("seconds", true);
            const musicManager = bot.getGuildMusicManager(interaction.guild);
            const positionAfter = musicManager.getCurrentTrack().position + seconds;
            return seek(musicManager, positionAfter);
        }
    }, {
        data: new discord_js_1.SlashCommandBuilder()
            .setName("musicpanel")
            .setDescription("Display music control panel."),
        execute(interaction, bot) {
            bot.getGuildMusicManager(interaction.guild).displayMusicPanel(interaction.channel);
            return "Displaying music panel.";
        }
    },
];
//# sourceMappingURL=MusicControlCommands.js.map