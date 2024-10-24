import Permission from "./permission.constants";

const Role = {
    SUPER_ADMIN: {
        name: "SUPER_ADMIN",
        permissions: [
            Permission.READ_USER,
            Permission.UPDATE_USER,
            Permission.DELETE_USER,
        ],
    },
    ADMIN: {
        name: "ADMIN",
        permissions: [Permission.READ_USER, Permission.UPDATE_USER],
    },
    PATIENT: {
        name: "PATIENT",
        permissions: [
            Permission.READ_USER,
            Permission.UPDATE_USER,
            Permission.DELETE_USER,
        ],
    },
};

export default Role;
