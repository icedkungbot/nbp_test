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
exports.MusicPanel = void 0;
const discord_js_1 = require("discord.js");
const TrackSchedulerObserverPanel_1 = require("./TrackSchedulerObserverPanel");
class MusicPanel extends TrackSchedulerObserverPanel_1.TrackSchedulerObserverPanel {
    constructor(trackScheduler, musicManager) {
        super(trackScheduler);
        this.musicManager = musicManager;
    }
    buildTrackMessage(trackScheduler) {
        const currentlyPlaying = trackScheduler.getCurrentlyPlaying();
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("Music Panel")
            .setColor("#0099ff");
        if (currentlyPlaying && currentlyPlaying.type) {
            embed.addFields({ name: "Title", value: (0, discord_js_1.escapeMarkdown)(currentlyPlaying.title) }, { name: "Artist", value: (0, discord_js_1.escapeMarkdown)(currentlyPlaying.artist), inline: true }, { name: "Volume", value: String(currentlyPlaying.volume), inline: true }, { name: "Url", value: currentlyPlaying.url }).setThumbnail(currentlyPlaying.thumbnailUrl);
        }
        const tracks = trackScheduler.getTracks().slice(0, 3);
        let trackList = tracks.map(track => (0, discord_js_1.escapeMarkdown)(`${track.id}. ${track.title}`)).join("\n");
        if (trackList.length === 0) {
            trackList = " ";
        }
        embed.addFields({ name: "Up next", value: trackList });
        const row1 = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId(MusicPanel.RESTART)
            .setEmoji("↪")
            .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
            .setCustomId(MusicPanel.PREVIOUS)
            .setEmoji("⏮")
            .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
            .setCustomId(MusicPanel.PAUSE_RESUME)
            .setEmoji(currentlyPlaying.paused ? "▶" : "⏸")
            .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
            .setCustomId(MusicPanel.SKIP)
            .setEmoji("⏭")
            .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
            .setCustomId(MusicPanel.JOIN)
            .setLabel("Join")
            .setStyle(discord_js_1.ButtonStyle.Success));
        const row2 = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId(MusicPanel.REPEAT)
            .setEmoji("🔁")
            .setStyle(trackScheduler.getRepeat() ? discord_js_1.ButtonStyle.Primary : discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
            .setCustomId(MusicPanel.RADIO)
            .setEmoji("📻")
            .setStyle(trackScheduler.getAutoRadio() ? discord_js_1.ButtonStyle.Primary : discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
            .setCustomId(MusicPanel.VOLUME_DOWN)
            .setEmoji("🔉")
            .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
            .setCustomId(MusicPanel.VOLUME_UP)
            .setEmoji("🔊")
            .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
            .setCustomId(MusicPanel.LEAVE)
            .setLabel("Leave")
            .setStyle(discord_js_1.ButtonStyle.Danger));
        return { embeds: [embed], components: [row1, row2] };
    }
    handleButtonInteraction(id, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (interaction.customId) {
                case MusicPanel.PREVIOUS:
                    this.musicManager.skipBack();
                    break;
                case MusicPanel.RESTART:
                    this.musicManager.restart();
                    break;
                case MusicPanel.PAUSE_RESUME:
                    this.musicManager.togglePause();
                    break;
                case MusicPanel.SKIP:
                    yield this.musicManager.skip();
                    break;
                case MusicPanel.REPEAT:
                    yield this.musicManager.toggleRepeat();
                    break;
                case MusicPanel.RADIO:
                    yield this.musicManager.toggleRadio();
                    break;
                case MusicPanel.VOLUME_DOWN:
                    yield this.musicManager.setVolume(this.musicManager.getCurrentTrack().volume - 5);
                    break;
                case MusicPanel.VOLUME_UP:
                    yield this.musicManager.setVolume(this.musicManager.getCurrentTrack().volume + 5);
                    break;
                case MusicPanel.JOIN:
                    yield this.musicManager.join(interaction.member.voice.channel);
                    break;
                case MusicPanel.LEAVE:
                    yield this.musicManager.leave();
                    break;
                default:
                    console.error(`Unexpected interaction: ` + interaction.customId);
            }
        });
    }
}
exports.MusicPanel = MusicPanel;
MusicPanel.PREVIOUS = "previous";
MusicPanel.RESTART = "restart";
MusicPanel.PAUSE_RESUME = "pause";
MusicPanel.SKIP = "skip";
MusicPanel.REPEAT = "repeat";
MusicPanel.RADIO = "radio";
MusicPanel.VOLUME_UP = "vol_up";
MusicPanel.VOLUME_DOWN = "vol_down";
MusicPanel.JOIN = "join";
MusicPanel.LEAVE = "leave";
//# sourceMappingURL=MusicPanel.js.map