import { DataTypes, Model, Optional } from "sequelize";
import ErrorResponse from "../util/errorResponse";
import httpStatus from "http-status";
import { sequelize } from "../database/database.connection";

/**
 * Enum representing the possible statuses for a user.
 *
 * @enum {string}
 * @property INACTIVE - The user is inactive and cannot access the system.
 * @property ACTIVE - The user is active and can access the system.
 */
export enum UserStatus {
    INACTIVE = "inactive",
    ACTIVE = "active",
}

/**
 * Type representing the attributes of a User.
 *
 * @property id - Unique identifier for the user.
 * @property name - Full name of the user.
 * @property birthday - The user's date of birth.
 * @property avatarURL - URL of the user's avatar.
 * @property email - Email address of the user (must be unique).
 * @property phone - Phone number of the user (must be unique).
 * @property password - User's hashed password.
 * @property googleId - Google account ID associated with the user.
 * @property facebookId - Facebook account ID associated with the user.
 * @property resetPasswordToken - Token for password reset operations.
 * @property resetPasswordExpire - Expiration date for the password reset token.
 * @property status - Current status of the user, either ACTIVE or INACTIVE.
 */
export type UserAttributes = {
    id: number;
    name: string;
    birthday: Date;
    avatarURL: string;
    email: string;
    phone: number;
    password: string;
    googleId: string;
    facebookId: string;
    resetPasswordToken: string;
    resetPasswordExpire: Date;
    status: UserStatus;
};

/**
 * Type representing optional attributes for user creation.
 * These attributes are not required when creating a new user.
 */
export type UserCreationAttributes = Optional<
    UserAttributes,
    | "id"
    | "password"
    | "googleId"
    | "facebookId"
    | "resetPasswordToken"
    | "resetPasswordExpire"
    | "status"
>;

/**
 * Sequelize model representing the User entity.
 *
 * @remarks
 * This model defines the schema, validations, and behaviors for User objects stored
 * in the database. It includes custom setters for name and email validation.
 */
class User extends Model<UserAttributes, UserCreationAttributes> {
    declare id: number;
    declare name: string;
    declare birthday: Date;
    declare avatarURL: string;
    declare email: string;
    declare phone: number | null;
    declare password: string;
    declare googleId: string;
    declare facebookId: string;
    declare resetPasswordToken: string | null;
    declare resetPasswordExpire: Date | null;
    declare status: UserStatus;
}

// Initialize the User model with attributes and options
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            set(val: string) {
                if (/\d/.test(val)) {
                    throw new ErrorResponse(
                        `name_string_validation`,
                        httpStatus["400_NAME"],
                        httpStatus.BAD_REQUEST
                    );
                }

                const splitText = val.toLowerCase().split(" ");
                for (let i = 0; i < splitText.length; i++) {
                    splitText[i] =
                        splitText[i].charAt(0).toUpperCase() +
                        splitText[i].substring(1);
                }

                this.setDataValue("name", splitText.join(" "));
            },
        },
        birthday: {
            type: DataTypes.DATEONLY,
        },
        avatarURL: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        phone: {
            type: DataTypes.BIGINT,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
        },
        googleId: {
            type: DataTypes.STRING,
        },
        facebookId: {
            type: DataTypes.STRING,
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
        },
        resetPasswordExpire: {
            type: DataTypes.DATE,
        },
        status: {
            type: DataTypes.ENUM(UserStatus.ACTIVE, UserStatus.INACTIVE),
            defaultValue: UserStatus.ACTIVE,
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",
        defaultScope: {
            attributes: {
                exclude: [
                    "password",
                    "googleId",
                    "facebookId",
                    "resetPasswordToken",
                    "resetPasswordExpire",
                    "createdAt",
                    "updatedAt",
                ],
            },
        },
    }
);

export default User;
