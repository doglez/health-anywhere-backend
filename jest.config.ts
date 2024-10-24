import { Config } from "jest";

const jestConfig: Config = {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
        "**/src/**/*.ts",
        "**/src/**/__tests__/**",
        "!**/src/**/__tests__/helpers/**",
        "!**/server.{ts,js,tsx,jsx}",
        "!**/app.{ts,js,tsx,jsx}",
        "!**/router.{ts,js,tsx,jsx}",
        "!**/src/certificate/**",
        "!**/src/config/**",
        "!**/src/database/**",
        "!**/src/debugger/**",
        "!**/src/interfaces/**",
        "!**/src/middleware/**",
        "!**/src/util/**",
        "!**/src/swagger/**",
    ],
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    coverageReporters: ["lcov", "text", "text-summary", "html"],
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },
    moduleNameMapper: {
        "^src/(.*)$": "<rootDir>/src/$1",
    },
    preset: "ts-jest",
    roots: ["./src"],
    testEnvironment: "node",
    testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
    transformIgnorePatterns: ["\\\\node_modules\\\\", "\\.pnp\\.[^\\\\]+$"],
};

export default jestConfig;
