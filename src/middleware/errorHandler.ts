import httpStatus from "http-status";
import { NODE_ENV } from "../config/configuration";
import ErrorResponse from "../util/errorResponse";
import { NextFunction, Request, Response } from "express";

/**
 * Express error-handling middleware.
 *
 * @remarks
 * This middleware catches errors, formats them into a consistent response structure using
 * the `ErrorResponse` class, and sends them to the client. It supports different types
 * of errors, such as Sequelize database errors and JWT validation errors.
 *
 * @param err - The error object thrown in the request pipeline.
 * @param _req - The incoming HTTP request object (unused in this handler).
 * @param res - The HTTP response object used to send back the error.
 * @param _next - The next middleware function (unused in this handler).
 */
const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (NODE_ENV === "development") {
        console.error(err);
    }

    let error = new ErrorResponse(
        err.message,
        err.title || httpStatus["500_NAME"],
        err.status || httpStatus.INTERNAL_SERVER_ERROR
    );

    switch (err.name) {
        case "SequelizeDatabaseError":
        case "SequelizeValidationError":
        case "SequelizeUniqueConstraintError":
            error = new ErrorResponse(
                err.message,
                httpStatus["400_NAME"],
                httpStatus.BAD_REQUEST
            );
            break;

        case "JsonWebTokenError":
            error = new ErrorResponse(
                `${err.name}: ${err.message}`,
                httpStatus["401_NAME"],
                httpStatus.UNAUTHORIZED
            );
            break;

        case "UserInputError":
            error = new ErrorResponse(
                err.message,
                httpStatus["400_NAME"],
                err.extensions?.code || httpStatus.BAD_REQUEST
            );
            break;
    }

    res.status(error.status).json({
        title: error.title,
        status: error.status,
        details: error.message,
    });
};

export default errorHandler;
