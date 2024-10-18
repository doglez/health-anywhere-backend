import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { controllerAsyncHandler } from "../middleware/asyncHandler";
import User, { UserStatus } from "./user.model";
import ErrorResponse from "../util/errorResponse";
import { validateDto } from "../util/validation";
import UpdateUserDto from "./dto/update-user.dto";
("../middleware/asyncHandler");

/**
 * Controller class responsible for handling user-related HTTP requests.
 *
 * @remarks
 * This class provides methods to retrieve, update, and soft delete users.
 * It uses `controllerAsyncHandler` to handle asynchronous operations and error propagation.
 */
class UserController {
    /**
     * Retrieves a paginated list of all users.
     *
     * @returns A JSON response containing a list of users with pagination information.
     */
    getAll = controllerAsyncHandler(
        async (_req: Request, res: Response, _next: NextFunction) => {
            const users = await User.findAll();

            return res.status(httpStatus.OK).json({
                page: 1,
                per_page: 10,
                total: 10,
                total_pages: 1,
                users,
            });
        }
    );

    /**
     * Finds a user by their email address.
     *
     * @param req - The HTTP request containing the user's email in the URL parameters.
     * @param res - The HTTP response used to send the user data.
     * @param next - The next middleware function to handle errors.
     * @returns A JSON response with the user data if found, or an error response if not.
     */
    findByEmail = controllerAsyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const email = req.params.email;

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return next(
                    new ErrorResponse(
                        `User with email: ${email} not exist`,
                        httpStatus["404_NAME"],
                        httpStatus.NOT_FOUND
                    )
                );
            }

            return res.status(200).json(user);
        }
    );

    /**
     * Updates a user's data by their ID.
     *
     * @param req - The HTTP request containing the user's ID in the URL parameters and update data in the body.
     * @param res - The HTTP response used to send the updated user data.
     * @param next - The next middleware function to handle errors.
     * @returns A JSON response with the updated user data if successful, or an error response if not found.
     */
    update = controllerAsyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const id = req.params.id;

            const user = await User.findByPk(id);

            if (!user) {
                return next(
                    new ErrorResponse(
                        `User with id: ${id} not exist`,
                        httpStatus["404_NAME"],
                        httpStatus.NOT_FOUND
                    )
                );
            }

            const updateDto = new UpdateUserDto();
            Object.assign(updateDto, req.body);

            await validateDto(updateDto);

            await user.update(req.body);
            await user.reload();

            return res.status(200).json(user);
        }
    );

    /**
     * Marks a user as inactive (soft delete) by their ID.
     * 
     * @param req - The HTTP request containing the user's ID in the URL parameters.
     * @param res - The HTTP response used to confirm the soft delete.
     * @param next - The next middleware function to handle errors.
     * @returns A JSON response confirming the soft deletion or an error response if the user is not found.
     */
    softDelete = controllerAsyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const id = req.params.id;

            const user = await User.findByPk(id);

            if (!user) {
                return next(
                    new ErrorResponse(
                        `User with id: ${id} not exist`,
                        httpStatus["404_NAME"],
                        httpStatus.NOT_FOUND
                    )
                );
            }

            await user.update({ status: UserStatus.INACTIVE });
            await user.reload();

            return res.status(200).json({
                message: `User with id: ${id} was deleted`,
            });
        }
    );
}

export default new UserController();
