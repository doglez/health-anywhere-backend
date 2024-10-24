import colors from "colors";
import { openDBConnection, sequelize } from "./database.connection";
import User from "../models/user.model";
import FakeData from "./FakeData";

colors.enable();

/**
 * Imports fake data into the database.
 *
 * @remarks
 * This function:
 * - Opens a database connection.
 * - Syncs the database schema, forcing it to recreate tables.
 * - Bulk inserts fake data.
 * - Closes the database connection after the operation.
 *
 * If the process is successful, it logs the result and exits the process.
 * If there is an error, it logs the error and exits the process.
 */
const importData = async () => {
    try {
        await openDBConnection();

        await sequelize
            .sync({ force: true })
            .then(() => console.log("Test sync complete".black.bgGreen));

        await User.bulkCreate(FakeData.users);

        await sequelize.close();

        console.log(`Imported data`.green.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit();
    }
};

/**
 * Deletes all data from the database.
 *
 * @remarks
 * This function:
 * - Drops all tables from the database, cascading deletions.
 * - Closes the database connection after the operation.
 *
 * If the process is successful, it logs the result and exits the process.
 * If there is an error, it logs the error and exits the process.
 */
const deleteData = async () => {
    try {
        await sequelize.drop({ cascade: true });

        await sequelize.close();

        console.log(`Deleted data`.green.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit();
    }
};

/**
 * Command-line argument logic to determine whether to import or delete data.
 *
 * @remarks
 * - If `-i` is passed as an argument, it triggers the import process.
 * - If `-d` is passed as an argument, it triggers the deletion process.
 */
if (process.argv[2] === "-i") {
    importData();
} else if (process.argv[2] === "-d") {
    deleteData();
}
