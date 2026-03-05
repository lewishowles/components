import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vitest";
import FormSelect from "./form-select.vue";

const mount = createMount(FormSelect);

describe("form-select", () => {
	console.warn = vi.fn();

	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
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
				const wrapper = mount({ options: [{ label: "One", value: "1" }, { label: "Two", value: "2" }] });
				const vm = wrapper.vm;

				expect(vm.internalOptions).toEqual([
					expect.objectContaining({ label: "One", value: "1" }),
					expect.objectContaining({ label: "Two", value: "2" }),
				]);
			});

			test("An array of objects with a \"label\" and a \"value\"", () => {
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

			test("An array of objects with defined \"labelKey\" and a \"valueKey\"", () => {
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

			test("Multiple option types can be combined", () => {
				const wrapper = mount({
					options: [
						{ label: "one", value: 1 },
						"two",
						3,
					],
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

			test("An object not containing a defined \"labelKey\" property is ignored", () => {
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

			test("An object not containing a defined \"valueKey\" property is ignored", () => {
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
	});
});
