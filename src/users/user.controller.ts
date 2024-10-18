import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { controllerAsyncHandler } from "../middleware/asyncHandler";
import User, { UserStatus } from "./user.model";
import ErrorResponse from "../util/errorResponse";
import { validateDto } from "../util/validation";
import UpdateUserDto from "./dto/update-user.dto";
("../middleware/asyncHandler");

class UserController {
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
