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

/**
 * Initializes a new Sequelize instance to connect to the database.
 *
 * @remarks
 * This instance uses environment variables for database configuration such as
 * database name, username, password, host, port, and timezone. The logging
 * option is enabled only in development mode.
 *
 * - If in production mode, SSL is required for the connection, with SSL
 *   certificate validation disabled.
 * - In development mode, logging is enabled to display SQL queries in the console.
 *
 * @constant
 */
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

/**
 * Opens a connection to the database and retries in case of failure.
 *
 * @remarks
 * This function attempts to authenticate the Sequelize connection to the database.
 * If the connection fails, it retries up to 10 times, waiting 5 seconds between retries.
 *
 * @throws Will throw an error if the connection fails after 10 retries.
 *
 * @returns A promise that resolves when the connection is successfully established.
 */
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

/**
 * Drops all tables and closes the database connection.
 *
 * @remarks
 * This function drops all tables in the database (in cascade mode) and then
 * closes the Sequelize connection.
 *
 * @returns A promise that resolves when the connection is closed and tables are dropped.
 */
export const dropAndCloseDBConnection = async () => {
    await sequelize
        .drop({ cascade: true })
        .then(() => console.log("Test tables dropped".black.bgYellow));

    await sequelize
        .close()
        .then(() => console.log("📕 Sequelize closed connection!".red));
};
