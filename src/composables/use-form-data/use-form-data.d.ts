import type { Ref } from "vue";

type FieldType = "nullable-number" | "nullable-string";

type FormDataOptions<T> = {
	fields?: string[] | Record<string, string>;
	fieldTypes?: Record<string, FieldType>;
};

export declare function useFormData<T>(
	source: Ref<T | null | undefined>,
	mapper: (value: T) => Record<string, unknown>,
): Ref<Record<string, unknown>>;

export declare function useFormData<T>(
	source: Ref<T | null | undefined>,
	options: FormDataOptions<T>,
): Ref<Record<string, unknown>>;

export declare function useFormData<T>(
	source: Ref<T | null | undefined>,
): Ref<Record<string, unknown>>;

export declare function mapFormData<T>(
	value: T,
	mapper: (value: T) => Record<string, unknown>,
): Record<string, unknown>;

export declare function mapFormData<T>(
	value: T,
	options: FormDataOptions<T>,
): Record<string, unknown>;

export declare function mapFormData<T>(value: T): Record<string, unknown>;
