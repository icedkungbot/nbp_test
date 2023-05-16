"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicPlayer = void 0;
const YoutubeService_1 = require("./YoutubeService");
const voice_1 = require("@discordjs/voice");
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const stream_1 = require("stream");
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
class MusicPlayer {
    get voiceConnection() {
        const voiceConnection = (0, voice_1.getVoiceConnection)(this.guild.id);
        if (voiceConnection) {
            return voiceConnection;
        }
        throw new Error("Voice not connected. Add the Bot to a voice channel.");
    }
    get audioResource() {
        if (this._audioResource) {
            return this._audioResource;
        }
        throw new Error("There isn't any song playing");
    }
    set audioResource(audioResource) {
        this._audioResource = audioResource;
    }
    constructor(guild) {
        this.guild = guild;
        this.player = (0, voice_1.createAudioPlayer)();
        this.observers = [];
        this.url = null;
        this.startingSeconds = 0;
        this.volume = 20;
        if (process.env.DEFAULT_VOLUME != null) {
            this.setVolume(parseInt(process.env.DEFAULT_VOLUME, 10));
        }
        this.registerListeners();
    }
    register(observer) {
        this.observers.push(observer);
    }
    play(url) {
        this.stop();
        this.url = url;
        this.startingSeconds = 0;
        this.player.play(this.createAudioResource(url));
        this.forObservers(observer => observer.onStart());
    }
    registerListeners() {
        this.player.on(voice_1.AudioPlayerStatus.Playing, (oldState, newState) => this.handleStartEvent(oldState, newState));
        this.player.on(voice_1.AudioPlayerStatus.Buffering, (oldState, newState) => this.handleStartEvent(oldState, newState));
        this.player.on(voice_1.AudioPlayerStatus.Idle, () => this.forObservers(observer => {
            this.audioResource = null;
            observer.onEnd();
        }));
        this.player.on(voice_1.AudioPlayerStatus.Paused, () => this.forObservers(observer => observer.onTogglePause(true)));
        this.player.on(voice_1.AudioPlayerStatus.AutoPaused, () => this.forObservers(observer => observer.onTogglePause(true)));
        this.player.on("error", (err) => this.forObservers(observer => {
            this.audioResource = null;
            observer.onError(err);
        }));
    }
    handleStartEvent(oldState, newState) {
        if (oldState.status === voice_1.AudioPlayerStatus.Paused || oldState.status === voice_1.AudioPlayerStatus.AutoPaused) {
            this.forObservers(observer => observer.onTogglePause(false));
        }
        else if (oldState.status !== voice_1.AudioPlayerStatus.Playing && oldState.status !== voice_1.AudioPlayerStatus.Buffering) {
            this.forObservers(observer => observer.onStart());
        }
    }
    seek(seconds) {
        if (this.url != null) {
            this.startingSeconds = seconds;
            if (this.isCurrentlyPlaying()) {
                this.player.stop();
            }
            this.player.play(this.createAudioResource(this.url, this.startingSeconds));
            this.forObservers(observer => observer.onSeek());
        }
    }
    createAudioResource(url, seek = 0) {
        const stream = YoutubeService_1.YoutubeService.getInstance().getStream(url);
        if (seek > 0) {
            const bufferStream = new stream_1.Stream.PassThrough();
            (0, fluent_ffmpeg_1.default)({ source: stream })
                .setFfmpegPath(ffmpeg_static_1.default)
                .format("opus")
                .seekInput(seek)
                .on("error", err => {
                if (err && err instanceof Error && err.message.includes("Premature close")) {
                    return;
                }
                console.error(err);
            })
                .stream(bufferStream);
            this.audioResource = (0, voice_1.createAudioResource)(bufferStream, { inlineVolume: true });
        }
        else {
            this.audioResource = (0, voice_1.createAudioResource)(stream, { inlineVolume: true });
        }
        this.audioResource.volume.setVolumeLogarithmic(this.getVolumeInternal());
        return this.audioResource;
    }
    pause() {
        if (this.isCurrentlyPlaying()) {
            this.player.pause(true);
        }
    }
    resume() {
        if (this.isCurrentlyPlaying()) {
            this.player.unpause();
        }
    }
    isPaused() {
        if (this.isCurrentlyPlaying()) {
            return this.player.state.status === voice_1.AudioPlayerStatus.Paused || this.player.state.status === voice_1.AudioPlayerStatus.AutoPaused;
        }
        return true;
    }
    isCurrentlyPlaying() {
        return this.isConnected() && !!this._audioResource;
    }
    isConnected() {
        return !!(0, voice_1.getVoiceConnection)(this.guild.id);
    }
    getPosition() {
        return Math.floor(this.audioResource.playbackDuration / 1000) + this.startingSeconds;
    }
    getVolume() {
        return this.volume;
    }
    setVolume(volume) {
        volume = Math.min(150, Math.abs(volume));
        if (!isNaN(volume)) {
            this.volume = volume;
            if (this.isCurrentlyPlaying()) {
                this.audioResource.volume.setVolumeLogarithmic(this.getVolumeInternal());
            }
            this.forObservers(observer => observer.onVolumeChange());
        }
        else {
            console.error(`Volume ${volume} couldn't be applied.`);
        }
    }
    getVolumeInternal() {
        return this.volume / 100;
    }
    stop() {
        this.url = null;
        if (this.isCurrentlyPlaying()) {
            this.player.stop();
        }
    }
    forObservers(func) {
        for (const observer of this.observers) {
            func(observer);
        }
    }
    join(channelId) {
        const voiceConnection = (0, voice_1.joinVoiceChannel)({
            channelId,
            guildId: this.guild.id,
            adapterCreator: this.guild.voiceAdapterCreator
        });
        voiceConnection.subscribe(this.player);
        return voiceConnection;
    }
    leave() {
        this.voiceConnection.destroy();
    }
    getChannel() {
        return this.guild.channels.cache.get((0, voice_1.getVoiceConnection)(this.guild.id).joinConfig.channelId);
    }
}
exports.MusicPlayer = MusicPlayer;
//# sourceMappingURL=MusicPlayer.js.map