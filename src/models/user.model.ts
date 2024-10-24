import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import ErrorResponse from "../utils/errorResponse";
import httpStatus from "http-status";
import { sequelize } from "../database/database.connection";
import { Role } from "../roles";

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
 * Sequelize model representing the User entity.
 *
 * @remarks
 * This model defines the schema, validations, and behaviors for User objects stored
 * in the database. It includes custom setters for name and email validation.
 */
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: number;
    declare name: string;
    declare birthday: Date;
    declare avatarURL: CreationOptional<string>;
    declare email: string;
    declare phone: CreationOptional<number>;
    declare password: CreationOptional<string>;
    declare googleId: CreationOptional<string>;
    declare facebookId: CreationOptional<string>;
    declare resetPasswordToken: CreationOptional<string>;
    declare resetPasswordExpire: CreationOptional<Date>;
    declare role: CreationOptional<string>;
    declare status: CreationOptional<UserStatus>;
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
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [Object.keys(Role)],
            },
            defaultValue: Role.PATIENT.name,
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
