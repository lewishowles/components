/**
 * Verify that every entry in the `package.json` exports map resolves to an
 * existing dist file, and that JS entry points can be imported with at least
 * one named export.
 *
 * CSS entries and entries that depend on build-time virtual modules are
 * checked for file existence only.
 *
 * Run after `bun run build`.
 */

import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import process from "node:process";

const root = fileURLToPath(new URL("..", import.meta.url));
const { exports: exportMap } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

// Entries that rely on build-time virtual modules and cannot be imported
// outside of a Vite context — file existence check only.
const FILE_CHECK_ONLY = new Set(["./resolver"]);

const failed = [];

let checked = 0;

for (const [entrypoint, conditions] of Object.entries(exportMap)) {
	const filePath =
		typeof conditions === "string" ? conditions : (conditions.import ?? conditions.require ?? null);

	if (!filePath) {
		continue;
	}

	const absolutePath = join(root, filePath);

	checked++;

	if (!existsSync(absolutePath)) {
		failed.push({ entrypoint, reason: `dist file not found: ${filePath}` });
		continue;
	}

	if (filePath.endsWith(".css") || FILE_CHECK_ONLY.has(entrypoint)) {
		continue;
	}

	try {
		const module = await import(absolutePath);
		const names = Object.keys(module).filter((key) => key !== "default");

		if (names.length === 0) {
			failed.push({ entrypoint, reason: `no named exports in ${filePath}` });
		}
	} catch (error) {
		failed.push({ entrypoint, reason: error.message });
	}
}

if (failed.length > 0) {
	console.error(`Exports smoke test failed (${checked - failed.length}/${checked} passed):`);

	for (const { entrypoint, reason } of failed) {
		console.error(`  ${entrypoint}: ${reason}`);
	}

	process.exit(1);
}

console.log(`Exports smoke test passed (${checked}/${checked} checked).`);
