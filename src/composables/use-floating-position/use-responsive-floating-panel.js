import { useMediaQuery } from "@vueuse/core";
import { nextTick, watch } from "vue";
import { useFloatingPosition } from "./use-floating-position.js";

/**
 * Position a floating panel next to its trigger on wide screens, and report
 * whether the screen is narrower than 1024px so the component can show an
 * overlay sheet instead. Positioning stops when the panel closes or the screen
 * becomes narrow, and starts again when an open panel returns to a wide
 * screen. The component still calls handleOpen itself when it first opens on
 * a wide screen.
 *
 * @param  {object}  options
 *     The panel state, elements, and preferred position.
 * @param  {object}  options.isOpen
 *     A ref indicating whether the owning component is open.
 * @param  {object}  options.triggerElement
 *     A ref resolving to the trigger element.
 * @param  {object}  options.panelElement
 *     A ref resolving to the panel element.
 * @param  {string|object}  options.initialPlacement
 *     The preferred placement above or below the trigger.
 * @param  {string|object}  options.initialAlign
 *     The preferred alignment to the start or end of the trigger.
 * @returns  {object}
 *     The narrow state and the floating position values and handlers.
 */
export function useResponsiveFloatingPanel({
	isOpen,
	triggerElement,
	panelElement,
	initialPlacement,
	initialAlign,
}) {
	// Whether the screen is narrower than 1024px, where the component shows an
	// overlay sheet in place of the floating panel.
	const isNarrow = useMediaQuery("(width < 1024px)");

	// The panel's placement next to its trigger, used on wide screens only.
	const floatingPosition = useFloatingPosition({
		triggerElement,
		panelElement,
		initialPlacement,
		initialAlign,
	});

	// Stop positioning when the panel closes or the screen becomes narrow. When
	// an open panel returns to a wide screen, wait for it to render in place of
	// the sheet before measuring it.
	watch(
		[isOpen, isNarrow],
		async ([open, narrow], [, wasNarrow]) => {
			if (!open) {
				floatingPosition.handleClose();

				return;
			}

			if (narrow) {
				if (!wasNarrow) {
					floatingPosition.handleClose();
				}

				return;
			}

			if (wasNarrow) {
				await nextTick();

				if (isOpen.value && !isNarrow.value) {
					await floatingPosition.handleOpen();
				}
			}
		},
		{ flush: "post" },
	);

	return { isNarrow, ...floatingPosition };
}
