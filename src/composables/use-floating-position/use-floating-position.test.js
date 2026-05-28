import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { defineComponent, h, ref } from "vue";
import { mount } from "@vue/test-utils";
import { useFloatingPosition } from "./use-floating-position.js";

// A minimal component wrapper for testing lifecycle-dependent behaviour.
function createWrapperComponent(options = {}) {
	return defineComponent({
		setup() {
			useFloatingPosition({
				triggerElement: ref(createMockElement(options.trigger)),
				panelElement: ref(createMockElement(options.panel)),
				initialPlacement: ref(options.placement ?? "below"),
				initialAlign: ref(options.align ?? "start"),
			});

			return () => h("div");
		},
	});
}

// Create a mock DOM element for testing viewport calculations.
function createMockElement({
	height = 50,
	width = 100,
	top = 0,
	right = 200,
	bottom = 50,
	left = 0,
} = {}) {
	return {
		getBoundingClientRect: () => ({ top, right, bottom, left }),
		offsetHeight: height,
		offsetWidth: width,
	};
}

// Instantiate the composable directly with controlled inputs.
function createComposable({ placement = "below", align = "start", trigger = {}, panel = {} } = {}) {
	return useFloatingPosition({
		triggerElement: ref(createMockElement(trigger)),
		panelElement: ref(createMockElement(panel)),
		initialPlacement: ref(placement),
		initialAlign: ref(align),
	});
}

describe("useFloatingPosition", () => {
	beforeEach(() => {
		vi.stubGlobal("innerHeight", 600);
		vi.stubGlobal("innerWidth", 800);
		vi.spyOn(window, "addEventListener").mockImplementation(() => {});
		vi.spyOn(window, "removeEventListener").mockImplementation(() => {});
		vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
			callback();

			return 1;
		});
		vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	test("Initialises", () => {
		const result = createComposable();

		expect(result).toBeTypeOf("object");
	});

	describe("Initialisation", () => {
		test("computedPlacement reflects initialPlacement", () => {
			const { computedPlacement } = createComposable({ placement: "above" });

			expect(computedPlacement.value).toBe("above");
		});

		test("computedAlign reflects initialAlign", () => {
			const { computedAlign } = createComposable({ align: "end" });

			expect(computedAlign.value).toBe("end");
		});

		test("isPositioning is false on creation", () => {
			const { isPositioning } = createComposable();

			expect(isPositioning.value).toBe(false);
		});
	});

	describe("Computed", () => {
		describe("placementClasses", () => {
			test("Returns mt-3 when placed below", () => {
				const { placementClasses } = createComposable({ placement: "below" });

				expect(placementClasses.value).toBe("mt-3");
			});

			test("Returns mb-3 when placed above", () => {
				const { computedPlacement, placementClasses } = createComposable();

				computedPlacement.value = "above";

				expect(placementClasses.value).toBe("mb-3");
			});
		});
	});

	describe("Methods", () => {
		describe("handleOpen", () => {
			test("Attaches scroll and resize listeners", async () => {
				const { handleOpen } = createComposable();

				await handleOpen();

				expect(window.addEventListener).toHaveBeenCalledWith("scroll", expect.any(Function), {
					capture: true,
					passive: true,
				});

				expect(window.addEventListener).toHaveBeenCalledWith("resize", expect.any(Function), {
					passive: true,
				});
			});

			test("isPositioning is false after positioning completes", async () => {
				const { handleOpen, isPositioning } = createComposable();

				await handleOpen();

				expect(isPositioning.value).toBe(false);
			});

			describe("Placement resolution", () => {
				test("Keeps preferred placement below when there is enough space", async () => {
					const { handleOpen, computedPlacement } = createComposable({
						placement: "below",
						trigger: { top: 0, bottom: 50 },
						panel: { height: 100 },
					});

					await handleOpen();

					expect(computedPlacement.value).toBe("below");
				});

				test("Flips to above when there is not enough space below", async () => {
					// Trigger near the bottom — panel fits above but not below.
					const { handleOpen, computedPlacement } = createComposable({
						placement: "below",
						trigger: { top: 500, bottom: 550 },
						panel: { height: 100 },
					});

					await handleOpen();

					expect(computedPlacement.value).toBe("above");
				});

				test("Keeps preferred placement below when neither side fits", async () => {
					vi.stubGlobal("innerHeight", 60);

					const { handleOpen, computedPlacement } = createComposable({
						placement: "below",
						trigger: { top: 30, bottom: 50 },
						panel: { height: 100 },
					});

					await handleOpen();

					expect(computedPlacement.value).toBe("below");
				});

				test("Flips to below when preferred above but not enough space above", async () => {
					const { handleOpen, computedPlacement } = createComposable({
						placement: "above",
						trigger: { top: 20, bottom: 70 },
						panel: { height: 100 },
					});

					await handleOpen();

					expect(computedPlacement.value).toBe("below");
				});
			});

			describe("Alignment resolution", () => {
				test("Keeps start alignment when there is enough space", async () => {
					const { handleOpen, computedAlign } = createComposable({
						align: "start",
						trigger: { left: 0, right: 200 },
						panel: { width: 100 },
					});

					await handleOpen();

					expect(computedAlign.value).toBe("start");
				});

				test("Flips to end when there is not enough space from start", async () => {
					// Trigger near the right edge — panel fits from end but not start.
					const { handleOpen, computedAlign } = createComposable({
						align: "start",
						trigger: { left: 700, right: 800 },
						panel: { width: 200 },
					});

					await handleOpen();

					expect(computedAlign.value).toBe("end");
				});

				test("Keeps preferred start alignment when neither side fits", async () => {
					vi.stubGlobal("innerWidth", 150);

					const { handleOpen, computedAlign } = createComposable({
						align: "start",
						trigger: { left: 50, right: 100 },
						panel: { width: 200 },
					});

					await handleOpen();

					expect(computedAlign.value).toBe("start");
				});
			});
		});

		describe("handleClose", () => {
			test("Removes scroll and resize listeners", async () => {
				const { handleOpen, handleClose } = createComposable();

				await handleOpen();
				handleClose();

				expect(window.removeEventListener).toHaveBeenCalledWith("scroll", expect.any(Function), {
					capture: true,
				});

				expect(window.removeEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
			});
		});
	});

	describe("Lifecycle", () => {
		test("Removes listeners on unmount", async () => {
			const wrapper = mount(createWrapperComponent());

			wrapper.unmount();

			expect(window.removeEventListener).toHaveBeenCalledWith("scroll", expect.any(Function), {
				capture: true,
			});

			expect(window.removeEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
		});
	});
});
