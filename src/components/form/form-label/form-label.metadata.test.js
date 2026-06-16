import { describe, expect, test } from "vite-plus/test";
import { formLabelMetadata } from "./form-label.metadata.js";

describe("form-label metadata", () => {
	test("exports a metadata object with the required top-level fields", () => {
		expect(formLabelMetadata).toMatchObject({
			name: "form-label",
			category: "form",
			summary: expect.any(String),
			props: expect.any(Array),
			slots: expect.any(Array),
			examples: expect.any(Array),
		});
	});

	test("every prop has a name and type", () => {
		for (const prop of formLabelMetadata.props) {
			expect(prop).toMatchObject({
				name: expect.any(String),
				type: expect.any(String),
			});
		}
	});

	test("every slot has a name", () => {
		for (const slot of formLabelMetadata.slots) {
			expect(slot).toMatchObject({ name: expect.any(String) });
		}
	});
});
