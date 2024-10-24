import swaggerJSDoc from "swagger-jsdoc";
import { HOST_URL, NODE_ENV, VERSION_APP } from "../config/configuration";
import fs from "fs";

let serverUrl = `${HOST_URL}/api/${VERSION_APP}`;

if (NODE_ENV === "production") serverUrl = `${HOST_URL}/api/${VERSION_APP}`;

const components = JSON.parse(
    fs.readFileSync(`${process.cwd()}/src/swagger/swagger.json`, "utf-8")
);

/**
 * Swagger specification for the HealthAnywhere API.
 *
 * @remarks
 * This specification follows the OpenAPI 3.0.0 standard and documents the API endpoints
 * and components for the Health Anywhere application. It is used to generate the
 * Swagger UI documentation and provide API consumers with detailed information.
 *
 * @see {@link https://swagger.io/specification/} for more details on OpenAPI specification.
 */
const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API_REST_HealthAnywhere",
            version: "1.0.0",
            description:
                "API REST to access to data of Health Anywhere, this is a web application that aims to help medical patients find doctors near their location.",
        },
        servers: [{ url: serverUrl }],
        components,
    },
    apis: ["./src/**/*.routes.ts"],
});

export default swaggerSpec;
