import express, { json } from "express";
import { CORS_ADMIT_URL, NODE_ENV } from "./config/configuration";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";
import router from "./router";
import errorHandler from "./middleware/errorHandler";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger/swaggerSpec";

const app = express();

/**
 * Applies middleware for logging HTTP requests in development mode.
 *
 * @remarks
 * This middleware is only applied if the `NODE_ENV` environment variable is set to `"development"`.
 * It uses `morgan` to log requests with detailed information about each HTTP request in the console.
 */
if (NODE_ENV === "development") {
    app.use(morgan("dev"));
}

/**
 * Parses incoming JSON requests and makes the JSON data available in `req.body`.
 */
app.use(json());

/**
 * Adds security headers to protect the app from common vulnerabilities.
 *
 * @remarks
 * Uses `helmet` middleware to set various HTTP headers that help secure the application.
 */
app.use(helmet());

/**
 * Rate limiter middleware to limit repeated requests to the API.
 *
 * @remarks
 * This rate limiter allows a maximum of 100 requests from the same IP within a 10-minute window.
 */
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 100,
});
app.use(limiter);

/**
 * Prevents HTTP parameter pollution by sanitizing the query parameters.
 *
 * @remarks
 * The `hpp` middleware helps protect against HTTP parameter pollution attacks.
 */
app.use(hpp());

/**
 * Enables Cross-Origin Resource Sharing (CORS) for the app.
 *
 * @remarks
 * The CORS configuration allows requests from the `CORS_ADMIT_URL` and enables credentials sharing.
 * The `optionsSuccessStatus` ensures compatibility with older browsers.
 */
app.use(
    cors({
        origin: CORS_ADMIT_URL,
        credentials: true,
        optionsSuccessStatus: 200,
    })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1", router);

app.use(errorHandler);

export default app;
