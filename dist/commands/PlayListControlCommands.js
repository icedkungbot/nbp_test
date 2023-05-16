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
exports.PLAYLIST_CONTROL_COMMANDS = void 0;
const discord_js_1 = require("discord.js");
exports.PLAYLIST_CONTROL_COMMANDS = [
    {
        data: new discord_js_1.SlashCommandBuilder()
            .setName("clear")
            .setDescription("Clear the current playlist"),
        execute(interaction, bot) {
            bot.getGuildMusicManager(interaction.guild).clearPlaylist();
            return "Playlist cleared.";
        }
    }, {
        data: new discord_js_1.SlashCommandBuilder()
            .setName("remove")
            .setDescription("Remove current track from the playlist")
            .addIntegerOption(option => option.setName("id")
            .setDescription("The song id, see with the musicpanel or list") // TODO convert to relative index -x (previous) 0 (current) +x(next)
            .setRequired(true)),
        execute(interaction, bot) {
            return __awaiter(this, void 0, void 0, function* () {
                if (yield bot.getGuildMusicManager(interaction.guild).removeTrackById(interaction.options.getInteger("id", true))) {
                    return "Song removed.";
                }
                return "Song could not be removed.";
            });
        }
    }, {
        data: new discord_js_1.SlashCommandBuilder()
            .setName("list")
            .setDescription("Display the playlist."),
        execute(interaction, bot) {
            return __awaiter(this, void 0, void 0, function* () {
                bot.getGuildMusicManager(interaction.guild).displayPlaylistPanel(interaction.channel);
                return "Displaying playlist.";
            });
        }
    }, {
        data: new discord_js_1.SlashCommandBuilder()
            .setName("repeat")
            .setDescription("Enable/Disable playlist repeat.")
            .addBooleanOption(option => option.setName("value")
            .setDescription("true or false (default: toggle)")
            .setRequired(false)),
        execute(interaction, bot) {
            return __awaiter(this, void 0, void 0, function* () {
                const value = interaction.options.getBoolean("value", false);
                const guildMusicManager = bot.getGuildMusicManager(interaction.guild);
                if (value == null) {
                    guildMusicManager.toggleRepeat();
                }
                else {
                    guildMusicManager.setRepeat(value);
                }
                return "Repeat " + (guildMusicManager.getRepeat() ? "enabled." : "disabled.");
            });
        }
    }, {
        data: new discord_js_1.SlashCommandBuilder()
            .setName("autoradio")
            .setDescription("Enable/Disable auto radio.")
            .addBooleanOption(option => option.setName("value")
            .setDescription("true or false (default: toggle)")
            .setRequired(false)),
        execute(interaction, bot) {
            return __awaiter(this, void 0, void 0, function* () {
                const value = interaction.options.getBoolean("value", false);
                const guildMusicManager = bot.getGuildMusicManager(interaction.guild);
                if (value == null) {
                    guildMusicManager.toggleRadio();
                }
                else {
                    guildMusicManager.setRadio(value);
                }
                return "Auto radio " + (guildMusicManager.getAutoRadio() ? "enabled." : "disabled.");
            });
        }
    },
];
//# sourceMappingURL=PlayListControlCommands.js.map