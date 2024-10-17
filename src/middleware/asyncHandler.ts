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
export const controllerAsyncHandler =
    (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Higher-order function to wrap async service methods and catch errors.
 * Any errors are thrown to be handled by the controller or middleware.
 *
 * @param fn - The async service function to wrap.
 * @returns A new function that ensures errors are caught and propagated.
 */
export const serviceAsyncHandler = <T, Args extends any[]>(
    fn: (...args: Args) => Promise<T>
): ((...args: Args) => Promise<T>) => {
    return async (...args: Args): Promise<T> => {
        try {
            return await fn(...args);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Service Error: ${error.message}`);
                throw error;
            } else {
                console.error("An unknown error occurred.");
                throw new Error("An unknown error occurred.");
            }
        }
    };
};
