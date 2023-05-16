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
exports.TrackScheduler = void 0;
class TrackScheduler {
    constructor(musicPlayer, musicManager) {
        this.musicPlayer = musicPlayer;
        this.musicManager = musicManager;
        this.tracks = [];
        this.previousTracks = [];
        this.observers = [];
        this.repeat = true;
        this.autoRadio = false;
        this.musicPlayer.register(this);
    }
    onTogglePause(value) {
        this.updateObservers();
    }
    onSeek() {
        this.updateObservers();
    }
    onVolumeChange() {
        this.updateObservers();
    }
    playNext(fromEvent = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.musicPlayer.isConnected()) {
                let trackInfo = this.tracks.shift();
                if (!trackInfo && this.autoRadio) {
                    yield this.musicManager.radio(this.currentlyPlaying.url, false);
                    trackInfo = this.tracks.shift();
                }
                if (!trackInfo && this.repeat) {
                    if (this.previousTracks.length > 0) {
                        if (this.currentlyPlaying) {
                            this.previousTracks.unshift(this.currentlyPlaying);
                            this.currentlyPlaying = null;
                        }
                        this.tracks = this.previousTracks.reverse();
                        this.previousTracks = [];
                        trackInfo = this.tracks.shift();
                    }
                    else if (this.currentlyPlaying && fromEvent) {
                        return this.restart();
                    }
                }
                if (trackInfo) {
                    if (this.currentlyPlaying) {
                        this.previousTracks.unshift(this.currentlyPlaying);
                        this.currentlyPlaying = null;
                    }
                    this.currentlyPlaying = trackInfo;
                    this.musicPlayer.play(trackInfo.url);
                }
                else {
                    throw new Error("No track in queue");
                }
            }
            else {
                throw new Error("Voice not connected. Add the Bot to a voice channel.");
            }
        });
    }
    playPrevious(fromEvent = false) {
        if (this.musicPlayer.isConnected()) {
            let trackInfo = this.previousTracks.shift();
            if (!trackInfo && this.repeat) {
                if (this.tracks.length > 0) {
                    if (this.currentlyPlaying) {
                        this.tracks.unshift(this.currentlyPlaying);
                        this.currentlyPlaying = null;
                    }
                    this.previousTracks = this.tracks.reverse();
                    this.tracks = [];
                    trackInfo = this.previousTracks.shift();
                }
                else if (this.currentlyPlaying && fromEvent) {
                    return this.restart();
                }
            }
            if (trackInfo) {
                if (this.currentlyPlaying) {
                    this.tracks.unshift(this.currentlyPlaying);
                    this.currentlyPlaying = null;
                }
                this.currentlyPlaying = trackInfo;
                this.musicPlayer.play(trackInfo.url);
            }
            else {
                throw new Error("No track in queue");
            }
        }
        else {
            throw new Error("Voice not connected. Add the Bot to a voice channel.");
        }
    }
    restart() {
        if (this.currentlyPlaying) {
            this.musicPlayer.play(this.currentlyPlaying.url);
        }
        else {
            throw new Error("Nothing currently playing");
        }
    }
    queue(tracks) {
        if (Array.isArray(tracks)) {
            tracks = tracks.slice();
            for (const track of tracks) {
                this.tracks.push(track);
            }
        }
        else {
            this.tracks.push(tracks);
        }
        this.updateObservers();
    }
    next(tracks) {
        if (Array.isArray(tracks)) {
            tracks = tracks.slice();
            for (const track of tracks.reverse()) {
                this.tracks.unshift(track);
            }
        }
        else {
            this.tracks.unshift(tracks);
        }
        this.updateObservers();
    }
    now(tracks) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(tracks)) {
                tracks = tracks.slice();
                if (tracks.length > 0) {
                    yield this.now(tracks.shift());
                    this.next(tracks);
                }
            }
            else {
                this.next(tracks);
                yield this.playNext();
            }
            this.updateObservers();
        });
    }
    pause() {
        this.musicPlayer.pause();
    }
    resume() {
        if (this.currentlyPlaying && !this.musicPlayer.isCurrentlyPlaying()) {
            this.restart();
        }
        else {
            this.musicPlayer.resume();
        }
    }
    onEnd() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.playNext(true);
            }
            catch (e) {
                console.log(e);
            }
            this.updateObservers();
        });
    }
    onError(err) {
        return __awaiter(this, void 0, void 0, function* () {
            console.error(err);
            yield this.onEnd();
        });
    }
    onStart() {
        this.updateObservers();
    }
    register(observer) {
        this.observers.push(observer);
    }
    getCurrentlyPlaying() {
        return Object.assign({ paused: this.musicPlayer.isCurrentlyPlaying() ? this.isPaused() : true, position: this.musicPlayer.isCurrentlyPlaying() ? this.musicPlayer.getPosition() : NaN, volume: this.musicPlayer.getVolume() }, this.currentlyPlaying);
    }
    deregister(observer) {
        this.observers.splice(this.observers.indexOf(observer), 1);
    }
    isPaused() {
        return this.musicPlayer.isPaused();
    }
    getTracks() {
        return this.tracks;
    }
    getPreviousTracks() {
        return this.previousTracks;
    }
    getMusicManager() {
        return this.musicManager;
    }
    removeById(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (id === ((_a = this.currentlyPlaying) === null || _a === void 0 ? void 0 : _a.id)) {
                yield this.tryPlayNext();
            }
            let success = false;
            const trackIndex = this.tracks.findIndex(track => track.id === id);
            if (trackIndex !== -1) {
                success = success || this.tracks.splice(trackIndex, 1).length > 0;
            }
            const previousTrackIndex = this.previousTracks.findIndex(track => track.id === id);
            if (previousTrackIndex !== -1) {
                success = success || this.previousTracks.splice(previousTrackIndex, 1).length > 0;
            }
            this.updateObservers();
            return success;
        });
    }
    tryPlayNext() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.playNext();
            }
            catch (e) {
                console.debug();
            }
        });
    }
    setRepeat(value) {
        this.repeat = value;
        this.updateObservers();
    }
    getRepeat() {
        return this.repeat;
    }
    setAutoRadio(value) {
        this.autoRadio = value;
        this.updateObservers();
    }
    getAutoRadio() {
        return this.autoRadio;
    }
    add(queueType, trackInfo, index) {
        try {
            const queue = this.getQueue(queueType);
            if (Array.isArray(trackInfo)) {
                for (let i = 0; i < trackInfo.length; i++) {
                    queue.splice(index + i, 0, trackInfo[i]);
                }
            }
            else {
                queue.splice(index, 0, trackInfo);
            }
        }
        finally {
            this.updateObservers();
        }
    }
    move(queueType, id, newIndex) {
        try {
            let currentIndex = this.tracks.findIndex(track => track.id === id);
            let fromQueue = this.tracks;
            if (currentIndex < 0) {
                currentIndex = this.previousTracks.findIndex(track => track.id === id);
                fromQueue = this.previousTracks;
            }
            const targetQueue = this.getQueue(queueType);
            if (currentIndex >= 0 && newIndex >= 0 && newIndex < targetQueue.length) {
                targetQueue.splice(newIndex, 0, fromQueue.splice(currentIndex, 1)[0]);
            }
            else {
                throw new Error("Move failed");
            }
        }
        finally {
            this.updateObservers();
        }
    }
    getQueue(queueType) {
        if (queueType === 'queue') {
            return this.tracks;
        }
        if (queueType === 'previous') {
            return this.previousTracks;
        }
        throw new Error("Queue not known: " + queueType);
    }
    clear() {
        this.currentlyPlaying = null;
        this.tracks = [];
        this.previousTracks = [];
        this.musicPlayer.stop();
        this.updateObservers();
    }
    updateObservers() {
        for (const observer of this.observers) {
            try {
                observer.onChange(this);
            }
            catch (e) {
                console.error(e);
            }
        }
    }
}
exports.TrackScheduler = TrackScheduler;
//# sourceMappingURL=TrackScheduler.js.map