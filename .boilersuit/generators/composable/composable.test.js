import { describe, expect, test } from "vite-plus/test";
import { {{ NAME | camel }} } from "./{{ NAME | kebab }}.js";

describe("{{ NAME | camel }}", () => {
	describe("Initialisation", () => {
		test("should initialise", () => {
			const response = {{ NAME | camel }}();

			expect(response).toBeTypeOf("object");
		});
	});
});
