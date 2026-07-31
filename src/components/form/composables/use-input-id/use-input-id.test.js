import { describe, expect, test } from "vite-plus/test";
import useInputId from "./use-input-id";

describe("useInputId", () => {
	test("An ID should be generated if one is not provided", () => {
		const { inputId } = useInputId();

		expect(inputId.value).toEqual(expect.any(String));
	});

	test("A provided ID should be used", () => {
		const { inputId } = useInputId("id-abc");

		expect(inputId.value).toBe("id-abc");
	});
});
