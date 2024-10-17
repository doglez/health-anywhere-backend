import { NextFunction, Request, Response } from "express";
import UserService from "./user.service";
import httpStatus from "http-status";
import { controllerAsyncHandler } from "../middleware/asyncHandler";
("../middleware/asyncHandler");

class UserController {
    getAll = controllerAsyncHandler(
        async (_req: Request, res: Response, _next: NextFunction) => {
            const users = await UserService.getAll();

            return res.status(httpStatus.OK).json({
                page: 1,
                per_page: 10,
                total: 10,
                total_pages: 1,
                users,
            });
        }
    );
}

export default new UserController();
