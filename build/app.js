"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const configuration_1 = require("./config/configuration");
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
if (configuration_1.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
app.get("/", (_req, _res) => {
    console.log("first");
});
exports.default = app;
