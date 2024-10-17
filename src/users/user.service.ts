import User, { UserStatus } from "./user.model";
import UpdateUserDto from "./dto/update-user.dto";
import ErrorResponse from "../util/errorResponse";
import httpStatus from "http-status";
import { serviceAsyncHandler } from "../middleware/asyncHandler";
import { validateDto } from "../util/validation";

/**
 * Service class responsible for managing user-related operations, such as validation,
 * retrieval, updating, and deletion of users. This class interacts with the user model
 * and handles the business logic for user-related activities.
 *
 * @remarks
 * This class relies on validation via DTOs (Data Transfer Objects) and leverages
 * the `class-validator` package for enforcing data integrity before performing operations.
 */
class UserService {
    /**
     * Retrieves all users from the database.
     *
     * @returns A promise that resolves with the list of all users.
     */
    getAll = serviceAsyncHandler(async () => {
        const users = await User.findAll();

        return users;
    });

    /**
     * Finds a user by their ID and validates the provided user data.
     * If the user does not exist, it returns an error response.
     *
     * @param id - The ID of the user to find.
     * @param userData - The data to validate.
     * @returns A promise that resolves with the user if found, or an error response if the user does not exist.
     */
    findById = serviceAsyncHandler(
        async (id: number, userData: UpdateUserDto) => {
            validateDto(userData);

            const user = await User.findByPk(id);

            if (!user) {
                return new ErrorResponse(
                    `User with id: ${id} not exist`,
                    httpStatus["404_NAME"],
                    httpStatus.NOT_FOUND
                );
            }

            return user;
        }
    );

    /**
     * Finds a user by their email address.
     * If the user does not exist, it returns an error response.
     *
     * @param email - The email of the user to find.
     * @returns A promise that resolves with the user if found, or an error response if the user does not exist.
     */
    findByEmail = serviceAsyncHandler(async (email: string) => {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return new ErrorResponse(
                `User with email: ${email} not exist`,
                httpStatus["404_NAME"],
                httpStatus.NOT_FOUND
            );
        }

        return user;
    });

    /**
     * Updates a user by their ID with the provided update data.
     * First, the update data is validated, and then the user is updated.
     * If the user does not exist, it returns an error response.
     *
     * @param id - The ID of the user to update.
     * @param updateData - The data to update the user with.
     * @returns A promise that resolves with the updated user, or an error response if the user does not exist.
     */
    update = serviceAsyncHandler(
        async (id: number, updateData: UpdateUserDto) => {
            validateDto(updateData);

            const user = await User.findByPk(id);

            if (!user) {
                return new ErrorResponse(
                    `User with id: ${id} not exist`,
                    httpStatus["404_NAME"],
                    httpStatus.NOT_FOUND
                );
            }

            await user.update(updateData);
            await user.reload();

            return user;
        }
    );

    /**
     * Marks a user as inactive by their ID. This simulates a deletion by changing the user's
     * status to INACTIVE. If the user does not exist, it returns an error response.
     *
     * @param id - The ID of the user to delete (mark as inactive).
     * @returns A promise that resolves with a success message if the user is found and marked as inactive, or an error response if the user does not exist.
     */
    softDelete = serviceAsyncHandler(async (id: number) => {
        const user = await User.findByPk(id);

        if (!user) {
            return new ErrorResponse(
                `User with id: ${id} not exist`,
                httpStatus["404_NAME"],
                httpStatus.NOT_FOUND
            );
        }

        user.status = UserStatus.INACTIVE;
        await user.save();
        await user.reload();

        return `User with email: ${user.email} was deleted`;
    });
}

export default new UserService();
