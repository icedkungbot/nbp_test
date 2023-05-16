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
exports.Panel = void 0;
const discord_js_1 = require("discord.js");
class Panel {
    start(channel) {
        this.message = channel.send(this.buildMessage());
        this.message.then((message) => __awaiter(this, void 0, void 0, function* () {
            this.collector = message.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.Button });
            this.collector.on("collect", (interaction) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield interaction.deferUpdate();
                    yield this.handleButtonInteraction(interaction.customId, interaction);
                }
                catch (err) {
                    console.error(err);
                }
            }));
            this.collector.on("end", collected => {
                console.log("Panel collector closed.");
            });
        }));
        this.startInternal();
    }
    destroy() {
        var _a, _b;
        this.destroyInternal();
        (_a = this.collector) === null || _a === void 0 ? void 0 : _a.stop();
        (_b = this.message) === null || _b === void 0 ? void 0 : _b.then(message => message.delete()).catch(e => console.error(e));
    }
    update() {
        try {
            const content = this.buildMessage();
            this.message = this.message.then(message => message.edit(content));
        }
        catch (e) {
            console.error(e);
        }
    }
}
exports.Panel = Panel;
//# sourceMappingURL=Panel.js.map