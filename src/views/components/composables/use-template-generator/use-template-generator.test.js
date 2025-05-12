import { describe, expect, test } from "vitest";
import useTemplateGenerator from "./use-template-generator";

describe("useTemplateGenerator", () => {
	test("should initialise", () => {
		const response = useTemplateGenerator();

		expect(response).toBeTypeOf("object");
	});
});
