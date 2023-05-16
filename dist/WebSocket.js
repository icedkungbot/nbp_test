"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocket = void 0;
const Bot_1 = require("./Bot");
class WebSocket {
    constructor(io) {
        this.io = io;
        this.musicManagers = new Map();
        this.bot = Bot_1.Bot.getInstance();
    }
    start() {
        console.log("Start");
        this.io.on("connection", socket => {
            socket.on("joinGuild", (data) => {
                try {
                    if (data.oldGuildId) {
                        socket.leave(data.oldGuildId);
                    }
                    let musicManager;
                    if (this.musicManagers.has(data.guildId)) {
                        musicManager = this.musicManagers.get(data.guildId);
                    }
                    else {
                        musicManager = this.bot.getGuildMusicManagerById(data.guildId);
                        this.musicManagers.set(data.guildId, musicManager);
                        musicManager.getTrackScheduler().register(this);
                    }
                    socket.join(data.guildId);
                    socket.emit("guild", {
                        id: musicManager.getGuild().id,
                        name: musicManager.getGuild().name,
                        icon: musicManager.getGuild().iconURL()
                    });
                    socket.emit("tracks", this.getQueueInfo(musicManager));
                    if (data.userId && !musicManager.isVoiceConnected()) {
                        musicManager.joinByUserId(data.userId).catch(err => console.error(err));
                    }
                }
                catch (e) {
                    console.error(e);
                }
            });
            socket.on("refresh", (guildId) => {
                try {
                    socket.emit("tracks", this.getQueueInfo(this.bot.getGuildMusicManagerById(guildId)));
                }
                catch (e) {
                    console.error(e);
                }
            });
        });
    }
    onChange(trackScheduler) {
        this.io.in(trackScheduler.getMusicManager().getGuild().id.toString())
            .emit("tracks", this.getQueueInfo(trackScheduler.getMusicManager()));
    }
    getQueueInfo(musicManager) {
        return {
            currentTrack: musicManager.getCurrentTrack(),
            tracks: musicManager.getTracks(),
            previousTracks: musicManager.getPreviousTracks(),
            repeat: musicManager.getRepeat(),
            autoRadio: musicManager.getAutoRadio()
        };
    }
}
exports.WebSocket = WebSocket;
//# sourceMappingURL=WebSocket.js.map