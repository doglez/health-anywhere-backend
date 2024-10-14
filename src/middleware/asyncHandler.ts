import { NextFunction, Request, Response } from "express";

/**
 * A higher-order function that wraps asynchronous route handlers to catch any errors.
 * This allows you to avoid using `try-catch` blocks in each asynchronous handler.
 *
 * @param fn - The asynchronous function (route handler) to be wrapped.
 * @returns A function that executes the asynchronous function and passes any errors to the next middleware.
 *
 * @example
 * // Usage with Controller:
 * router.get('/example', asyncHandler(async (req, res, next) => {
 *     const data = await someAsyncFunction();
 *     res.json(data);
 * }));
 */
const asyncHandler =
    (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
