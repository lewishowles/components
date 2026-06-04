import { fileURLToPath, URL } from "node:url";

// Shared module-resolution aliases for use in the library build, the docs
// build, the test runner, and Cypress.
export const alias = {
	"@": fileURLToPath(new URL("../src", import.meta.url)),
	"@cypress": fileURLToPath(new URL("../test/cypress", import.meta.url)),
	"@unit": fileURLToPath(new URL("../test/unit", import.meta.url)),
};
