import express from "express";
import userController from "./user.controller";

const UserRouter = express.Router();

UserRouter.get("/", userController.getAll);

export default UserRouter;
