import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";

// Load environment variables from .env file
import * as dotenv from "dotenv";
dotenv.config();

import { createRequestHandler } from "@remix-run/express";
import { broadcastDevReady, installGlobals } from "@remix-run/node";
import type { ServerBuild } from "@remix-run/node";
import chokidar from "chokidar";
import compression from "compression";
import express from "express";
import morgan from "morgan";

// Verify required environment variables
if (!process.env.OPENAI_API_KEY) {
    console.warn(
        "⚠️  OPENAI_API_KEY is not set. Food analysis functionality will not work."
    );
}

installGlobals();

const BUILD_PATH = path.resolve("build/index.js");
const VERSION_PATH = path.resolve("build/version.txt");

const initialBuild = await reimportServer();
const remixHandler =
    process.env.NODE_ENV === "development"
        ? await createDevRequestHandler(initialBuild)
        : createRequestHandler({
            build: initialBuild,
            mode: process.env.NODE_ENV,
        });

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// Remix fingerprints its assets so we can cache forever.
app.use(
    "/build",
    express.static("public/build", { immutable: true, maxAge: "1y" })
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public", { maxAge: "1h" }));

app.use(morgan("tiny"));

app.all("*", remixHandler);

const port = process.env.PORT || 3000;
app.listen(port, async () => {
    console.log(`Express server listening on port ${port}`);

    if (process.env.NODE_ENV === "development") {
        broadcastDevReady(initialBuild);
    }
});

async function reimportServer(): Promise<ServerBuild> {
    const stat = fs.statSync(BUILD_PATH);

    // convert build path to URL for Windows compatibility
    const BUILD_URL = url.pathToFileURL(BUILD_PATH).href;

    // use a timestamp query parameter to bust the import cache
    return import(BUILD_URL + "?t=" + stat.mtimeMs);
}

async function createDevRequestHandler(initialBuild: ServerBuild) {
    let build = initialBuild;

    async function handleServerUpdate() {
        // 1. re-import the server build
        build = await reimportServer();
        // 2. tell Remix that this app server is now up-to-date and ready
        broadcastDevReady(build);
    }

    const watcher = chokidar.watch(VERSION_PATH, { ignoreInitial: true });
    watcher.on("add", handleServerUpdate);
    watcher.on("change", handleServerUpdate);

    return createRequestHandler({
        build,
        mode: "development",
    });
} 