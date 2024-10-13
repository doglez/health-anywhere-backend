"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORS_ADMIT_URL = exports.VERSION_APP = exports.HOST_PORT = exports.HOST_URL = exports.NODE_ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
exports.NODE_ENV = process.env.NODE_ENV;
const envFile = dotenv_1.default.config({
    path: path_1.default.join(__dirname, `../../.env.${exports.NODE_ENV}`),
});
if (envFile.error) {
    throw envFile.error;
}
// Variables for host info
exports.HOST_URL = process.env.HOST_URL;
exports.HOST_PORT = parseInt(process.env.HOST_PORT ?? "5000", 10);
exports.VERSION_APP = parseInt(process.env.VERSION_APP ?? "1", 10);
// URL CORS Admit
exports.CORS_ADMIT_URL = JSON.parse(process.env.CORS_ADMIT_URL ?? "[]");
