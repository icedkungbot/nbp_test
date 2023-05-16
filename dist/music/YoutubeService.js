"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeService = void 0;
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const ytpl_1 = __importDefault(require("ytpl"));
const ytsr_1 = __importDefault(require("ytsr"));
class YoutubeService {
    static getInstance() {
        if (!this.instance) {
            this.instance = new YoutubeService();
        }
        return this.instance;
    }
    static resolveId() {
        return YoutubeService.currentId++;
    }
    static getInSeconds(duration) {
        if (duration) {
            const split = duration.split(":");
            const hours = split.length === 3 ? split[0] : "0";
            const minutes = split.length === 3 ? split[1] : split[0];
            const seconds = split.length === 3 ? split[2] : split[1];
            return parseInt(hours, 10) * 60 * 60 + parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
        }
        else {
            return 0;
        }
    }
    constructor() {
        this.radioMaxLength = 600;
        if (process.env.RADIO_MAX_VIDEO_LENGTH != null) {
            this.radioMaxLength = parseInt(process.env.RADIO_MAX_VIDEO_LENGTH, 10);
        }
    }
    getInfo(param) {
        try {
            let promise;
            if (ytpl_1.default.validateID(param)) {
                promise = this.getPlaylistTracks(param);
            }
            else if (ytdl_core_1.default.validateURL(param)) {
                promise = this.getVideoInfo(param);
            }
            else {
                promise = this.search(param).then(items => items.find(item => item.type === 'video'));
            }
            return promise.then(value => {
                if (!value || (value instanceof Array && value.length === 0)) {
                    throw new Error("No Video found.");
                }
                return value;
            });
        }
        catch (e) {
            return Promise.reject("No Video found.");
        }
    }
    radio(url, includeCurrent) {
        if (ytdl_core_1.default.validateURL(url)) {
            return ytdl_core_1.default.getBasicInfo(url).then(info => {
                let tracks = info.related_videos.map(related => this.parseReleatedVideo(related)).filter(track => track.duration);
                if (this.radioMaxLength) {
                    const filteredTracks = tracks.filter(track => track.duration <= this.radioMaxLength);
                    if (filteredTracks.length !== 0) {
                        tracks = filteredTracks;
                    }
                    else {
                        console.log("Radio filter ignored. No track matches length criteria.");
                    }
                }
                if (includeCurrent) {
                    tracks.unshift(this.parseVideoInfo(info));
                }
                return tracks;
            });
        }
        else {
            return Promise.reject("not a video");
        }
    }
    getPlaylistTracks(param) {
        return (0, ytpl_1.default)(param)
            .then(playlist => playlist.items.filter(item => item.author && item.duration))
            .then(items => items.map(item => this.parsePlaylistItem(item)));
    }
    getStream(url) {
        // tslint:disable-next-line:no-bitwise
        return (0, ytdl_core_1.default)(url, { filter: "audioonly", quality: "highestaudio", highWaterMark: 1 << 25 });
    }
    search(query) {
        return (0, ytsr_1.default)(query, {
            limit: 20
        }).then(res => res.items.map(item => this.parse(item)).filter(video => video));
    }
    parse(item) {
        if (item.type === "shelf") {
            return this.parseShelfVertical(item);
        }
        else if (item.type === "video") {
            const trackInfo = this.parseVideo(item);
            if (trackInfo.duration) {
                return trackInfo;
            }
            else {
                return undefined;
            }
        }
        else if (item.type === "playlist") {
            return this.parsePlaylist(item);
        }
        return undefined;
    }
    parseShelfVertical(shelf) {
        const firstVideo = shelf.items.find(item => item.type === 'video');
        return {
            type: "shelf",
            title: shelf.title,
            items: shelf.items.filter(item => item.type === 'video').map(item => this.parseVideo(item)).filter(track => track.duration),
            thumbnailUrl: firstVideo ? firstVideo.bestThumbnail.url : ''
        };
    }
    parseVideo(video) {
        return {
            type: "video",
            id: YoutubeService.currentId++,
            url: video.url,
            title: video.title,
            artist: video.author.name,
            thumbnailUrl: video.bestThumbnail.url,
            duration: YoutubeService.getInSeconds(video.duration)
        };
    }
    parsePlaylist(playlist) {
        return {
            type: "playlist",
            title: playlist.title,
            thumbnailUrl: playlist.firstVideo.bestThumbnail.url,
            artist: playlist.owner.name,
            url: playlist.url,
            length: playlist.length
        };
    }
    getVideoInfo(url) {
        return ytdl_core_1.default.getBasicInfo(url).then(video => {
            if (video) {
                const trackInfo = this.parseVideoInfo(video);
                if (!trackInfo.duration) {
                    throw new Error("Video not supported.");
                }
                return trackInfo;
            }
            else {
                throw new Error("Video not found");
            }
        });
    }
    parseReleatedVideo(related) {
        return {
            type: "video",
            id: YoutubeService.currentId++,
            url: "https://www.youtube.com/watch?v=" + related.id,
            title: related.title,
            artist: related.author.name,
            thumbnailUrl: related.thumbnails[0].url,
            duration: related.length_seconds
        };
    }
    parseVideoInfo(video) {
        return {
            type: "video",
            id: YoutubeService.currentId++,
            url: video.videoDetails.video_url,
            title: video.videoDetails.title,
            artist: video.videoDetails.author.name,
            thumbnailUrl: video.videoDetails.thumbnails[0].url,
            duration: parseInt(video.player_response.videoDetails.lengthSeconds, 10)
        };
    }
    parsePlaylistItem(item) {
        return {
            type: "video",
            id: YoutubeService.currentId++,
            url: item.shortUrl,
            title: item.title,
            artist: item.author.name,
            thumbnailUrl: item.bestThumbnail.url,
            duration: item.durationSec
        };
    }
}
exports.YoutubeService = YoutubeService;
YoutubeService.currentId = 0;
//# sourceMappingURL=YoutubeService.js.map