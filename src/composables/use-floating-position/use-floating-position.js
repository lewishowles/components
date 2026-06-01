import { computed, nextTick, onUnmounted, ref, unref } from "vue";

/**
 * Manages viewport-aware positioning for a floating panel relative to a trigger
 * element. Resolves placement (`"above"` / `"below"`) and alignment
 * (`"start"` / `"end"`), flipping each axis independently when the panel would
 * clip the viewport edge. If neither side fits, the preferred side is kept.
 *
 * Scroll and resize listeners are added on open and removed on close (or when
 * the component unmounts).
 *
 * @param  {object}  options
 *
 * @param  {object}  options.triggerElement
 *     A reactive ref resolving to the trigger DOM element, or a Vue component
 *     instance whose `$el` property points to the root DOM element.
 *
 * @param  {object}  options.panelElement
 *     A reactive ref resolving to the floating panel DOM element, or a Vue
 *     component instance whose `$el` property points to the root DOM element.
 *
 * @param  {string|object}  options.initialPlacement
 *     The preferred placement: `"above"` or `"below"`. Defaults to `"below"`.
 *
 * @param  {string|object}  options.initialAlign
 *     The preferred alignment: `"start"` or `"end"`. Defaults to `"start"`.
 */
export function useFloatingPosition({
	triggerElement,
	panelElement,
	initialPlacement,
	initialAlign,
}) {
	// The resolved placement after measuring available viewport space.
	const computedPlacement = ref(unref(initialPlacement));
	// The resolved alignment after measuring available viewport space.
	const computedAlign = ref(unref(initialAlign));
	// Whether the panel is hidden while positioning is being measured, to
	// prevent a layout flash while the panel jumps to its final position.
	const isPositioning = ref(false);

	// Pending requestAnimationFrame ID, used to throttle scroll and resize
	// handlers.
	let animationFrame = null;

	// The gap class to apply between the trigger and the panel, kept in sync
	// with the resolved placement.
	const placementClasses = computed(() => {
		if (computedPlacement.value === "above") {
			return "mb-3";
		}

		return "mt-3";
	});

	/**
	 * Resolve the DOM element from a ref that may point to either a raw DOM
	 * element or a Vue component instance (accessed via `$el`).
	 *
	 * @param  {object}  element
	 * @returns  {HTMLElement | null}
	 */
	function resolveElement(element) {
		const value = unref(element);

		return value?.$el ?? value ?? null;
	}

	/**
	 * Measure available viewport space around the trigger and flip placement or
	 * alignment when the panel would clip the viewport edge. Each axis is
	 * assessed independently; the preferred side is kept when neither fits.
	 */
	function updatePositioning() {
		const triggerEl = resolveElement(triggerElement);
		const panelEl = resolveElement(panelElement);

		if (!triggerEl || !panelEl) {
			return;
		}

		const triggerRect = triggerEl.getBoundingClientRect();
		const panelHeight = panelEl.offsetHeight;
		const panelWidth = panelEl.offsetWidth;

		const spaceBelow = window.innerHeight - triggerRect.bottom;
		const spaceAbove = triggerRect.top;
		const spaceFromStart = window.innerWidth - triggerRect.left;
		const spaceFromEnd = triggerRect.right;

		const fitsBelow = panelHeight <= spaceBelow;
		const fitsAbove = panelHeight <= spaceAbove;
		const fitsStart = panelWidth <= spaceFromStart;
		const fitsEnd = panelWidth <= spaceFromEnd;

		if (initialPlacement.value === "below") {
			computedPlacement.value = !fitsBelow && fitsAbove ? "above" : "below";
		} else {
			computedPlacement.value = !fitsAbove && fitsBelow ? "below" : "above";
		}

		if (initialAlign.value === "start") {
			computedAlign.value = !fitsStart && fitsEnd ? "end" : "start";
		} else {
			computedAlign.value = !fitsEnd && fitsStart ? "start" : "end";
		}
	}

	/**
	 * Ensure that positioning recalculates at most once per animation frame
	 * during scroll and resize.
	 */
	function schedulePositioningUpdate() {
		if (animationFrame !== null) {
			return;
		}

		animationFrame = requestAnimationFrame(() => {
			updatePositioning();

			animationFrame = null;
		});
	}

	/**
	 * Reset positioning state, measure available space, then reveal the panel.
	 * Also attaches scroll and resize listeners for the duration the panel is
	 * open. Call this when the floating panel opens.
	 */
	async function handleOpen() {
		computedPlacement.value = initialPlacement.value;
		computedAlign.value = initialAlign.value;
		isPositioning.value = true;

		await nextTick();

		updatePositioning();
		isPositioning.value = false;

		// Wait for the DOM update that removes the `invisible` class before
		// returning, so callers that focus panel children find a visible
		// element.
		await nextTick();

		window.addEventListener("scroll", schedulePositioningUpdate, { capture: true, passive: true });
		window.addEventListener("resize", schedulePositioningUpdate, { passive: true });
	}

	/**
	 * Remove scroll and resize listeners and cancel any pending animation
	 * frame. Call this when the floating panel closes.
	 */
	function handleClose() {
		window.removeEventListener("scroll", schedulePositioningUpdate, { capture: true });
		window.removeEventListener("resize", schedulePositioningUpdate);

		if (animationFrame !== null) {
			cancelAnimationFrame(animationFrame);
			animationFrame = null;
		}
	}

	// Clean up listeners if the component unmounts while the panel is open.
	onUnmounted(() => {
		handleClose();
	});

	return {
		computedPlacement,
		computedAlign,
		isPositioning,
		placementClasses,
		handleOpen,
		handleClose,
	};
}
