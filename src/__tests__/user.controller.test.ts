import request from "supertest";
import {
    dropAndCloseDBConnection,
    openDBConnection,
    sequelize,
} from "../database/database.connection";
import User from "../users/user.model";
import FakeData from "../database/FakeData";
import app from "../app";
import colors from "colors";

colors.enable();

describe("User Controller", () => {
    beforeAll(async () => {
        await openDBConnection();
        await sequelize
            .sync({ force: true })
            .then(() => console.log("Test sync complete".black.bgGreen));
        await User.bulkCreate(FakeData.users);
    });

    afterAll(async () => {
        await dropAndCloseDBConnection();
    });

    it("should get all users", async () => {
        const response = await request(app).get("/api/v1/users");
        expect(response.status).toBe(200);
        expect(response.body.users[0].name).toBe("Super Admin");
    });
});
