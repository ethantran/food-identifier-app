// Import required libraries
import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";
import "dotenv/config";

// Verify required environment variables
if (!process.env.OPENAI_API_KEY) {
    console.warn(
        "⚠️  OPENAI_API_KEY is not set. Food analysis functionality will not work."
    );
}

installGlobals();

const BUILD_PATH = path.resolve("build/index.js");
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

async function start() {
    const build = await import(BUILD_PATH);

    const app = express();

    app.use(compression());
    app.disable("x-powered-by");

    // Serve static files
    app.use(
        "/build",
        express.static(path.join(__dirname, "public/build"), { immutable: true, maxAge: "1y" })
    );
    app.use(express.static(path.join(__dirname, "public"), { maxAge: "1h" }));

    app.use(morgan("tiny"));

    // Create and use Remix handler
    app.all(
        "*",
        createRequestHandler({
            build,
            mode: process.env.NODE_ENV,
        })
    );

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Express server listening on port ${port}`);
    });
}

start().catch(err => {
    console.error("Error starting server:", err);
    process.exit(1);
}); 