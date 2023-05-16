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
exports.GuildMusicManager = void 0;
const MusicPanel_1 = require("./MusicPanel");
const MusicPlayer_1 = require("./MusicPlayer");
const TrackScheduler_1 = require("./TrackScheduler");
const YoutubeService_1 = require("./YoutubeService");
const PlaylistPanel_1 = require("./PlaylistPanel");
class GuildMusicManager {
    constructor(guild) {
        this.guild = guild;
        this.autoLeaveTimeout = null;
        this.autoLeaveTimeoutSeconds = 60;
        this.resumeOnBotJoin = false;
        this.pauseOnUserLeave = true;
        this.resumeOnUserJoin = true;
        this.musicPlayer = new MusicPlayer_1.MusicPlayer(this.guild);
        this.trackScheduler = new TrackScheduler_1.TrackScheduler(this.musicPlayer, this);
        if (process.env.AUTO_LEAVE_TIMEOUT != null) {
            this.autoLeaveTimeoutSeconds = parseInt(process.env.AUTO_LEAVE_TIMEOUT, 10);
        }
        if (process.env.RESUME_ON_BOT_JOIN != null) {
            this.resumeOnBotJoin = process.env.RESUME_ON_BOT_JOIN === String(true);
        }
        if (process.env.PAUSE_ON_USER_LEAVE != null) {
            this.pauseOnUserLeave = process.env.PAUSE_ON_USER_LEAVE === String(true);
        }
        if (process.env.RESUME_ON_USER_JOIN != null) {
            this.resumeOnUserJoin = process.env.RESUME_ON_USER_JOIN === String(true);
        }
    }
    join(channel, resume = this.resumeOnBotJoin) {
        if (channel == null) {
            throw new Error("You must be in a channel.");
        }
        const voiceConnection = this.musicPlayer.join(channel.id);
        if (resume) {
            this.resume();
        }
        return voiceConnection;
    }
    leave() {
        if (this.isVoiceConnected()) {
            this.pause();
            this.musicPlayer.leave();
        }
    }
    playNow(url, channel) {
        return __awaiter(this, void 0, void 0, function* () {
            if (channel && !this.isVoiceConnected()) {
                yield this.join(channel, false);
            }
            const trackInfo = yield YoutubeService_1.YoutubeService.getInstance().getInfo(url);
            yield this.trackScheduler.now(trackInfo);
            return trackInfo;
        });
    }
    radio(url, includeCurrent = true) {
        return YoutubeService_1.YoutubeService.getInstance().radio(url, includeCurrent).then(tracks => this.queueList(tracks));
    }
    playNext(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const trackInfo = yield YoutubeService_1.YoutubeService.getInstance().getInfo(url);
            yield this.trackScheduler.next(trackInfo);
            return trackInfo;
        });
    }
    queue(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const trackInfo = yield YoutubeService_1.YoutubeService.getInstance().getInfo(url);
            yield this.trackScheduler.queue(trackInfo);
            return trackInfo;
        });
    }
    skip() {
        return this.trackScheduler.playNext();
    }
    skipBack() {
        this.trackScheduler.playPrevious();
    }
    seek(seconds) {
        this.musicPlayer.seek(seconds);
    }
    setVolume(volume) {
        this.musicPlayer.setVolume(volume);
    }
    pause() {
        this.trackScheduler.pause();
    }
    resume() {
        this.trackScheduler.resume();
    }
    togglePause() {
        if (this.trackScheduler.isPaused()) {
            this.resume();
        }
        else {
            this.pause();
        }
    }
    restart() {
        this.trackScheduler.restart();
    }
    displayMusicPanel(channel) {
        if (this.musicpanel) {
            this.musicpanel.destroy();
        }
        this.musicpanel = new MusicPanel_1.MusicPanel(this.trackScheduler, this);
        this.musicpanel.start(channel);
    }
    displayPlaylistPanel(channel) {
        if (this.playlistPanel) {
            this.playlistPanel.destroy();
        }
        this.playlistPanel = new PlaylistPanel_1.PlaylistPanel(this.trackScheduler, this);
        this.playlistPanel.start(channel);
    }
    close() {
        this.leave();
        if (this.musicpanel) {
            this.musicpanel.destroy();
        }
        if (this.playlistPanel) {
            this.playlistPanel.destroy();
        }
        this.clearAutoLeaveTimeout();
    }
    getTracks() {
        return this.trackScheduler.getTracks();
    }
    getPreviousTracks() {
        return this.trackScheduler.getPreviousTracks();
    }
    getCurrentTrack() {
        return this.trackScheduler.getCurrentlyPlaying();
    }
    getPlayerUrl(userId) {
        return process.env.URL + "/player/" + this.guild.id;
    }
    getTrackScheduler() {
        return this.trackScheduler;
    }
    getGuild() {
        return this.guild;
    }
    joinByUserId(userId) {
        return this.guild.members.fetch(userId).then(user => this.join(user.voice.channel));
    }
    isVoiceConnected() {
        return this.musicPlayer.isConnected();
    }
    removeTrackById(id) {
        return this.trackScheduler.removeById(id);
    }
    getVoiceChannels() {
        return this.guild.channels.cache.filter(channel => channel.isVoiceBased()).map(channel => {
            return {
                id: channel.id,
                name: channel.name
            };
        });
    }
    joinByChannelId(id) {
        const channel = this.guild.channels.resolve(id);
        if (channel.isVoiceBased()) {
            return this.join(channel);
        }
        throw new Error('not a voice channel');
    }
    toggleRepeat() {
        this.trackScheduler.setRepeat(!this.trackScheduler.getRepeat());
    }
    getRepeat() {
        return this.trackScheduler.getRepeat();
    }
    setRepeat(value) {
        this.trackScheduler.setRepeat(value);
    }
    toggleRadio() {
        this.trackScheduler.setAutoRadio(!this.trackScheduler.getAutoRadio());
    }
    getAutoRadio() {
        return this.trackScheduler.getAutoRadio();
    }
    setRadio(value) {
        this.trackScheduler.setAutoRadio(value);
    }
    add(queue, track, index) {
        this.resolveIds(track);
        this.trackScheduler.add(queue, track, index);
    }
    addByUrl(queue, url, index) {
        return YoutubeService_1.YoutubeService.getInstance().getInfo(url).then(res => this.trackScheduler.add(queue, res, index));
    }
    move(queue, id, index) {
        this.trackScheduler.move(queue, id, index);
    }
    playListNow(tracks) {
        this.resolveIds(tracks);
        return this.trackScheduler.now(tracks);
    }
    playListNext(tracks) {
        this.resolveIds(tracks);
        this.trackScheduler.next(tracks);
    }
    queueList(tracks) {
        this.resolveIds(tracks);
        this.trackScheduler.queue(tracks);
    }
    clearPlaylist() {
        this.trackScheduler.clear();
    }
    resolveIds(value) {
        if (Array.isArray(value)) {
            for (const track of value) {
                track.id = YoutubeService_1.YoutubeService.resolveId();
            }
        }
        else {
            value.id = YoutubeService_1.YoutubeService.resolveId();
        }
    }
    onUserChangeVoiceState(isSelf) {
        if (this.isBotOnlyMemberInVoiceChannel()) {
            if (this.pauseOnUserLeave && !isSelf) {
                this.pause();
            }
            if (this.autoLeaveTimeoutSeconds >= 0) {
                this.autoLeaveTimeout = setTimeout(() => {
                    this.autoLeaveTimeout = null;
                    if (this.isBotOnlyMemberInVoiceChannel()) {
                        this.leave();
                        console.log('auto leave guild: ' + this.guild.name);
                    }
                }, this.autoLeaveTimeoutSeconds * 1000);
            }
        }
        else {
            this.clearAutoLeaveTimeout();
            if (this.resumeOnUserJoin && !isSelf) {
                this.resume();
            }
        }
    }
    clearAutoLeaveTimeout() {
        if (this.autoLeaveTimeout) {
            clearTimeout(this.autoLeaveTimeout);
            this.autoLeaveTimeout = null;
        }
    }
    isBotOnlyMemberInVoiceChannel() {
        return this.isVoiceConnected() && this.musicPlayer.getChannel().members.size === 1;
    }
    tryJoin(channel) {
        try {
            if (this.isVoiceConnected()) {
                return false;
            }
            return !!this.join(channel);
        }
        catch (e) {
            console.debug(e);
            return false;
        }
    }
}
exports.GuildMusicManager = GuildMusicManager;
//# sourceMappingURL=GuildMusicManager.js.map