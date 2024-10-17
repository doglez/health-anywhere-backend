import {
    IsDateString,
    IsEmail,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Length,
    Matches,
} from "class-validator";
import { UserCreationAttributes } from "../user.model";

/**
 * Data Transfer Object (DTO) for creating a user.
 * This DTO is used to validate the input data when creating a new user.
 *
 * It includes mandatory fields like `name`, `birthday`, `avatarURL`, `email`, and `phone`,
 * and optional fields such as `password`, `googleId`, and `facebookId`.
 */
class CreateUserDto
    implements
        Pick<
            UserCreationAttributes,
            | "name"
            | "birthday"
            | "avatarURL"
            | "email"
            | "phone"
            | "password"
            | "googleId"
            | "facebookId"
        >
{
    @IsString({
        message: "Name must be a string",
    })
    @Length(3, 255, {
        message: "Name must be between 3 and 255 characters",
    })
    name!: string;

    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Birthday must be in the format YYYY-MM-DD",
    })
    @IsDateString()
    birthday!: Date;

    @IsUrl({}, { message: "Avatar URL must be a valid URL" })
    avatarURL!: string;

    @IsEmail({}, { message: "Email must be a valid email address" })
    email!: string;

    @IsNumber({}, { message: "Phone number must be a valid number" })
    phone!: number;

    @IsOptional()
    @IsString({ message: "Password must be a string" })
    password?: string;

    @IsOptional()
    @IsString({ message: "Google ID must be a string" })
    googleId?: string;

    @IsOptional()
    @IsString({ message: "Facebook ID must be a string" })
    facebookId?: string;
}

export default CreateUserDto;
