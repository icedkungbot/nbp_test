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
exports.PlaylistPanel = void 0;
const discord_js_1 = require("discord.js");
const TrackSchedulerObserverPanel_1 = require("./TrackSchedulerObserverPanel");
class PlaylistPanel extends TrackSchedulerObserverPanel_1.TrackSchedulerObserverPanel {
    constructor(trackScheduler, musicManager) {
        super(trackScheduler);
        this.musicManager = musicManager;
        this.tracksPerPage = 15;
        this.stepSize = 10;
        this.currentIndex = 0;
    }
    buildTrackMessage(trackScheduler) {
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("Playlist Panel")
            .setColor("#0099ff");
        const previousTracks = trackScheduler.getPreviousTracks().slice().reverse();
        const nextTracks = trackScheduler.getTracks();
        this.currentIndex = Math.max(this.currentIndex, previousTracks.length * -1);
        this.currentIndex = Math.min(this.currentIndex, Math.max(nextTracks.length - this.tracksPerPage, 0));
        let remainingTracks = this.tracksPerPage;
        if (this.currentIndex < 0) {
            const fromIndex = previousTracks.length + this.currentIndex;
            const toIndex = Math.min(fromIndex + remainingTracks, previousTracks.length);
            const previousToDisplay = previousTracks.slice(fromIndex, toIndex);
            remainingTracks -= previousToDisplay.length;
            embed.addFields({
                name: "Previous",
                value: this.buildText(fromIndex, toIndex, previousTracks.length, previousToDisplay)
            });
        }
        else {
            embed.addFields({
                name: "Previous",
                value: (0, discord_js_1.italic)(`${previousTracks.length} songs`)
            });
        }
        embed.addFields({ name: "Currently", value: this.trackToString(trackScheduler.getCurrentlyPlaying()) });
        if (this.currentIndex + this.tracksPerPage >= 0 && remainingTracks > 0 && nextTracks.length > 0) {
            const fromIndex = Math.max(this.currentIndex, 0);
            const toIndex = Math.min(fromIndex + remainingTracks, nextTracks.length);
            const nextTracksToDisplay = nextTracks.slice(fromIndex, toIndex);
            embed.addFields({
                name: "Up next",
                value: this.buildText(fromIndex, toIndex, nextTracks.length, nextTracksToDisplay)
            });
        }
        else {
            embed.addFields({
                name: "Up next",
                value: (0, discord_js_1.italic)(`${nextTracks.length} songs`)
            });
        }
        const buttons = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId("back")
            .setEmoji("⬅")
            .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
            .setCustomId("start")
            .setEmoji("⏺")
            .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
            .setCustomId("next")
            .setEmoji("➡")
            .setStyle(discord_js_1.ButtonStyle.Secondary));
        return { embeds: [embed], components: [buttons] };
    }
    buildText(fromIndex, toIndex, totalLength, previousToDisplay) {
        let previousMoreText = "";
        if (fromIndex > 0) {
            previousMoreText = (0, discord_js_1.italic)(`...+${fromIndex} songs`) + "\n";
        }
        let afterMoreText = "";
        if (toIndex < totalLength) {
            afterMoreText = "\n" + (0, discord_js_1.italic)(`...+${totalLength - toIndex} songs`);
        }
        return `${previousMoreText}${this.tracksToString(previousToDisplay)}${afterMoreText}`;
    }
    tracksToString(tracks) {
        let trackList = tracks.map(track => this.trackToString(track)).join("\n");
        if (trackList.length === 0) {
            trackList = " ";
        }
        return trackList;
    }
    trackToString(track) {
        if (track && track.id != null) {
            return (0, discord_js_1.escapeMarkdown)(`${track.id}. ${track.title}`);
        }
        else {
            return " ";
        }
    }
    handleButtonInteraction(id, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (id) {
                case "next":
                    this.currentIndex += this.stepSize;
                    break;
                case "back":
                    this.currentIndex -= this.stepSize;
                    break;
                case "start":
                    this.currentIndex = 0;
                    break;
                default:
                    console.error(`Unexpected interaction: ` + id);
            }
            this.update();
        });
    }
}
exports.PlaylistPanel = PlaylistPanel;
//# sourceMappingURL=PlaylistPanel.js.map