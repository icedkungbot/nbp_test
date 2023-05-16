"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebRouter = void 0;
const express_1 = __importDefault(require("express"));
const Bot_1 = require("./Bot");
const YoutubeService_1 = require("./music/YoutubeService");
const cors_1 = __importDefault(require("cors"));
class WebRouter {
    constructor() {
        this.router = express_1.default.Router();
        this.bot = Bot_1.Bot.getInstance();
    }
    setup() {
        this.router.use((0, cors_1.default)());
        this.router.get("/:guildId/queue/:url", (req, res, next) => {
            this.handleResponse(this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId)
                .queue(req.params.url), res);
        });
        this.router.post("/post/:guildId/queue", (req, res, next) => {
            this.handleResponse(this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId)
                .queue(req.body.url), res);
        });
        this.router.get("/:guildId/next/:url", (req, res, next) => {
            this.handleResponse(this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId)
                .playNext(req.params.url), res);
        });
        this.router.post("/post/:guildId/next", (req, res, next) => {
            this.handleResponse(this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId)
                .playNext(req.body.url), res);
        });
        this.router.get("/:guildId/now/:url", (req, res, next) => {
            this.handleResponse(this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId)
                .playNow(req.params.url), res);
        });
        this.router.post("/post/:guildId/now", (req, res, next) => {
            this.handleResponse(this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId)
                .playNow(req.body.url), res);
        });
        this.router.get("/:guildId/radio/:url", (req, res, next) => {
            this.handleResponse(this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId)
                .radio(req.params.url), res);
        });
        this.router.post("/post/:guildId/radio", (req, res, next) => {
            this.handleResponse(this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId)
                .radio(req.body.url), res);
        });
        this.router.post("/:guildId/queue", (req, res, next) => {
            this.handleResponse(() => this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId)
                .queueList(req.body.tracks), res);
        });
        this.router.post("/:guildId/next", (req, res, next) => {
            this.handleResponse(() => this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId)
                .playListNext(req.body.tracks), res);
        });
        this.router.post("/:guildId/now", (req, res, next) => {
            this.handleResponse(this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId)
                .playListNow(req.body.tracks), res);
        });
        this.router.post("/:guildId/radio", (req, res, next) => {
            this.handleResponse(this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId)
                .radio(req.body.tracks), res);
        });
        this.router.get("/:guildId/skip", (req, res, next) => {
            this.handleResponse(this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId).skip(), res);
        });
        this.router.get("/:guildId/skipBack", (req, res, next) => {
            this.handleResponse(() => this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId).skipBack(), res);
        });
        this.router.get("/:guildId/seek/:seconds", (req, res, next) => {
            this.handleResponse(() => this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId).seek(parseInt(req.params.seconds, 10)), res);
        });
        this.router.get("/:guildId/volume/:volume", (req, res, next) => {
            this.handleResponse(() => this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId).setVolume(parseInt(req.params.volume, 10)), res);
        });
        this.router.get("/:guildId/restart", (req, res, next) => {
            this.handleResponse(() => this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId).restart(), res);
        });
        this.router.get("/:guildId/togglePause", (req, res, next) => {
            this.handleResponse(() => this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId).togglePause(), res);
        });
        this.router.get("/:guildId/remove/:id", (req, res, next) => {
            this.handleResponse(this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId)
                .removeTrackById(parseInt(req.params.id, 10)), res);
        });
        this.router.get("/search/:query", (req, res, next) => {
            YoutubeService_1.YoutubeService.getInstance().search(req.params.query).then(result => res.send(result))
                .catch(err => this.error(err, res));
        });
        this.router.post("/post/search", (req, res, next) => {
            YoutubeService_1.YoutubeService.getInstance().search(req.body.query).then(result => res.send(result))
                .catch(err => this.error(err, res));
        });
        this.router.get("/playlist/:url/items", (req, res, next) => {
            YoutubeService_1.YoutubeService.getInstance().getPlaylistTracks(req.params.url).then(result => res.send(result))
                .catch(err => this.error(err, res));
        });
        this.router.post("/post/playlist/items", (req, res, next) => {
            YoutubeService_1.YoutubeService.getInstance().getPlaylistTracks(req.body.url).then(result => res.send(result))
                .catch(err => this.error(err, res));
        });
        this.router.get("/guilds/get", (req, res, next) => {
            res.send(this.bot.getGuilds());
        });
        this.router.get("/:guildId/channels", (req, res, next) => {
            res.send(this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId).getVoiceChannels());
        });
        this.router.get("/:guildId/join/:id", (req, res, next) => {
            this.handleResponse(() => this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId)
                .joinByChannelId(req.params.id), res);
        });
        this.router.get("/:guildId/leave", (req, res, next) => {
            this.handleResponse(() => this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId).leave(), res);
        });
        this.router.get("/:guildId/toggleRepeat", (req, res, next) => {
            this.handleResponse(() => this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId)
                .toggleRepeat(), res);
        });
        this.router.get("/:guildId/toggleRadio", (req, res, next) => {
            this.handleResponse(() => this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId)
                .toggleRadio(), res);
        });
        this.router.post("/:guildId/add/:queue/:index", (req, res, next) => {
            this.handleResponse(() => this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId)
                .add(req.params.queue, req.body.value, parseInt(req.params.index, 10)), res);
        });
        this.router.get("/:guildId/add/:queue/:index/:url", (req, res, next) => {
            this.handleResponse(this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId)
                .addByUrl(req.params.queue, req.params.url, parseInt(req.params.index, 10)), res);
        });
        this.router.post("/post/:guildId/add/:queue/:index", (req, res, next) => {
            this.handleResponse(this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId)
                .addByUrl(req.params.queue, req.body.url, parseInt(req.params.index, 10)), res);
        });
        this.router.get("/:guildId/move/:queue/:id/:index", (req, res, next) => {
            this.handleResponse(() => this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId)
                .move(req.params.queue, parseInt(req.params.id, 10), parseInt(req.params.index, 10)), res);
        });
        this.router.get("/:guildId/clear", (req, res, next) => {
            this.handleResponse(() => this.bot.getGuildMusicManagerByIdIfExists(req.params.guildId)
                .clearPlaylist(), res);
        });
        return this.router;
    }
    handleResponse(promise, res) {
        if (promise instanceof Promise) {
            promise.then(() => this.ok(res)).catch(err => this.error(err, res));
        }
        else {
            try {
                promise();
                this.ok(res);
            }
            catch (e) {
                this.error(e, res);
            }
        }
    }
    ok(res) {
        res.status(200).send({ status: 200, message: "OK" });
    }
    error(err, res) {
        console.error(err);
        res.status(500).send({ status: 500, message: err.message });
    }
}
exports.WebRouter = WebRouter;
//# sourceMappingURL=WebRouter.js.map