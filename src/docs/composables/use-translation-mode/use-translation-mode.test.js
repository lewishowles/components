import { describe, expect, test } from "vite-plus/test";
import useTranslationMode from "./use-translation-mode";

describe("use-translation-mode", () => {
	test("should initialise", () => {
		const response = useTranslationMode();

		expect(response).toBeTypeOf("object");
	});
});
