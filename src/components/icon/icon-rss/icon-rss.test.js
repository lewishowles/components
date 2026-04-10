import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconRss from "./icon-rss.vue";

const mount = createMount(IconRss);

describe("icon-rss", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
