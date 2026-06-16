import { describe, expect, test } from "vite-plus/test";
import { baseIconMetadata } from "./base-icon.metadata.js";

describe("base-icon metadata", () => {
	test("exports a metadata object with the required top-level fields", () => {
		expect(baseIconMetadata).toMatchObject({
			name: "base-icon",
			category: "icon",
			summary: expect.any(String),
			props: expect.any(Array),
			slots: expect.any(Array),
			examples: expect.any(Array),
		});
	});

	test("every prop has a name and type", () => {
		for (const prop of baseIconMetadata.props) {
			expect(prop).toMatchObject({
				name: expect.any(String),
				type: expect.any(String),
			});
		}
	});

	test("every slot has a name", () => {
		for (const slot of baseIconMetadata.slots) {
			expect(slot).toMatchObject({ name: expect.any(String) });
		}
	});
});
