import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import ComboBox from "./combo-box.vue";

const defaultItems = [
	{ id: "1", name: "Picard" },
	{ id: "2", name: "Riker" },
	{ id: "3", name: "Data" },
];

const mount = createMount(ComboBox, { props: { items: defaultItems } });

describe("combo-box", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
