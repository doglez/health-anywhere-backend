import express from "express";
import UserRoutes from "./user.routes";

const router = express.Router();

router.use("/users", UserRoutes);

export default router;
