class ErrorResponse extends Error {
    code: string;
    status: number;

    constructor(message: string, code: string, status: number) {
        super(message);
        this.code = code;
        this.status = status;
    }
}

export default ErrorResponse;
