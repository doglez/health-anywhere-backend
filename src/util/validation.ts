import { validate, ValidationError } from "class-validator";
import ErrorResponse from "./errorResponse";
import httpStatus from "http-status";

/**
 * Utility function to validate a DTO.
 * Throws an error if validation fails.
 *
 * @param dto - The DTO object to validate.
 */
export const validateDto = async (dto: any) => {
    const errors: ValidationError[] = await validate(dto);

    if (errors.length > 0) {
        const message = errors
            .map((error: ValidationError) =>
                Object.values(error.constraints || {}).join(", ")
            )
            .join("; ");

        throw new ErrorResponse(
            message,
            httpStatus["404_NAME"],
            httpStatus.BAD_REQUEST
        );
    }
};
