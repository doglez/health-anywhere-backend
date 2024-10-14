import { Sequelize } from "sequelize";
import {
    DB_DATABASE,
    DB_DRIVER,
    DB_HOST,
    DB_PASSWORD,
    DB_PORT,
    DB_TIMEZONE,
    DB_USERNAME,
    NODE_ENV,
} from "../config/configuration";

export const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
    dialect: DB_DRIVER,
    host: DB_HOST,
    port: DB_PORT,
    timezone: DB_TIMEZONE,
    logging:
        NODE_ENV === "development" ? (...msg) => console.log(msg[0]) : false,
    dialectOptions: {
        ssl:
            NODE_ENV === "production"
                ? { require: true, rejectUnauthorized: false }
                : false,
    },
});

export const openDBConnection = async () => {
    let retries = 10;

    while (retries) {
        try {
            await sequelize.authenticate();
            console.log("🛢️ Sequelize has been initialized!".green);
            break;
        } catch (error) {
            console.error(`Error during Data Source initialization ${error}`);
            retries -= 1;
            await new Promise((res) => setTimeout(res, 5000));
        }
    }
};

export const dropAndCloseDBConnection = async () => {
    await sequelize
        .drop({ cascade: true })
        .then(() => console.log("Test tables dropped".black.bgYellow));

    await sequelize
        .close()
        .then(() => console.log("📕 Sequelize closed connection!".red));
};
