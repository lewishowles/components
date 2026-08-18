import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import { nextTick } from "vue";
import FormComboBox from "./form-combo-box.vue";

const mount = createMount(FormComboBox);

const options = [
	{ id: "pilot-42", name: "Amelia Earhart" },
	{ id: "pilot-7", name: "Bessie Coleman" },
];

describe("form-combo-box", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});

		test("normalises options while retaining the original option reference", () => {
			const wrapper = mount({
				options,
				labelKey: "name",
				valueKey: "id",
			});

			expect(wrapper.vm.internalItems).toEqual([
				expect.objectContaining({
					option: expect.objectContaining({ label: "Amelia Earhart", value: "pilot-42" }),
					originalOption: options[0],
				}),
				expect.objectContaining({
					option: expect.objectContaining({ label: "Bessie Coleman", value: "pilot-7" }),
					originalOption: options[1],
				}),
			]);
		});

		test.for([
			["object options", { "pilot-42": "Amelia Earhart" }, "Amelia Earhart"],
			["string options", ["Amelia Earhart"], "Amelia Earhart"],
			["number options", [42], 42],
		])("retains the original option for %s", ([, input, originalOption]) => {
			const wrapper = mount({ options: input });

			expect(wrapper.vm.internalItems[0].originalOption).toBe(originalOption);
		});
	});

	describe("Selected value", () => {
		test("displays the label for an initial and externally changed model value", async () => {
			const wrapper = mount({
				options,
				labelKey: "name",
				valueKey: "id",
				modelValue: "pilot-42",
			});

			expect(wrapper.vm.query).toBe("Amelia Earhart");

			await wrapper.setProps({ modelValue: "pilot-7" });

			expect(wrapper.vm.query).toBe("Bessie Coleman");
		});

		test("updates the displayed label when options refresh", async () => {
			const wrapper = mount({
				options,
				labelKey: "name",
				valueKey: "id",
				modelValue: "pilot-42",
			});

			const refreshedOptions = [{ id: "pilot-42", name: "Amelia Mary Earhart" }];

			await wrapper.setProps({ options: refreshedOptions });

			expect(wrapper.vm.query).toBe("Amelia Mary Earhart");
			expect(wrapper.emitted("update:modelValue")).toBeUndefined();
		});

		test("clears the displayed label when the model is externally cleared", async () => {
			const wrapper = mount({
				options,
				labelKey: "name",
				valueKey: "id",
				modelValue: "pilot-42",
			});

			await wrapper.setProps({ modelValue: null });

			expect(wrapper.vm.query).toBe("");
		});
	});

	describe("Selection", () => {
		test("sets the selected value when an option is selected", () => {
			const wrapper = mount({
				options,
				labelKey: "name",
				valueKey: "id",
			});

			wrapper.vm.selectItem(wrapper.vm.internalItems[0].id);

			expect(wrapper.emitted("update:modelValue")).toEqual([["pilot-42"]]);
			expect(wrapper.vm.query).toBe("Amelia Earhart");
		});

		test("clears the selected value when the query is edited or cleared", async () => {
			const wrapper = mount({
				options,
				labelKey: "name",
				valueKey: "id",
				modelValue: "pilot-42",
			});

			wrapper.vm.query = "Amelia";
			await nextTick();

			expect(wrapper.emitted("update:modelValue").at(-1)).toEqual([null]);

			wrapper.vm.query = "";
			await nextTick();

			expect(wrapper.vm.query).toBe("");
			expect(wrapper.emitted("update:modelValue").at(-1)).toEqual([null]);
		});
	});
});
