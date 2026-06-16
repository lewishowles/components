import type { ComputedRef, Ref } from "vue";

type MaybeRefOrGetter<T> = T | Ref<T> | (() => T);

interface ChartSegment {
	label: string;
	value: number;
}

interface ChartSeriesEntry {
	color: string;
	label: string;
	value: number;
}

export declare function useChartConfig(segments: MaybeRefOrGetter<ChartSegment[]>): {
	getColor(index: number): string;
	series: ComputedRef<ChartSeriesEntry[]>;
};
