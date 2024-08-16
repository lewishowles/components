import { describe, it, expect } from "vitest";
import useInputId from "./use-input-id";

describe("useInputId", () => {
	it("should generate an ID if one is not provided", () => {
		const { inputId } = useInputId();

		expect(inputId.value).toEqual(expect.any(String));
	});

	it("should use a provided ID", () => {
		const { inputId } = useInputId("id-abc");

		expect(inputId.value).toBe("id-abc");
	});
});
