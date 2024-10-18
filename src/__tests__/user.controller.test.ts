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

describe("UserController", () => {
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

    describe("getAll", () => {
        it("should get all users", async () => {
            const response = await request(app).get("/api/v1/users");
            expect(response.status).toBe(200);
            expect(response.body.users.length).toBeGreaterThan(0);
            expect(response.body.users[0].name).toBe("Super Admin");
        });
    });

    describe("findByEmail", () => {
        it("should find a user by email", async () => {
            const email = FakeData.users[0].email;
            const response = await request(app).get(
                `/api/v1/users/email/${email}`
            );

            expect(response.status).toBe(200);
            expect(response.body.email).toBe(email);
        });

        it("should return 404 when a user by email is not found", async () => {
            const response = await request(app).get(
                "/api/v1/users/email/nonexistent@example.com"
            );

            expect(response.status).toBe(404);
            expect(response.body.error.title).toBe("NOT_FOUND");
            expect(response.body.error.details).toBe(
                "User with email: nonexistent@example.com not exist"
            );
        });
    });

    describe("update", () => {
        it("should succeed update with valid data", async () => {
            const userId = 1;

            const validData = {
                name: "Valid Name",
                email: "valid@example.com",
                avatarURL: "https://example.com/avatar.jpg",
                birthday: "2000-12-31",
                status: "active",
            };

            const response = await request(app)
                .put(`/api/v1/users/${userId}`)
                .send(validData);

            expect(response.status).toBe(200);
            expect(response.body.name).toBe("Valid Name");
            expect(response.body.email).toBe("valid@example.com");
            expect(response.body.status).toBe("active");
        });

        it("should return 404 when trying to update a user that doesn't exist", async () => {
            const response = await request(app)
                .put("/api/v1/users/999999")
                .send({ name: "Nonexistent User" });

            expect(response.status).toBe(404);
            expect(response.body.error.title).toBe("NOT_FOUND");
            expect(response.body.error.details).toBe(
                "User with id: 999999 not exist"
            );
        });

        it("should return 400 when the name is too short", async () => {
            const userId = 1;

            const invalidData = {
                name: "A",
            };

            const response = await request(app)
                .put(`/api/v1/users/${userId}`)
                .send(invalidData);

            expect(response.status).toBe(400);
            expect(response.body.error.title).toBe("BAD_REQUEST");
            expect(response.body.error.details).toBe(
                "Name must be between 3 and 255 characters"
            );
        });

        it("should fail if birthday is in the wrong format", async () => {
            const userId = 1;

            const invalidData = {
                birthday: "31-12-2000", // Wrong format, should be YYYY-MM-DD
            };

            const response = await request(app)
                .put(`/api/v1/users/${userId}`)
                .send(invalidData);

            expect(response.status).toBe(400);
            expect(response.body.error.title).toBe("BAD_REQUEST");
            expect(response.body.error.details).toBe(
                "birthday must be a valid ISO 8601 date string, Birthday must be in the format YYYY-MM-DD"
            );
        });

        it("should fail if avatarURL is not a valid URL", async () => {
            const userId = 1;

            const invalidData = {
                avatarURL: "invalid-url",
            };

            const response = await request(app)
                .put(`/api/v1/users/${userId}`)
                .send(invalidData);

            expect(response.status).toBe(400);
            expect(response.body.error.title).toBe("BAD_REQUEST");
            expect(response.body.error.details).toBe(
                "Avatar URL must be a valid URL"
            );
        });

        it("should fail if email is not valid", async () => {
            const userId = 1;

            const invalidData = {
                email: "not-an-email",
            };

            const response = await request(app)
                .put(`/api/v1/users/${userId}`)
                .send(invalidData);

            expect(response.status).toBe(400);
            expect(response.body.error.title).toBe("BAD_REQUEST");
            expect(response.body.error.details).toBe(
                "Email must be a valid email address"
            );
        });

        it("should fail if status is not ACTIVE or INACTIVE", async () => {
            const userId = 1;

            const invalidData = {
                status: "UNKNOWN", // Must be either ACTIVE or INACTIVE
            };

            const response = await request(app)
                .put(`/api/v1/users/${userId}`)
                .send(invalidData);

            expect(response.status).toBe(400);
            expect(response.body.error.title).toBe("BAD_REQUEST");
            expect(response.body.error.details).toBe(
                "Status must be either ACTIVE or INACTIVE"
            );
        });
    });

    describe("softDelete", () => {
        it("should soft delete a user", async () => {
            const userId = 1;

            const response = await request(app).delete(
                `/api/v1/users/${userId}`
            );

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("User with id: 1 was deleted");
        });

        it("should return 404 when trying to soft delete a non-existing user", async () => {
            const response = await request(app).delete("/api/v1/users/999999");

            expect(response.status).toBe(404);
            expect(response.body.error.title).toBe("NOT_FOUND");
            expect(response.body.error.details).toBe(
                "User with id: 999999 not exist"
            );
        });
    });
});
