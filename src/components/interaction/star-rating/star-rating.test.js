import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vitest";
import StarRating from "./star-rating.vue";

const mount = createMount(StarRating);

describe("star-rating", () => {
	console.warn = vi.fn();

	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("isStar", () => {
			describe("should default to star when receiving an invalid shape", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (empty)", ""],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["array (non-empty)", [1, 2, 3]],
					["array (empty)", []],
					["null", null],
					["undefined", undefined],
				])("%s", ([, shape]) => {
					const wrapper = mount({ shape });
					const vm = wrapper.vm;

					expect(vm.isStar).toBe(true);
				});
			});

			test("should default to star if an unknown shape is provided", () => {
				const wrapper = mount({ shape: "pineapple" });
				const vm = wrapper.vm;

				expect(vm.isStar).toBe(true);
			});

			test("should allow the heart shape to be chosen", () => {
				const wrapper = mount({ shape: "heart" });
				const vm = wrapper.vm;

				expect(vm.isStar).toBe(false);
				expect(vm.isHeart).toBe(true);
			});
		});
	});

	describe("Methods", () => {
		describe("ratingIsHighlighted", () => {
			test("should return true if the value is less than or equal to the highlighted value", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.highlightedValue = 3;
				vm.model = 1;

				expect(vm.ratingIsHighlighted(3)).toBe(true);
				expect(vm.ratingIsHighlighted(2)).toBe(true);
			});

			test("should return false if the value is less than or equal to the current model value", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.highlightedValue = 1;
				vm.model = 3;

				expect(vm.ratingIsHighlighted(3)).toBe(false);
				expect(vm.ratingIsHighlighted(2)).toBe(false);
				expect(vm.ratingIsHighlighted(1)).toBe(false);
			});
		});

		describe("ratingIsSelected", () => {
			test("should return true if the value is less than or equal to the model value", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.model = 3;

				expect(vm.ratingIsSelected(3)).toBe(true);
				expect(vm.ratingIsSelected(2)).toBe(true);
				expect(vm.ratingIsSelected(1)).toBe(true);
			});

			test("should return false if the value is greater than the selected value", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.model = 2;

				expect(vm.ratingIsSelected(3)).toBe(false);
			});
		});

		describe("ratingIsInert", () => {
			test("should return true if the value is greater than the selected value", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.model = 2;

				expect(vm.ratingIsInert(3)).toBe(true);
			});

			test("should return false if the value is less than or equal to the selected value", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.model = 3;

				expect(vm.ratingIsInert(3)).toBe(false);
				expect(vm.ratingIsInert(2)).toBe(false);
				expect(vm.ratingIsInert(1)).toBe(false);
			});

			test("should return true if the value is greater than the highlighted value", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.highlightedValue = 2;

				expect(vm.ratingIsInert(3)).toBe(true);
			});

			test("should return false if the value is less than or equal to the highlighted value", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.highlightedValue = 3;

				expect(vm.ratingIsInert(3)).toBe(false);
				expect(vm.ratingIsInert(2)).toBe(false);
				expect(vm.ratingIsInert(1)).toBe(false);
			});

			test("should return true if the value is greater than both the selected and highlighted value", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.model = 1;
				vm.highlightedValue = 2;

				expect(vm.ratingIsInert(3)).toBe(true);
			});
		});
	});
});
