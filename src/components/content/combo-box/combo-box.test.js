import { createDeepMount, createMount } from "@lewishowles/testing/vue";
import { nextTick } from "vue";
import { describe, expect, test } from "vite-plus/test";
import ComboBox from "./combo-box.vue";

const defaultItems = [
	{ id: "1", name: "Picard" },
	{ id: "2", name: "Riker" },
	{ id: "3", name: "Data" },
];

const mount = createMount(ComboBox, { props: { items: defaultItems } });
const mountDeep = createDeepMount(ComboBox, { props: { items: defaultItems } });

describe("combo-box", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Dropdown state", () => {
		test("Keeps the closed dropdown mounted and hidden from assistive technology", () => {
			const wrapper = mount();
			const dropdown = wrapper.find('[data-test="combo-box-dropdown"]');

			expect(dropdown.exists()).toBe(true);
			expect(dropdown.attributes("data-state")).toBe("closed");
			expect(dropdown.attributes("inert")).toBeDefined();
		});

		test("Exposes the dropdown while open and hides it again on close", async () => {
			const wrapper = mountDeep();
			const dropdown = wrapper.find('[data-test="combo-box-dropdown"]');
			const input = wrapper.find('[data-test="combo-box-input"] input');

			await input.setValue("a");

			expect(dropdown.attributes("data-state")).toBe("open");
			expect(dropdown.attributes("inert")).toBeUndefined();

			await input.trigger("keydown", { key: "Escape" });
			await nextTick();

			expect(dropdown.attributes("data-state")).toBe("closed");
			expect(dropdown.attributes("inert")).toBeDefined();
		});
	});
});
