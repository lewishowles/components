import { createDeepMount, createMount } from "@lewishowles/testing/vue";
import { describe, expect, test, vi } from "vite-plus/test";
import { h } from "vue";
import FormInputGroup from "./form-input-group.vue";

const defaultProps = { options: ["pineapple", "banana", "coconut"] };
const mount = createMount(FormInputGroup, { props: defaultProps });
const deepMount = createDeepMount(FormInputGroup, { props: defaultProps });

describe("form-input-group", () => {
	console.warn = vi.fn();

	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Props", () => {
		describe("options", () => {
			describe("Anything but a non-empty array or non-empty object of options results in an empty array", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (non-empty)", "string"],
					["string (empty)", ""],
					["array (empty)", []],
					["object (empty)", {}],
					["null", null],
					["undefined", undefined],
				])("%s", ([, input]) => {
					const wrapper = mount({ options: input });
					const vm = wrapper.vm;

					expect(vm.internalOptions).toEqual([]);
				});
			});

			test("An array of strings", () => {
				const wrapper = mount({ options: ["one", "two"] });
				const vm = wrapper.vm;

				expect(vm.internalOptions).toEqual([
					expect.objectContaining({ label: "one", value: "one" }),
					expect.objectContaining({ label: "two", value: "two" }),
				]);
			});

			test("An array of numberes", () => {
				const wrapper = mount({ options: [1, 2] });
				const vm = wrapper.vm;

				expect(vm.internalOptions).toEqual([
					expect.objectContaining({ label: 1, value: 1 }),
					expect.objectContaining({ label: 2, value: 2 }),
				]);
			});

			test("A simple object has its key value pairs converted", () => {
				const wrapper = mount({
					options: [
						{ label: "One", value: "1" },
						{ label: "Two", value: "2" },
					],
				});

				const vm = wrapper.vm;

				expect(vm.internalOptions).toEqual([
					expect.objectContaining({ label: "One", value: "1" }),
					expect.objectContaining({ label: "Two", value: "2" }),
				]);
			});

			test('An array of objects with a "label" and a "value"', () => {
				const wrapper = mount({
					options: [
						{ label: "one", value: 1 },
						{ label: "two", value: 2 },
						{ label: "three", value: 3 },
					],
				});

				const vm = wrapper.vm;

				expect(vm.internalOptions).toEqual([
					expect.objectContaining({ label: "one", value: 1 }),
					expect.objectContaining({ label: "two", value: 2 }),
					expect.objectContaining({ label: "three", value: 3 }),
				]);
			});

			test('An array of objects with defined "labelKey" and a "valueKey"', () => {
				const wrapper = mount({
					options: [
						{ sport: "Tennis", score: 1 },
						{ sport: "Curling", score: 2 },
						{ sport: "Ice Hockey", score: 3 },
					],
					labelKey: "sport",
					valueKey: "score",
				});

				const vm = wrapper.vm;

				expect(vm.internalOptions).toEqual([
					expect.objectContaining({ label: "Tennis", value: 1 }),
					expect.objectContaining({ label: "Curling", value: 2 }),
					expect.objectContaining({ label: "Ice Hockey", value: 3 }),
				]);
			});

			test('An array of objects with a defined "descriptionKey"', () => {
				const wrapper = mount({
					options: [{ title: "One", id: "1", summary: "First option" }],
					labelKey: "title",
					valueKey: "id",
					descriptionKey: "summary",
				});

				const vm = wrapper.vm;

				expect(vm.internalOptions).toMatchObject([
					{
						description: "First option",
						label: "One",
						value: "1",
					},
				]);
			});

			test("Multiple option types can be combined", () => {
				const wrapper = mount({
					options: [{ label: "one", value: 1 }, "two", 3],
				});

				const vm = wrapper.vm;

				expect(vm.internalOptions).toEqual([
					expect.objectContaining({ label: "one", value: 1 }),
					expect.objectContaining({ label: "two", value: "two" }),
					expect.objectContaining({ label: 3, value: 3 }),
				]);
			});

			test("An object not containing a `label` property is ignored", () => {
				const wrapper = mount({
					options: [
						{ key: "one", value: 1 },
						{ key: "two", value: 2 },
						{ key: "three", value: 3 },
					],
				});

				const vm = wrapper.vm;

				expect(vm.internalOptions).toEqual([]);
			});

			test("An object not containing a `value` property is ignored", () => {
				const wrapper = mount({
					options: [
						{ label: "one", score: 1 },
						{ label: "two", score: 2 },
						{ label: "three", score: 3 },
					],
				});

				const vm = wrapper.vm;

				expect(vm.internalOptions).toEqual([]);
			});

			test('An object not containing a defined "labelKey" property is ignored', () => {
				const wrapper = mount({
					options: [
						{ label: "one", score: 1 },
						{ label: "two", score: 2 },
						{ label: "three", score: 3 },
					],
					labelKey: "sport",
				});

				const vm = wrapper.vm;

				expect(vm.internalOptions).toEqual([]);
			});

			test('An object not containing a defined "valueKey" property is ignored', () => {
				const wrapper = mount({
					options: [
						{ label: "one", value: 1 },
						{ label: "two", value: 2 },
						{ label: "three", value: 3 },
					],
					valueKey: "score",
				});

				const vm = wrapper.vm;

				expect(vm.internalOptions).toEqual([]);
			});
		});

		describe("required", () => {
			test("passes required to the legend label", () => {
				const wrapper = deepMount({ props: { required: true } });

				expect(wrapper.findComponent({ name: "FormLabel" }).props("required")).toBe(true);
			});

			test("does not mark the legend label as required by default", () => {
				const wrapper = deepMount();

				expect(wrapper.findComponent({ name: "FormLabel" }).props("required")).toBe(false);
			});
		});

		describe("type", () => {
			test("suppresses the optional indicator on the legend when type is checkbox", () => {
				const wrapper = deepMount({ props: { type: "checkbox" } });

				expect(wrapper.findComponent({ name: "FormLabel" }).props("showOptionalIndicator")).toBe(
					false,
				);
			});

			test("does not suppress the optional indicator on the legend when type is radio", () => {
				const wrapper = deepMount({ props: { type: "radio" } });

				expect(wrapper.findComponent({ name: "FormLabel" }).props("showOptionalIndicator")).toBe(
					true,
				);
			});
		});

		describe("variant", () => {
			test("marks selected and unselected cards with stable state attributes", () => {
				const wrapper = deepMount({
					props: {
						type: "radio",
						name: "flavour",
						modelValue: { flavour: "banana" },
						variant: "card",
					},
				});

				const options = wrapper.findAll('[data-test="form-input-group-option"]');

				expect(options[0].attributes("data-variant")).toBe("card");
				expect(options[0].attributes("data-position")).toBe("first");
				expect(options[0].attributes("data-state")).toBe("unselected");
				expect(options[1].attributes("data-variant")).toBe("card");
				expect(options[1].attributes("data-position")).toBe("middle");
				expect(options[1].attributes("data-state")).toBe("selected");
				expect(options[2].attributes("data-position")).toBe("last");
				expect(options[2].attributes("data-state")).toBe("unselected");
				expect(wrapper.get('[data-part="options"]').attributes("data-layout")).toBe("stacked");
			});

			test("marks selected and unselected non-card options with stable state attributes", () => {
				const wrapper = deepMount({
					props: {
						type: "radio",
						name: "flavour",
						modelValue: { flavour: "banana" },
					},
				});

				const options = wrapper.findAll('[data-test="form-input-group-option"]');

				expect(options[0].attributes("data-state")).toBe("unselected");
				expect(options[1].attributes("data-state")).toBe("selected");
				expect(options[2].attributes("data-state")).toBe("unselected");
			});
		});

		describe("optionClasses", () => {
			test.for([
				["a string", "rounded-lg", ["rounded-lg"]],
				["an array", ["rounded-lg", "p-4"], ["rounded-lg", "p-4"]],
				["an object", { "rounded-lg": true, "p-4": true }, ["rounded-lg", "p-4"]],
			])("merges %s with the option row classes", ([, optionClasses, customClasses]) => {
				const wrapper = deepMount({
					props: {
						optionClasses,
					},
				});

				const option = wrapper.get('[data-test="form-input-group-option"]');

				expect(option.classes()).toEqual(
					expect.arrayContaining(["group", "flex", ...customClasses]),
				);
			});
		});

		describe("Slots", () => {
			test("renders custom option content with selection details", () => {
				const wrapper = deepMount({
					props: {
						type: "radio",
						name: "flavour",
						modelValue: { flavour: "banana" },
					},
					slots: {
						option: ({ id, name, option, selected }) =>
							h(
								"span",
								{ "data-test": "custom-option" },
								`${option.value}:${selected}:${id}:${name}`,
							),
					},
				});

				const options = wrapper.findAll('[data-test="custom-option"]');

				expect(options).toHaveLength(3);
				expect(options[1].text()).toContain("banana:true");
				expect(options[1].text()).toContain(":flavour");
			});
		});
	});
});
