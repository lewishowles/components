import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, ref } from "vue";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { useResponsiveFloatingPanel } from "./use-responsive-floating-panel.js";

// Stand in for the screen-width media query so each test can switch between
// wide and narrow screens and check which query the panel asks for.
const { isNarrow, useMediaQuery } = await vi.hoisted(async () => {
	const { ref } = await import("vue");
	const isNarrow = ref(false);

	return { isNarrow, useMediaQuery: vi.fn(() => isNarrow) };
});

vi.mock("@vueuse/core", async (importOriginal) => ({
	...(await importOriginal()),
	useMediaQuery,
}));

describe("useResponsiveFloatingPanel", () => {
	let wrapper;

	beforeEach(() => {
		isNarrow.value = false;
		vi.spyOn(window, "addEventListener");
		vi.spyOn(window, "removeEventListener");
		vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 1);
		vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
	});

	afterEach(() => {
		wrapper?.unmount();
		wrapper = undefined;
		vi.restoreAllMocks();
	});

	/**
	 * Mount the composable with reactive open state so its watcher runs inside
	 * a component lifecycle.
	 *
	 * @param  {boolean}  open
	 *     Whether the panel starts open.
	 * @returns  {object}
	 *     The state and values needed to drive the panel through viewport changes.
	 */
	function mountPanel(open = false) {
		const isOpen = ref(open);

		let panel;

		wrapper = mount(
			defineComponent({
				setup() {
					panel = useResponsiveFloatingPanel({
						isOpen,
						triggerElement: ref(null),
						panelElement: ref(null),
						initialPlacement: ref("above"),
						initialAlign: ref("end"),
					});

					return () => h("div");
				},
			}),
		);

		return { isOpen, panel };
	}

	test("uses the shared breakpoint and forwards floating position state", () => {
		const { panel } = mountPanel();

		expect(useMediaQuery).toHaveBeenCalledWith("(width < 1024px)");
		expect(panel.isNarrow).toBe(isNarrow);
		expect(panel.computedPlacement.value).toBe("above");
		expect(panel.computedAlign.value).toBe("end");
	});

	test("stops positioning when an open wide panel closes", async () => {
		const { isOpen, panel } = mountPanel(true);

		await panel.handleOpen();

		isOpen.value = false;

		await nextTick();

		expect(window.removeEventListener).toHaveBeenCalledWith("scroll", expect.any(Function), {
			capture: true,
		});
		expect(window.removeEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
	});

	test("stops positioning when an open wide panel becomes narrow", async () => {
		const { panel } = mountPanel(true);

		await panel.handleOpen();

		isNarrow.value = true;

		await nextTick();

		expect(window.removeEventListener).toHaveBeenCalledWith("scroll", expect.any(Function), {
			capture: true,
		});
	});

	test("positions an open panel when the viewport becomes wide", async () => {
		isNarrow.value = true;
		mountPanel(true);

		isNarrow.value = false;

		await nextTick();
		await flushPromises();

		expect(window.addEventListener).toHaveBeenCalledWith("scroll", expect.any(Function), {
			capture: true,
			passive: true,
		});
	});

	test("does not position a closed panel when the viewport becomes wide", async () => {
		isNarrow.value = true;
		mountPanel();

		isNarrow.value = false;

		await nextTick();

		expect(window.addEventListener).not.toHaveBeenCalledWith(
			"scroll",
			expect.any(Function),
			expect.anything(),
		);
	});
});
