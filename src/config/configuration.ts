import dotenv from "dotenv";
import path from "path";
import { Dialect } from "sequelize";

export const NODE_ENV = process.env.NODE_ENV;

const envFile = dotenv.config({
    path: path.join(__dirname, `../../.env.${NODE_ENV}`),
});
if (envFile.error) {
    throw envFile.error;
}

// Variables for host info
export const HOST_URL = process.env.HOST_URL;
export const HOST_PORT = parseInt(process.env.HOST_PORT ?? "5000", 10);
export const VERSION_APP = process.env.VERSION_APP;

// URL CORS Admit
export const CORS_ADMIT_URL = JSON.parse(
    process.env.CORS_ADMIT_URL ?? "[]"
) as string[];

// Data base connection
export const DB_HOST = String(process.env.DB_HOST);
export const DB_PORT = parseInt(process.env.DB_PORT ?? "5432", 10);
export const DB_USERNAME = String(process.env.DB_USERNAME);
export const DB_PASSWORD = String(process.env.DB_PASSWORD);
export const DB_DATABASE = String(process.env.DB_DATABASE);
export const DB_DRIVER = process.env.DB_DRIVER as Dialect;
export const DB_TIMEZONE = String(process.env.DB_TIMEZONE);
