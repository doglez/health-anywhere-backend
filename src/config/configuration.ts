import dotenv from "dotenv";
import path from "path";

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
export const VERSION_APP = parseInt(process.env.VERSION_APP ?? "1", 10);

// URL CORS Admit
export const CORS_ADMIT_URL = JSON.parse(
    process.env.CORS_ADMIT_URL ?? "[]"
) as string[];
