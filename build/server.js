"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const configuration_1 = require("./config/configuration");
const colors_1 = __importDefault(require("colors"));
(async function () {
    colors_1.default.enable();
    const server = app_1.default.listen(configuration_1.HOST_PORT, () => console.log("🚀 Server ready at", `${configuration_1.HOST_URL}/api/${configuration_1.VERSION_APP}`.yellow.bold));
    process.on("unhandledRejection", (reason) => {
        console.log(`Error: ${reason}`.bgRed);
        server.close(() => process.exit(1));
    });
})();
