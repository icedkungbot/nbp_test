"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const Bot_1 = require("./Bot");
const WebRouter_1 = require("./WebRouter");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
if (process.env.NODE_ENV !== "production") {
    // tslint:disable-next-line:no-var-requires
    require("dotenv").config();
    // tslint:disable-next-line:no-var-requires
    app.use(require("cors")());
}
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/", new WebRouter_1.WebRouter().setup());
app.use(express_1.default.static(path_1.default.join(__dirname, "/public/")));
app.use(express_1.default.static(path_1.default.join(__dirname, "/client/")));
app.use((req, res) => {
    res.sendFile(path_1.default.join(__dirname + "/client/index.html"));
});
Bot_1.Bot.start();
module.exports = app;
//# sourceMappingURL=app.js.map