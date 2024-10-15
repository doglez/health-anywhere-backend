import { DataTypes, Model, Optional } from "sequelize";
import ErrorResponse from "../util/errorResponse";
import httpStatus from "http-status";
import { sequelize } from "../database/database.connection";

/**
 * Enum for user status.
 * Represents the state of a user in the system.
 *
 * - INACTIVE: The user is inactive and cannot access the system.
 * - ACTIVE: The user is active and can access the system.
 */
export enum UserStatus {
    INACTIVE = "inactive",
    ACTIVE = "active",
}

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
            set(val: string) {
                if (/\d/.test(val)) {
                    throw new ErrorResponse(
                        `email_format_validation`,
                        httpStatus["400_NAME"],
                        httpStatus.BAD_REQUEST
                    );
                }

                this.setDataValue("email", val.toLowerCase());
            },
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
