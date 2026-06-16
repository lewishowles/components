import type { Ref } from "vue";

export declare function useFormData<T>(
	source: Ref<T | null | undefined>,
	mapper: (value: T) => Record<string, unknown>,
): Ref<Record<string, unknown>>;
