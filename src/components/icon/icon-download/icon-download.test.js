import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconDownload from "./icon-download.vue";

const mount = createMount(IconDownload);

describe("icon-download", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
