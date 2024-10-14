import app from "./app";
import { HOST_PORT, HOST_URL, VERSION_APP } from "./config/configuration";
import colors from "colors";
import { openDBConnection } from "./database/database.connection";

(async function () {
    colors.enable();
    await openDBConnection();

    const server = app.listen(HOST_PORT, () =>
        console.log(
            "🚀 Server ready at",
            `${HOST_URL}/api/${VERSION_APP}`.yellow.bold
        )
    );

    process.on("unhandledRejection", (reason: Error) => {
        console.log(`Error: ${reason}`.bgRed);
        server.close(() => process.exit(1));
    });
})();
