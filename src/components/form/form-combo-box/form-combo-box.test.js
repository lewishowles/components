import { createDeepMount, createMount } from "@lewishowles/testing/vue";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { nextTick } from "vue";
import FormComboBox from "./form-combo-box.vue";

const mount = createMount(FormComboBox);
const mountDeep = createDeepMount(FormComboBox);

const options = [
	{ id: "pilot-42", name: "Amelia Earhart" },
	{ id: "pilot-7", name: "Bessie Coleman" },
];

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllEnvs();
});

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

	describe("Input presentation", () => {
		test("keeps a hidden label available to screen readers", () => {
			const wrapper = mountDeep({
				props: { displayLabel: false },
				slots: { default: "Pilot" },
			});

			const label = wrapper.find('[data-test="form-label"]');

			expect(label.text()).toBe("Pilot");
			expect(label.classes()).toContain("sr-only");
		});

		test("merges input attributes with combobox and readonly attributes", () => {
			const wrapper = mountDeep({
				attrs: { readonly: true },
				props: {
					inputAttributes: { autocomplete: "off", inputmode: "search" },
				},
				slots: { default: "Pilot" },
			});

			const input = wrapper.find("input");

			expect(input.attributes("autocomplete")).toBe("off");
			expect(input.attributes("inputmode")).toBe("search");
			expect(input.attributes("role")).toBe("combobox");
			expect(input.attributes("readonly")).toBeDefined();
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

		test("clears the selected value when typing a new query", () => {
			const wrapper = mount({
				options,
				labelKey: "name",
				valueKey: "id",
				modelValue: "pilot-42",
			});

			wrapper.vm.handleInput("Amelia");

			expect(wrapper.emitted("update:modelValue").at(-1)).toEqual([null]);
			expect(wrapper.vm.isOpen).toBe(true);
			expect(wrapper.vm.displayedLabel).toBe("");
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

	describe("Filtering", () => {
		test("filters labels case-insensitively while preserving caller order", async () => {
			const wrapper = mount({
				options: [
					{ id: "pilot-7", name: "Bessie Coleman" },
					{ id: "pilot-42", name: "Amelia Earhart" },
					{ id: "pilot-9", name: "Sabiha Gökçen" },
				],
				labelKey: "name",
				valueKey: "id",
			});

			expect(wrapper.vm.filteredItems.map(({ option }) => option.value)).toEqual([
				"pilot-7",
				"pilot-42",
				"pilot-9",
			]);

			wrapper.vm.query = "S";
			await nextTick();

			expect(wrapper.vm.filteredItems.map(({ option }) => option.value)).toEqual([
				"pilot-7",
				"pilot-9",
			]);
		});

		test("shows every option when opening the input with a selection", async () => {
			const wrapper = mount({
				options,
				labelKey: "name",
				valueKey: "id",
				modelValue: "pilot-42",
			});

			wrapper.vm.handleFocusin();
			await nextTick();

			expect(wrapper.vm.filteredItems.map(({ option }) => option.value)).toEqual([
				"pilot-42",
				"pilot-7",
			]);
		});

		test("keeps duplicate labels selectable by their distinct values", async () => {
			const wrapper = mount({
				options: [
					{ id: "pilot-1", name: "Alex Johnson" },
					{ id: "pilot-2", name: "Alex Johnson" },
				],
				labelKey: "name",
				valueKey: "id",
			});

			wrapper.vm.query = "alex";
			await nextTick();
			wrapper.vm.selectItem(wrapper.vm.filteredItems[1].id);

			expect(wrapper.emitted("update:modelValue")).toEqual([["pilot-2"]]);
			expect(wrapper.vm.query).toBe("Alex Johnson");
		});

		test("warns and drops later options with duplicate values", async () => {
			vi.stubEnv("DEV", true);
			const warningSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

			const wrapper = mountDeep({
				props: {
					options: [
						{ id: "pilot-1", name: "Alex Johnson" },
						{ id: "pilot-1", name: "Alexandra Johnson" },
						{ id: "pilot-2", name: "Bessie Coleman" },
					],
					labelKey: "name",
					valueKey: "id",
				},
				slots: { default: "Pilot" },
			});

			wrapper.vm.openResults();
			await nextTick();

			expect(warningSpy).toHaveBeenCalledWith(
				'[form-combo-box] Duplicate option value "pilot-1". Keeping the first option.',
			);
			expect(
				wrapper.findAll('[data-test="form-combo-box-option"]').map((option) => option.text()),
			).toEqual(["Alex Johnson", "Bessie Coleman"]);
			expect(wrapper.vm.internalItems.map(({ option }) => option.value)).toEqual([
				"pilot-1",
				"pilot-2",
			]);

			wrapper.vm.selectItem(wrapper.vm.internalItems[0].id);

			expect(wrapper.emitted("update:modelValue")).toEqual([["pilot-1"]]);
		});
	});

	describe("Loading and stale selections", () => {
		test("keeps a selection while loading and clears it after loading finishes", async () => {
			const wrapper = mount({
				options,
				labelKey: "name",
				valueKey: "id",
				modelValue: "pilot-42",
				loading: true,
			});

			await wrapper.setProps({ options: [] });

			expect(wrapper.emitted("update:modelValue")).toBeUndefined();

			await wrapper.setProps({ loading: false });

			expect(wrapper.emitted("update:modelValue")).toEqual([[null]]);
		});

		test("does not clear a selection when options change without a loading cycle", async () => {
			const wrapper = mount({
				options,
				labelKey: "name",
				valueKey: "id",
				modelValue: "pilot-42",
			});

			await wrapper.setProps({ options: [] });

			expect(wrapper.emitted("update:modelValue")).toBeUndefined();
			expect(wrapper.vm.query).toBe("Amelia Earhart");
		});
	});

	describe("Readonly", () => {
		test("displays the selected label without accepting input or selection", async () => {
			const wrapper = mountDeep({
				attrs: { readonly: true },
				props: {
					options,
					labelKey: "name",
					valueKey: "id",
					modelValue: "pilot-42",
				},
				slots: { default: "Pilot" },
			});

			expect(wrapper.find("input").attributes("readonly")).toBeDefined();
			expect(wrapper.vm.query).toBe("Amelia Earhart");

			await wrapper.find("input").setValue("Bessie Coleman");
			wrapper.vm.selectItem(wrapper.vm.internalItems[1].id);
			await nextTick();

			expect(wrapper.vm.query).toBe("Amelia Earhart");
			expect(wrapper.vm.isOpen).toBe(false);
			expect(wrapper.emitted("update:modelValue")).toBeUndefined();
		});

		test("still reconciles a stale selection after loading while readonly", async () => {
			const wrapper = mount({
				attrs: { readonly: true },
				props: {
					options,
					labelKey: "name",
					valueKey: "id",
					modelValue: "pilot-42",
					loading: true,
				},
			});

			await wrapper.setProps({ options: [], loading: false });

			expect(wrapper.emitted("update:modelValue")).toEqual([[null]]);
		});
	});

	describe("Status and slots", () => {
		test("shows the loading slot before the empty state", async () => {
			const loadingWrapper = mountDeep({
				props: { loading: true },
				slots: {
					default: "Pilot",
					loading: "Loading pilots",
					empty: "No pilots",
				},
			});

			loadingWrapper.vm.openResults();
			await nextTick();

			expect(loadingWrapper.find('[data-part="status"]').text()).toContain("Loading pilots");
			expect(loadingWrapper.find('[data-test="form-combo-box-empty"]').exists()).toBe(false);
		});

		test("shows the empty slot when there are no options", async () => {
			const emptyWrapper = mountDeep({
				props: { options: [] },
				slots: { default: "Pilot", empty: "No pilots" },
			});

			emptyWrapper.vm.openResults();
			await nextTick();

			expect(emptyWrapper.find('[data-part="status"]').text()).toContain("No pilots");
		});

		test("shows the no-results slot when the query has no matches", async () => {
			const noResultsWrapper = mountDeep({
				props: { options, labelKey: "name", valueKey: "id" },
				slots: {
					default: "Pilot",
					"no-results": ({ query }) => `No pilot matches ${query}`,
				},
			});

			noResultsWrapper.vm.query = "Unknown";
			noResultsWrapper.vm.openResults();
			await nextTick();

			expect(noResultsWrapper.find('[data-part="status"]').text()).toBe("No pilot matches Unknown");
			expect(noResultsWrapper.find('[data-test="form-combo-box-empty"]').exists()).toBe(false);
		});

		test("passes rich option and form slot content with stable parts", async () => {
			const wrapper = mountDeep({
				props: { options, labelKey: "name", valueKey: "id" },
				slots: {
					default: "Pilot",
					"optional-indicator": "(optional)",
					introduction: "Choose a pilot",
					help: "Search by name",
					error: "Choose a valid pilot",
					option: ({ option, label, value, highlighted, selected }) =>
						`${option.name}|${label}|${value}|${highlighted}|${selected}`,
				},
			});

			wrapper.vm.openResults();
			await nextTick();

			expect(wrapper.find('[data-component="form-combo-box"]').attributes("data-state")).toBe(
				"open",
			);
			expect(wrapper.find('[data-part="text-control"]').exists()).toBe(true);
			expect(wrapper.find('[data-part="listbox"]').exists()).toBe(true);
			expect(wrapper.findAll('[data-part="option"]')).toHaveLength(2);
			expect(wrapper.find('[data-part="option"]').text()).toContain(
				"Amelia Earhart|Amelia Earhart|pilot-42",
			);
			expect(wrapper.text()).toContain("Choose a pilot");
			expect(wrapper.text()).toContain("Search by name");
			expect(wrapper.text()).toContain("Choose a valid pilot");
		});
	});

	describe("Dropdown positioning", () => {
		test("matches the field wrapper's own position and width", async () => {
			const wrapper = mountDeep({ slots: { default: "Pilot" } });

			wrapper.vm.openResults();
			await nextTick();

			const dropdown = wrapper.find('[data-test="form-combo-box-dropdown"]');

			expect(dropdown.attributes("style")).toContain("left");
			expect(dropdown.attributes("style")).toContain("width");
		});

		test("ignores a width class in dropdownClasses, since the dropdown always matches the input", async () => {
			const wrapper = mountDeep({
				props: { dropdownClasses: "w-96" },
				slots: { default: "Pilot" },
			});

			wrapper.vm.openResults();
			await nextTick();

			const dropdown = wrapper.find('[data-test="form-combo-box-dropdown"]');

			expect(dropdown.classes()).toContain("w-96");
			expect(dropdown.attributes("style")).toContain("width");
		});
	});
});
