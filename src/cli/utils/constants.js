import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

// Absolute path to this utility directory.
const __dirname = dirname(fileURLToPath(import.meta.url));

// Package details used for CLI labels and copied-file notes.
const PKG = JSON.parse(readFileSync(join(__dirname, "../../../package.json"), "utf8"));

// Absolute path to the shipped CSS directory.
export const CSS_DIR = join(__dirname, "../../../dist/css");

// Default destination directory, relative to the user's project root.
export const DEFAULT_DEST = "src/assets/css";

// Package name and version from the manifest.
export const PACKAGE_NAME = PKG.name;
export const VERSION = PKG.version;
