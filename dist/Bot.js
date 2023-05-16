"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Bot = void 0;
const discord_js_1 = require("discord.js");
const GuildMusicManager_1 = require("./music/GuildMusicManager");
const Command_1 = require("./commands/Command");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
class Bot {
    static getInstance() {
        if (!this.bot) {
            this.bot = new Bot(process.env.OWNER);
            const token = process.env.TOKEN;
            this.bot.start(token);
        }
        return this.bot;
    }
    static start() {
        this.getInstance();
    }
    constructor(ownerId) {
        this.ownerId = ownerId;
        this.musicManagers = new Map();
    }
    start(token) {
        this.client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMembers, discord_js_1.GatewayIntentBits.GuildVoiceStates, discord_js_1.GatewayIntentBits.GuildPresences, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.GuildMessageReactions, discord_js_1.GatewayIntentBits.MessageContent] });
        this.commandManger = new Command_1.CommandManager(token);
        this.client.login(token).then(() => {
            console.log("Logged in");
            this.listenToInteractions();
            this.listenToMessages();
            this.client.on(discord_js_1.Events.VoiceStateUpdate, (oldState, newState) => {
                try {
                    this.getGuildMusicManager(newState.guild).onUserChangeVoiceState(newState.member.id === this.client.user.id);
                }
                catch (err) {
                    console.error(err);
                }
            });
        }, (error) => console.error("Login failed: " + error));
        process.on("exit", () => {
            this.close();
        });
        process.on("SIGINT", () => {
            this.close();
            process.exit();
        });
        process.on("SIGHUP", () => {
            this.close();
            process.exit();
        });
        process.on("SIGTERM", () => {
            this.close();
            process.exit();
        });
    }
    listenToMessages() {
        this.client.on(discord_js_1.Events.MessageCreate, (message) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.handleMessage(message);
            }
            catch (err) {
                console.error(err);
                yield message.channel.send(err.message);
            }
        }));
    }
    handleMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.author.id === this.ownerId && message.content === "!RegisterCommands") {
                yield this.commandManger.registerCommands(message.guildId, this.client.user.id);
            }
        });
    }
    listenToInteractions() {
        this.client.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(this, void 0, void 0, function* () {
            console.log(`Discord interaction: \"${interaction.type}\" from user: ${interaction.user.id}`);
            try {
                if (interaction.isChatInputCommand()) {
                    yield interaction.deferReply({ ephemeral: true });
                    yield this.handleChatInputCommand(interaction);
                }
            }
            catch (err) {
                console.error(err);
                yield this.sendInteractionResponse(interaction, err.message);
            }
        }));
    }
    sendInteractionResponse(interaction, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.isRepliable()) {
                yield interaction.editReply(response);
            }
            else {
                interaction.channel.send(response);
            }
        });
    }
    handleChatInputCommand(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = this.commandManger.execute(interaction, this);
            if (response instanceof Promise) {
                response = yield response;
            }
            if (typeof response === "string") {
                yield interaction.editReply(response);
            }
            else {
                yield interaction.editReply("Done.");
            }
        });
    }
    getGuildMusicManager(guild) {
        if (this.musicManagers.has(guild.id)) {
            return this.musicManagers.get(guild.id);
        }
        const musicManager = new GuildMusicManager_1.GuildMusicManager(guild);
        this.musicManagers.set(guild.id, musicManager);
        return musicManager;
    }
    getGuildMusicManagerById(guildId) {
        const guild = this.client.guilds.resolve(guildId);
        if (guild) {
            return this.getGuildMusicManager(guild);
        }
        else {
            throw new Error(`Guild with id: '${guildId}' not available.`);
        }
    }
    getGuildMusicManagerByIdIfExists(guildId) {
        if (this.musicManagers.has(guildId)) {
            return this.musicManagers.get(guildId);
        }
        else {
            throw new Error(`Guild with id: '${guildId}' not available.`);
        }
    }
    getGuilds() {
        return this.client.guilds.cache.map((guild) => {
            return {
                id: guild.id,
                name: guild.name,
                icon: guild.iconURL()
            };
        });
    }
    close() {
        this.closeMusicManagers();
        this.client.destroy();
    }
    closeMusicManagers() {
        for (const musicManager of this.musicManagers.values()) {
            musicManager.close();
        }
    }
}
exports.Bot = Bot;
//# sourceMappingURL=Bot.js.map