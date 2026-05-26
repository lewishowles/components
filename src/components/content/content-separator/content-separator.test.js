import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import ContentSeparator from "./content-separator.vue";

const mount = createMount(ContentSeparator);

describe("content-separator", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("screenReaderHidden", () => {
			test("Is true for the default div tag", () => {
				const wrapper = mount();

				expect(wrapper.vm.screenReaderHidden).toBe(true);
			});

			test("Is false when tag is hr", () => {
				const wrapper = mount({ tag: "hr" });

				expect(wrapper.vm.screenReaderHidden).toBe(false);
			});
		});
	});
});
