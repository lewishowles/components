import { createDeepMount, createMount } from "@lewishowles/testing/vue";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { nextTick } from "vue";
import FormComboBox from "./form-combo-box.vue";

const mount = createMount(FormComboBox);
const mountDeep = createDeepMount(FormComboBox);

const options = [
	{ id: "person-42", name: "Avery Lane" },
	{ id: "person-7", name: "Basil Morgan" },
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
					option: expect.objectContaining({ label: "Avery Lane", value: "person-42" }),
					originalOption: options[0],
				}),
				expect.objectContaining({
					option: expect.objectContaining({ label: "Basil Morgan", value: "person-7" }),
					originalOption: options[1],
				}),
			]);
		});

		test.for([
			["object options", { "person-42": "Avery Lane" }, "Avery Lane"],
			["string options", ["Avery Lane"], "Avery Lane"],
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
				slots: { default: "Person" },
			});

			const label = wrapper.find('[data-test="form-label"]');

			expect(label.text()).toBe("Person");
			expect(label.classes()).toContain("sr-only");
		});

		test("merges input attributes with combobox and readonly attributes", () => {
			const wrapper = mountDeep({
				attrs: { readonly: true },
				props: {
					inputAttributes: { autocomplete: "off", inputmode: "search" },
				},
				slots: { default: "Person" },
			});

			const input = wrapper.find("input");

			expect(input.attributes("autocomplete")).toBe("off");
			expect(input.attributes("inputmode")).toBe("search");
			expect(input.attributes("role")).toBe("combobox");
			expect(input.attributes("readonly")).toBeDefined();
		});

		test("forwards prefix content to the input with an empty value", () => {
			const wrapper = mountDeep({
				slots: {
					default: "Person",
					prefix: "Search",
				},
			});

			expect(wrapper.find('[data-test="form-prefix"]').text()).toBe("Search");
			expect(wrapper.find('[data-test="form-suffix"]').exists()).toBe(false);
		});

		test("forwards suffix content to the input with a selected value", () => {
			const wrapper = mountDeep({
				props: {
					options,
					labelKey: "name",
					valueKey: "id",
					modelValue: "person-42",
				},
				slots: {
					default: "Person",
					suffix: "Clear",
				},
			});

			expect(wrapper.find('[data-test="form-prefix"]').exists()).toBe(false);
			expect(wrapper.find('[data-test="form-suffix"]').text()).toBe("Clear");
		});

		test("forwards both adornments while the results are open", async () => {
			const wrapper = mountDeep({
				props: { options, labelKey: "name", valueKey: "id" },
				slots: {
					default: "Person",
					prefix: "Search",
					suffix: "Clear",
				},
			});

			wrapper.vm.openResults();
			await nextTick();

			expect(wrapper.find('[data-test="form-prefix"]').text()).toBe("Search");
			expect(wrapper.find('[data-test="form-suffix"]').text()).toBe("Clear");
			expect(wrapper.find('[data-test="form-combo-box-dropdown"]').exists()).toBe(true);
		});
	});

	describe("Selected value", () => {
		test("displays the label for an initial and externally changed model value", async () => {
			const wrapper = mount({
				options,
				labelKey: "name",
				valueKey: "id",
				modelValue: "person-42",
			});

			expect(wrapper.vm.query).toBe("Avery Lane");

			await wrapper.setProps({ modelValue: "person-7" });

			expect(wrapper.vm.query).toBe("Basil Morgan");
		});

		test("updates the displayed label when options refresh", async () => {
			const wrapper = mount({
				options,
				labelKey: "name",
				valueKey: "id",
				modelValue: "person-42",
			});

			const refreshedOptions = [{ id: "person-42", name: "Avery James Lane" }];

			await wrapper.setProps({ options: refreshedOptions });

			expect(wrapper.vm.query).toBe("Avery James Lane");
			expect(wrapper.emitted("update:modelValue")).toBeUndefined();
		});

		test("clears the displayed label when the model is externally cleared", async () => {
			const wrapper = mount({
				options,
				labelKey: "name",
				valueKey: "id",
				modelValue: "person-42",
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

			expect(wrapper.emitted("update:modelValue")).toEqual([["person-42"]]);
			expect(wrapper.vm.query).toBe("Avery Lane");
		});

		test("clears the selected value when typing a new query", () => {
			const wrapper = mount({
				options,
				labelKey: "name",
				valueKey: "id",
				modelValue: "person-42",
			});

			wrapper.vm.handleInput("Avery");

			expect(wrapper.emitted("update:modelValue").at(-1)).toEqual([null]);
			expect(wrapper.vm.isOpen).toBe(true);
			expect(wrapper.vm.displayedLabel).toBe("");
		});

		test("clears the selected value when the query is edited or cleared", async () => {
			const wrapper = mount({
				options,
				labelKey: "name",
				valueKey: "id",
				modelValue: "person-42",
			});

			wrapper.vm.query = "Avery";
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
					{ id: "person-7", name: "Basil Morgan" },
					{ id: "person-42", name: "Avery Lane" },
					{ id: "person-9", name: "Skyler Brooks" },
				],
				labelKey: "name",
				valueKey: "id",
			});

			expect(wrapper.vm.filteredItems.map(({ option }) => option.value)).toEqual([
				"person-7",
				"person-42",
				"person-9",
			]);

			wrapper.vm.query = "S";
			await nextTick();

			expect(wrapper.vm.filteredItems.map(({ option }) => option.value)).toEqual([
				"person-7",
				"person-9",
			]);
		});

		test("shows every option when opening the input with a selection", async () => {
			const wrapper = mount({
				options,
				labelKey: "name",
				valueKey: "id",
				modelValue: "person-42",
			});

			wrapper.vm.handleFocusin();
			await nextTick();

			expect(wrapper.vm.filteredItems.map(({ option }) => option.value)).toEqual([
				"person-42",
				"person-7",
			]);
		});

		test("keeps duplicate labels selectable by their distinct values", async () => {
			const wrapper = mount({
				options: [
					{ id: "person-1", name: "Alex Johnson" },
					{ id: "person-2", name: "Alex Johnson" },
				],
				labelKey: "name",
				valueKey: "id",
			});

			wrapper.vm.query = "alex";
			await nextTick();
			wrapper.vm.selectItem(wrapper.vm.filteredItems[1].id);

			expect(wrapper.emitted("update:modelValue")).toEqual([["person-2"]]);
			expect(wrapper.vm.query).toBe("Alex Johnson");
		});

		test("warns and drops later options with duplicate values", async () => {
			vi.stubEnv("DEV", true);
			const warningSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

			const wrapper = mountDeep({
				props: {
					options: [
						{ id: "person-1", name: "Alex Johnson" },
						{ id: "person-1", name: "Alexandra Johnson" },
						{ id: "person-2", name: "Basil Morgan" },
					],
					labelKey: "name",
					valueKey: "id",
				},
				slots: { default: "Person" },
			});

			wrapper.vm.openResults();
			await nextTick();

			expect(warningSpy).toHaveBeenCalledWith(
				'[form-combo-box] Duplicate option value "person-1". Keeping the first option.',
			);
			expect(
				wrapper.findAll('[data-test="form-combo-box-option"]').map((option) => option.text()),
			).toEqual(["Alex Johnson", "Basil Morgan"]);
			expect(wrapper.vm.internalItems.map(({ option }) => option.value)).toEqual([
				"person-1",
				"person-2",
			]);

			wrapper.vm.selectItem(wrapper.vm.internalItems[0].id);

			expect(wrapper.emitted("update:modelValue")).toEqual([["person-1"]]);
		});
	});

	describe("Loading and stale selections", () => {
		test("keeps a selection while loading and clears it after loading finishes", async () => {
			const wrapper = mount({
				options,
				labelKey: "name",
				valueKey: "id",
				modelValue: "person-42",
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
				modelValue: "person-42",
			});

			await wrapper.setProps({ options: [] });

			expect(wrapper.emitted("update:modelValue")).toBeUndefined();
			expect(wrapper.vm.query).toBe("Avery Lane");
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
					modelValue: "person-42",
				},
				slots: { default: "Person" },
			});

			expect(wrapper.find("input").attributes("readonly")).toBeDefined();
			expect(wrapper.vm.query).toBe("Avery Lane");

			await wrapper.find("input").setValue("Basil Morgan");
			wrapper.vm.selectItem(wrapper.vm.internalItems[1].id);
			await nextTick();

			expect(wrapper.vm.query).toBe("Avery Lane");
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
					modelValue: "person-42",
					loading: true,
				},
			});

			await wrapper.setProps({ options: [], loading: false });

			expect(wrapper.emitted("update:modelValue")).toEqual([[null]]);
		});
	});

	describe("Status and slots", () => {
		test("keeps the default visible and announced status messages", async () => {
			const wrapper = mountDeep({
				props: { loading: true },
				slots: { default: "Person" },
			});

			wrapper.vm.openResults();
			await nextTick();

			expect(wrapper.find('[data-part="status"]').text()).toContain("Loading…");
			expect(wrapper.find('[data-test="form-combo-box-announcement"]').text()).toBe(
				"Loading options.",
			);

			await wrapper.setProps({ loading: false });

			expect(wrapper.find('[data-part="status"]').text()).toBe("No options available.");
			expect(wrapper.find('[data-test="form-combo-box-announcement"]').text()).toBe(
				"No options available.",
			);

			await wrapper.setProps({ options: ["Avery Lane"] });
			wrapper.vm.query = "Unknown";
			await nextTick();

			expect(wrapper.find('[data-part="status"]').text()).toBe('No results found for "Unknown"');
			expect(wrapper.find('[data-test="form-combo-box-announcement"]').text()).toBe(
				'No results found for "Unknown".',
			);
		});

		test("keeps result counts and selection announcements independent of status slots", async () => {
			const wrapper = mountDeep({
				props: { options, labelKey: "name", valueKey: "id" },
				slots: {
					default: "Person",
					loading: "Loading people",
					empty: "No people",
					"no-results": "No matches",
				},
			});

			wrapper.vm.openResults();
			await nextTick();

			expect(wrapper.find('[data-test="form-combo-box-announcement"]').text()).toBe(
				"2 results found. Use the arrow keys to navigate.",
			);

			wrapper.vm.query = "Avery";
			await nextTick();

			expect(wrapper.find('[data-test="form-combo-box-announcement"]').text()).toBe(
				"1 result found. Use the arrow keys to navigate.",
			);

			wrapper.vm.selectOption(wrapper.vm.internalItems[0].id);
			await nextTick();

			expect(wrapper.find('[data-test="form-combo-box-announcement"]').text()).toBe(
				"Selected Avery Lane.",
			);

			await wrapper.setProps({ modelValue: null });

			expect(wrapper.find('[data-test="form-combo-box-announcement"]').text()).toBe(
				"Selection cleared.",
			);
		});

		test("shows the loading slot before the empty state", async () => {
			const loadingWrapper = mountDeep({
				props: { loading: true },
				slots: {
					default: "Person",
					loading: "Loading people",
					empty: "No people",
				},
			});

			loadingWrapper.vm.openResults();
			await nextTick();

			expect(loadingWrapper.find('[data-part="status"]').text()).toContain("Loading people");
			expect(loadingWrapper.find('[data-test="form-combo-box-announcement"]').text()).toBe(
				"Loading people",
			);
			expect(loadingWrapper.find('[data-test="form-combo-box-empty"]').exists()).toBe(false);
		});

		test("shows the empty slot when there are no options", async () => {
			const emptyWrapper = mountDeep({
				props: { options: [] },
				slots: { default: "Person", empty: "No people" },
			});

			emptyWrapper.vm.openResults();
			await nextTick();

			expect(emptyWrapper.find('[data-part="status"]').text()).toContain("No people");
			expect(emptyWrapper.find('[data-test="form-combo-box-announcement"]').text()).toBe(
				"No people",
			);
		});

		test("shows the no-results slot when the query has no matches", async () => {
			const noResultsWrapper = mountDeep({
				props: { options, labelKey: "name", valueKey: "id" },
				slots: {
					default: "Person",
					"no-results": ({ query }) => `No person matches ${query}`,
				},
			});

			noResultsWrapper.vm.query = "Unknown";
			noResultsWrapper.vm.openResults();
			await nextTick();

			expect(noResultsWrapper.find('[data-part="status"]').text()).toBe(
				"No person matches Unknown",
			);
			expect(noResultsWrapper.find('[data-test="form-combo-box-announcement"]').text()).toBe(
				"No person matches Unknown",
			);
			expect(noResultsWrapper.find('[data-test="form-combo-box-empty"]').exists()).toBe(false);
		});

		test("passes rich option and form slot content with stable parts", async () => {
			const wrapper = mountDeep({
				props: { options, labelKey: "name", valueKey: "id" },
				slots: {
					default: "Person",
					"optional-indicator": "(optional)",
					introduction: "Choose a person",
					help: "Search by name",
					error: "Choose a valid person",
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
				"Avery Lane|Avery Lane|person-42",
			);
			expect(wrapper.text()).toContain("Choose a person");
			expect(wrapper.text()).toContain("Search by name");
			expect(wrapper.text()).toContain("Choose a valid person");
		});
	});

	describe("Dropdown positioning", () => {
		test("matches the field wrapper's own position and width", async () => {
			const wrapper = mountDeep({ slots: { default: "Person" } });

			wrapper.vm.openResults();
			await nextTick();

			const dropdown = wrapper.find('[data-test="form-combo-box-dropdown"]');

			expect(dropdown.attributes("style")).toContain("left");
			expect(dropdown.attributes("style")).toContain("width");
		});

		test("ignores a width class in dropdownClasses, since the dropdown always matches the input", async () => {
			const wrapper = mountDeep({
				props: { dropdownClasses: "w-96" },
				slots: { default: "Person" },
			});

			wrapper.vm.openResults();
			await nextTick();

			const dropdown = wrapper.find('[data-test="form-combo-box-dropdown"]');

			expect(dropdown.classes()).toContain("w-96");
			expect(dropdown.attributes("style")).toContain("width");
		});
	});
});
