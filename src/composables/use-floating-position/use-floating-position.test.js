import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { defineComponent, h, ref } from "vue";
import { mount } from "@vue/test-utils";
import { useFloatingPosition } from "./use-floating-position.js";

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

	describe("Initialisation", () => {
		test("Initialises", () => {
			const { instance } = createComposable();

			expect(instance).toBeTypeOf("object");
		});

		test("computedPlacement matches initialPlacement", () => {
			const { instance } = createComposable({ placement: "above" });

			expect(instance.computedPlacement.value).toBe("above");
		});

		test("computedAlign matches initialAlign", () => {
			const { instance } = createComposable({ align: "end" });

			expect(instance.computedAlign.value).toBe("end");
		});

		test("isPositioning is false on creation", () => {
			const { instance } = createComposable();

			expect(instance.isPositioning.value).toBe(false);
		});
	});

	describe("Computed", () => {
		describe("placementClasses", () => {
			test("Returns mt-3 when placed below", () => {
				const { instance } = createComposable({ placement: "below" });

				expect(instance.placementClasses.value).toBe("mt-3");
			});

			test("Returns mb-3 when placed above", () => {
				const { instance } = createComposable();

				instance.computedPlacement.value = "above";

				expect(instance.placementClasses.value).toBe("mb-3");
			});
		});
	});

	describe("Methods", () => {
		describe("handleOpen", () => {
			test("Attaches scroll and resize listeners", async () => {
				const { instance } = createComposable();

				await instance.handleOpen();

				expect(window.addEventListener).toHaveBeenCalledWith("scroll", expect.any(Function), {
					capture: true,
					passive: true,
				});

				expect(window.addEventListener).toHaveBeenCalledWith("resize", expect.any(Function), {
					passive: true,
				});
			});

			test("isPositioning is false after positioning completes", async () => {
				const { instance } = createComposable();

				await instance.handleOpen();

				expect(instance.isPositioning.value).toBe(false);
			});

			describe("Placement resolution", () => {
				test("Keeps preferred placement below when there is enough space", async () => {
					const { instance } = createComposable({
						placement: "below",
						trigger: { top: 0, bottom: 50 },
						panel: { height: 100 },
					});

					await instance.handleOpen();

					expect(instance.computedPlacement.value).toBe("below");
				});

				test("Flips to above when there is not enough space below", async () => {
					const { instance } = createComposable({
						placement: "below",
						trigger: { top: 500, bottom: 550 },
						panel: { height: 100 },
					});

					await instance.handleOpen();

					expect(instance.computedPlacement.value).toBe("above");
				});

				test("Keeps preferred placement below when neither side fits", async () => {
					vi.stubGlobal("innerHeight", 60);

					const { instance } = createComposable({
						placement: "below",
						trigger: { top: 30, bottom: 50 },
						panel: { height: 100 },
					});

					await instance.handleOpen();

					expect(instance.computedPlacement.value).toBe("below");
				});

				test("Flips to below when preferred above but not enough space above", async () => {
					const { instance } = createComposable({
						placement: "above",
						trigger: { top: 20, bottom: 70 },
						panel: { height: 100 },
					});

					await instance.handleOpen();

					expect(instance.computedPlacement.value).toBe("below");
				});
			});

			describe("Alignment resolution", () => {
				test("Keeps start alignment when there is enough space", async () => {
					const { instance } = createComposable({
						align: "start",
						trigger: { left: 0, right: 200 },
						panel: { width: 100 },
					});

					await instance.handleOpen();

					expect(instance.computedAlign.value).toBe("start");
				});

				test("Flips to end when there is not enough space from start", async () => {
					const { instance } = createComposable({
						align: "start",
						trigger: { left: 700, right: 800 },
						panel: { width: 200 },
					});

					await instance.handleOpen();

					expect(instance.computedAlign.value).toBe("end");
				});

				test("Keeps preferred start alignment when neither side fits", async () => {
					vi.stubGlobal("innerWidth", 150);

					const { instance } = createComposable({
						align: "start",
						trigger: { left: 50, right: 100 },
						panel: { width: 200 },
					});

					await instance.handleOpen();

					expect(instance.computedAlign.value).toBe("start");
				});
			});
		});

		describe("handleClose", () => {
			test("Removes scroll and resize listeners", async () => {
				const { instance } = createComposable();

				await instance.handleOpen();
				instance.handleClose();

				expect(window.removeEventListener).toHaveBeenCalledWith("scroll", expect.any(Function), {
					capture: true,
				});

				expect(window.removeEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
			});
		});
	});

	describe("Lifecycle", () => {
		test("Removes scroll listener on unmount", async () => {
			const { instance, wrapper } = createComposable();

			await instance.handleOpen();
			wrapper.unmount();

			expect(window.removeEventListener).toHaveBeenCalledWith("scroll", expect.any(Function), {
				capture: true,
			});
		});

		test("Removes resize listener on unmount", async () => {
			const { instance, wrapper } = createComposable();

			await instance.handleOpen();
			wrapper.unmount();

			expect(window.removeEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
		});
	});
});

// Create a test instance of the composable that always mounts in a component
// context. Returns both the composable instance and the wrapper for lifecycle
// testing.
function createComposable({ placement = "below", align = "start", trigger = {}, panel = {} } = {}) {
	const props = {
		triggerElement: ref(createMockElement(trigger)),
		panelElement: ref(createMockElement(panel)),
		initialPlacement: ref(placement),
		initialAlign: ref(align),
	};

	let composableInstance;

	const component = defineComponent({
		setup() {
			composableInstance = useFloatingPosition(props);

			return () => h("div");
		},
	});

	const wrapper = mount(component);

	return {
		instance: composableInstance,
		wrapper,
	};
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
