/**
 * Custom error class for handling API errors.
 *
 * @extends Error
 * @remarks
 * This class extends the native JavaScript `Error` class to include additional
 * properties: `title` (an HTTP status description") and
 * `status` (the corresponding HTTP status code). It is used to provide consistent
 * error responses throughout the application.
 */
class ErrorResponse extends Error {
    /**
     * A string representing the HTTP status description (e.g., "BAD REQUEST").
     */
    title: string;

    /**
     * The HTTP status code associated with the error (e.g., 400).
     */
    status: number;

    /**
     * Constructs a new `ErrorResponse` instance.
     *
     * @param message - The detailed error message.
     * @param title - A short description of the HTTP status (e.g., "BAD REQUEST").
     * @param status - The HTTP status code (e.g., 400).
     */
    constructor(message: string, title: string, status: number) {
        super(message);
        this.title = title;
        this.status = status;
    }
}

export default ErrorResponse;
