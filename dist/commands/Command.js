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
exports.CommandManager = void 0;
const discord_js_1 = require("discord.js");
const Commands_1 = require("./Commands");
const PlayCommands_1 = require("./PlayCommands");
const MusicControlCommands_1 = require("./MusicControlCommands");
const PlayListControlCommands_1 = require("./PlayListControlCommands");
class CommandManager {
    constructor(token) {
        this.token = token;
        this.commands = new Map();
        for (const command of CommandManager.COMMANDS) {
            this.commands.set(command.data.name, command);
        }
    }
    execute(interaction, bot) {
        return this.getCommand(interaction.commandName).execute(interaction, bot);
    }
    getCommand(command) {
        if (this.commands.has(command)) {
            return this.commands.get(command);
        }
        else {
            throw new Error("Unknown command.");
        }
    }
    registerCommands(guildId, botUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Registering commands for guild ${guildId}.`);
            const rest = new discord_js_1.REST({ version: '10' }).setToken(this.token);
            try {
                const data = yield rest.put(discord_js_1.Routes.applicationGuildCommands(botUserId, guildId), { body: CommandManager.COMMANDS.map(command => command.data.toJSON()) });
                console.log(`Successfully registered ${data.length} commands.`);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.CommandManager = CommandManager;
CommandManager.COMMANDS = [...Commands_1.COMMANDS, ...PlayCommands_1.PLAY_COMMANDS, ...MusicControlCommands_1.MUSIC_CONTROL_COMMANDS, ...PlayListControlCommands_1.PLAYLIST_CONTROL_COMMANDS];
//# sourceMappingURL=Command.js.map