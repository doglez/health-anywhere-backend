import express from "express";
import { NODE_ENV } from "./config/configuration";
import morgan from "morgan";

const app = express();

if (NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.get("/api/v1", (_req, _res) => {
    console.log("first");
});

export default app;
