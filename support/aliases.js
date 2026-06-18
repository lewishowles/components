import { fileURLToPath, URL } from "node:url";

// Shared module-resolution aliases for use in the library build, the docs
// build, and the test runner.
export const alias = {
	"@": fileURLToPath(new URL("../src", import.meta.url)),
	"@test": fileURLToPath(new URL("../test", import.meta.url)),
	"@unit": fileURLToPath(new URL("../test/unit", import.meta.url)),
};
