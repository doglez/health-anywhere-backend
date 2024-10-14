/**
 * A custom error class that extends the built-in `Error` class to include additional properties such as `code` and `status`.
 *
 * @remarks
 * This class is used to create custom error responses with a specific error `code` and HTTP `status` code.
 * It can be utilized to throw more structured errors in applications, particularly when handling API errors.
 */
class ErrorResponse extends Error {
    /**
     * A custom error code for identifying the type of error.
     */
    code: string;

    /**
     * The HTTP status code associated with the error.
     */
    status: number;

    /**
     * Creates an instance of `ErrorResponse`.
     *
     * @param message - The error message.
     * @param code - A custom code to represent the error type.
     * @param status - The HTTP status code to be returned with the error.
     */
    constructor(message: string, code: string, status: number) {
        super(message);
        this.code = code;
        this.status = status;
    }
}

export default ErrorResponse;
