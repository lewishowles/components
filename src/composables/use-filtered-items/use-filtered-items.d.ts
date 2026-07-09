import type { ComputedRef, Ref } from "vue";

type MaybeRefOrGetter<T> = T | Ref<T> | (() => T);

type FilterValue = unknown | unknown[];

export declare function useFilteredItems<T extends object = object>(
	items: MaybeRefOrGetter<T[]>,
	filters?: MaybeRefOrGetter<Record<string, FilterValue>>,
): {
	count: ComputedRef<number>;
	have: ComputedRef<boolean>;
	items: ComputedRef<T[]>;
};
