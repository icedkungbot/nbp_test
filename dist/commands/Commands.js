"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMANDS = void 0;
const discord_js_1 = require("discord.js");
exports.COMMANDS = [
    {
        data: new discord_js_1.SlashCommandBuilder()
            .setName("join")
            .setDescription("Join your channel.")
            .addChannelOption(option => option.setName("channel")
            .setDescription("A voice channel")
            .addChannelTypes(discord_js_1.ChannelType.GuildVoice, discord_js_1.ChannelType.GuildStageVoice)
            .setRequired(false)),
        execute(interaction, bot) {
            let channel = interaction.options.getChannel("channel", false);
            if (channel == null) {
                channel = interaction.member.voice.channel;
            }
            bot.getGuildMusicManager(interaction.guild).join(channel);
            return "Joined.";
        }
    }, {
        data: new discord_js_1.SlashCommandBuilder()
            .setName("leave")
            .setDescription("Leave current channel."),
        execute(interaction, bot) {
            bot.getGuildMusicManager(interaction.guild).leave();
            return "Bye bye.";
        }
    }, {
        data: new discord_js_1.SlashCommandBuilder()
            .setName("player")
            .setDescription("Get the Url to the webinterface for this guild. " + process.env.URL + "/guilds"),
        execute(interaction, bot) {
            return bot.getGuildMusicManager(interaction.guild).getPlayerUrl(interaction.user.id);
        }
    },
];
//# sourceMappingURL=Commands.js.map