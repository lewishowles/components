import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import { nextTick } from "vue";
import UiButton from "./ui-button.vue";

const mount = createMount(UiButton);

describe("ui-button", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("attributes", () => {
			describe("aria-busy", () => {
				test("Should set aria-busy to 'true' when reacting", () => {
					const wrapper = mount({ reactive: true });

					wrapper.vm.isReacting = true;

					expect(wrapper.vm.attributes["aria-busy"]).toBe("true");
				});

				test("Should not set aria-busy when not reacting", () => {
					const wrapper = mount({ reactive: true });

					expect(wrapper.vm.attributes["aria-busy"]).toBeUndefined();
				});
			});

			describe("aria-disabled", () => {
				test("Should set aria-disabled to 'true' when disabled", () => {
					const wrapper = mount({ disabled: true });

					expect(wrapper.vm.attributes["aria-disabled"]).toBe("true");
				});

				test("Should not set aria-disabled when not disabled", () => {
					const wrapper = mount();

					expect(wrapper.vm.attributes["aria-disabled"]).toBeUndefined();
				});

				test("Should not set the native disabled attribute when disabled", () => {
					const wrapper = mount({ disabled: true });

					expect(wrapper.vm.attributes["disabled"]).toBeUndefined();
				});
			});

			describe("aria-pressed", () => {
				test("Should set aria-pressed to 'true' when pressed is true", () => {
					const wrapper = mount({ pressed: true });

					expect(wrapper.vm.attributes["aria-pressed"]).toBe("true");
				});

				test("Should set aria-pressed to 'false' when pressed is false", () => {
					const wrapper = mount({ pressed: false });

					expect(wrapper.vm.attributes["aria-pressed"]).toBe("false");
				});

				test("Should not set aria-pressed when pressed is null", () => {
					const wrapper = mount();

					expect(wrapper.vm.attributes["aria-pressed"]).toBeUndefined();
				});
			});
		});

		describe("computedIconClasses", () => {
			test("should return undefined without an icon", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.computedIconClasses).toBe(undefined);
			});

			test("should return base classes if no icon classes are defined", () => {
				const wrapper = mount({ iconStart: "icon-arrow-left" });
				const vm = wrapper.vm;

				expect(vm.computedIconClasses).toEqual(["stroke-current", "inline-block align-[0]", "size-[0.857em]"]);
			});

			test("should return base classes combined with provided classes if no size is defined", () => {
				const wrapper = mount({ iconStart: "icon-arrow-left", iconClasses: "rounded-full" });
				const vm = wrapper.vm;

				expect(vm.computedIconClasses).toEqual(["rounded-full", "stroke-current", "size-[0.857em]"]);
			});

			test("should return the correct combined classes if a size is defined", () => {
				const wrapper = mount({ iconStart: "icon-arrow-left", iconClasses: "size-4" });
				const vm = wrapper.vm;

				expect(vm.computedIconClasses).toEqual(["size-4", "stroke-current"]);
			});

			test("should return the correct combined classes if a stroke is defined", () => {
				const wrapper = mount({ iconStart: "icon-arrow-left", iconClasses: "stroke-purple-600" });
				const vm = wrapper.vm;

				expect(vm.computedIconClasses).toEqual(["stroke-purple-600", "size-[0.857em]"]);
			});
		});
	});

	describe("Methods", () => {
		describe("react", () => {
			test("should set the reactive state", () => {
				const wrapper = mount({ reactive: true });
				const vm = wrapper.vm;

				vm.react();

				expect(vm.isReacting).toBe(true);
			});
		});

		describe("reset", () => {
			test("should reset reactive state", () => {
				const wrapper = mount({ reactive: true });
				const vm = wrapper.vm;

				vm.isReacting = true;

				vm.reset();

				expect(vm.isReacting).toBe(false);
			});
		});

		describe("loadingAuto", () => {
			test("Should enter loading state when the click handler returns a Promise", async () => {
				let resolve;

				const promise = new Promise(r => { resolve = r; });
				const wrapper = mount({ loadingAuto: true, reactive: true, onClick: () => promise });

				await wrapper.trigger("click");

				expect(wrapper.vm.isReacting).toBe(true);

				resolve();
				await promise;
				await nextTick();

				expect(wrapper.vm.isReacting).toBe(false);
			});

			test("Should auto-reset when the Promise rejects", async () => {
				let reject;

				const promise = new Promise((_, r) => { reject = r; });
				const wrapper = mount({ loadingAuto: true, reactive: true, onClick: () => promise });

				await wrapper.trigger("click");

				expect(wrapper.vm.isReacting).toBe(true);

				reject(new Error("failed"));
				await promise.catch(() => {});
				await nextTick();

				expect(wrapper.vm.isReacting).toBe(false);
			});

			test("Should remain in loading state when the click handler does not return a Promise", async () => {
				const wrapper = mount({ loadingAuto: true, reactive: true, onClick: () => "sync result" });

				await wrapper.trigger("click");

				expect(wrapper.vm.isReacting).toBe(true);
			});
		});
	});
});
