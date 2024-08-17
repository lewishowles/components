import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import RadioGroup from "./radio-group.vue";

const defaultProps = { options: ["pineapple", "banana", "coconut"] };
const mount = createMount(RadioGroup, { props: defaultProps });

describe("radio-group", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("internalOptions", () => {
			test("should handle string[] options", () => {
				const wrapper = mount();

				expect(wrapper.vm.internalOptions).toEqual([
					{
						label: "pineapple",
						value: "pineapple",
						id: expect.any(String),
						first: true,
						last: false,
					},
					{
						label: "banana",
						value: "banana",
						id: expect.any(String),
						first: false,
						last: false,
					},
					{
						label: "coconut",
						value: "coconut",
						id: expect.any(String),
						first: false,
						last: true,
					},
				]);
			});

			test("should handle object[] options", () => {
				const wrapper = mount({ options: [{ label: "Chocolate", value: "chocolate" }, { label: "Vanilla", value: "vanilla" }, { label: "Strawberry", value: "strawberry" }] });

				expect(wrapper.vm.internalOptions).toEqual([
					{
						label: "Chocolate",
						value: "chocolate",
						id: expect.any(String),
						first: true,
						last: false,
					},
					{
						label: "Vanilla",
						value: "vanilla",
						id: expect.any(String),
						first: false,
						last: false,
					},
					{
						label: "Strawberry",
						value: "strawberry",
						id: expect.any(String),
						first: false,
						last: true,
					},
				]);
			});

			test("should handle object options", () => {
				const wrapper = mount({ options: { chocolate: "Chocolate", vanilla: "Vanilla", strawberry: "Strawberry" } });

				expect(wrapper.vm.internalOptions).toEqual([
					{
						label: "Chocolate",
						value: "chocolate",
						id: expect.any(String),
						first: true,
						last: false,
					},
					{
						label: "Vanilla",
						value: "vanilla",
						id: expect.any(String),
						first: false,
						last: false,
					},
					{
						label: "Strawberry",
						value: "strawberry",
						id: expect.any(String),
						first: false,
						last: true,
					},
				]);
			});
		});
	});
});
