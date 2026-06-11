import { computed, toValue } from "vue";
import { isNonEmptyArray } from "@lewishowles/helpers/array";

// The number of chart colour tokens defined in theme.css.
const PALETTE_SIZE = 8;

/**
 * `useChartConfig` extends a list of chart segments with colours from the
 * library's accessible chart palette, making them ready for both visual
 * rendering and legend display.
 *
 * Colours are assigned by position and wrap when the segment count exceeds the
 * palette size. Any `--color-chart-N` token can be overridden in `:root` to
 * re-theme charts.
 *
 * @param  {Array|object|Function}  segments
 *     The chart segments as a plain array, a ref, or a getter. Each entry
 *     must have `label` and `value` properties.
 */
export function useChartConfig(segments) {
	// The internal segments, derived from the provided segments.
	const resolvedSegments = computed(() => {
		const items = toValue(segments);

		if (!isNonEmptyArray(items)) {
			return [];
		}

		return items;
	});

	// The extended series — each segment paired with its chart colour.
	const series = computed(() =>
		resolvedSegments.value.map((segment, index) => ({
			color: getColor(index),
			label: segment.label,
			value: segment.value,
		})),
	);

	/**
	 * Get the CSS variable for the chart colour at the given index, wrapping
	 * when the index exceeds the palette size.
	 *
	 * @param  {number}  index
	 *     The zero-based segment index.
	 * @returns  {string}
	 */
	function getColor(index) {
		return `var(--color-chart-${(index % PALETTE_SIZE) + 1})`;
	}

	return { getColor, series };
}
