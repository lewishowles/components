// @vitest-environment node
import { describe, expect, test } from "vite-plus/test";
import { getComponentManifest } from "./component-manifest.js";

describe("getComponentManifest", () => {
	test("Returns at least one entry", () => {
		const manifest = getComponentManifest();

		expect(manifest.length).toBeGreaterThan(0);
	});

	test("Each entry has tag, name, and path", () => {
		const manifest = getComponentManifest();

		for (const entry of manifest) {
			expect(entry).toMatchObject({
				tag: expect.any(String),
				name: expect.any(String),
				path: expect.any(String),
			});
		}
	});

	test("Excludes .fixture.vue files", () => {
		const manifest = getComponentManifest();

		const hasFixture = manifest.some(({ tag }) => tag.endsWith(".fixture"));

		expect(hasFixture).toBe(false);
	});

	test("Excludes non-.vue files", () => {
		const manifest = getComponentManifest();

		const hasNonVue = manifest.some(({ path }) => !path.endsWith(".vue"));

		expect(hasNonVue).toBe(false);
	});
});
