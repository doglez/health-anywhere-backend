import {
    IsDateString,
    IsEmail,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Length,
    Matches,
} from "class-validator";
import { UserStatus } from "../user.model";

/**
 * Data Transfer Object (DTO) for updating  a user.
 * This DTO is used to validate the input data when update a new user.
 *
 * All the fields are optional `name`, `birthday`, `avatarURL`, `email`, `phone`,
 * `password`, `googleId`, and `facebookId`.
 */
export class UpdateUserDto {
    @IsOptional()
    @IsString({
        message: "Name must be a string",
    })
    @Length(3, 255, {
        message: "Name must be between 3 and 255 characters",
    })
    name?: string;

    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Birthday must be in the format YYYY-MM-DD",
    })
    @IsDateString()
    birthday?: Date;

    @IsOptional()
    @IsUrl({}, { message: "Avatar URL must be a valid URL" })
    avatarURL?: string;

    @IsOptional()
    @IsEmail({}, { message: "Email must be a valid email address" })
    email?: string;

    @IsOptional()
    @IsNumber({}, { message: "Phone number must be a valid number" })
    phone?: number;

    @IsOptional()
    @IsString({ message: "Password must be a string" })
    password?: string;

    @IsOptional()
    @IsString({ message: "Google ID must be a string" })
    googleId?: string;

    @IsOptional()
    @IsString({ message: "Facebook ID must be a string" })
    facebookId?: string;

    @IsOptional()
    @IsString({ message: "Reset Password Token must be a string" })
    resetPasswordToken?: string;

    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Reset Password Expire must be in the format YYYY-MM-DD",
    })
    @IsDateString()
    resetPasswordExpire?: Date;

    @IsOptional()
    @IsEnum(UserStatus, {
        message: "Status must be either ACTIVE or INACTIVE",
    })
    status?: UserStatus;
}

export default UpdateUserDto;
