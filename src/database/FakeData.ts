import fs from "fs";

/**
 * An object containing fake data for testing purposes.
 * It loads user data from a local JSON file.
 *
 * @remarks
 * The data is loaded from a file located at `src/__data__/*.json`.
 * This is typically used in test environments to simulate a dataset without relying on a live database.
 */
const FakeData = {
    users: JSON.parse(
        fs.readFileSync(`${process.cwd()}/src/__data__/users.json`, "utf-8")
    ),
};

export default FakeData;
