import express from "express";
import userController from "./user.controller";

const UserRouter = express.Router();

UserRouter.get("/", userController.getAll);
UserRouter.get("/email/:email", userController.findByEmail);
UserRouter.put("/:id", userController.update);
UserRouter.delete("/:id", userController.softDelete);

export default UserRouter;
