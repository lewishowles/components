import { describe, expect, test } from "vitest";
import useTranslationMode from "./use-translation-mode.vue";

describe("use-translation-mode", () => {
	test("should initialise", () => {
		const response = useTranslationMode();

		expect(response).toBeTypeOf("object");
	});
});
