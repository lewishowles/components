import type { ComputedRef, MaybeRefOrGetter, Ref } from "vue";

type FieldType = "nullable-number" | "nullable-string";

interface FormField {
	name: string;
	id: string;
	triggerFocus?: () => void;
}

interface ErrorSummaryEntry {
	fieldName: string;
	id: string;
	message: string;
}

type FormDataMapper<T> =
	| ((value: T) => Record<string, unknown>)
	| {
			fields?: string[] | Record<string, string>;
			fieldTypes?: Record<string, FieldType>;
	  };

interface UseFormOptions<T = unknown> {
	initialData?: MaybeRefOrGetter<Record<string, unknown> | T | null | undefined>;
	mapper?: FormDataMapper<T>;
	fieldTypes?: MaybeRefOrGetter<Record<string, FieldType> | undefined>;
	fieldErrors?: MaybeRefOrGetter<Record<string, string | string[]> | undefined>;
	rules?: MaybeRefOrGetter<Record<string, unknown[]> | undefined>;
	onSubmit?: (data: Record<string, unknown>) => unknown;
	submitErrorsCallback?:
		| Ref<((error: unknown) => Record<string, unknown> | null | undefined) | null>
		| ((error: unknown) => Record<string, unknown> | null | undefined)
		| null;
	updatePageTitleOnError?: MaybeRefOrGetter<boolean | undefined>;
	pageTitleErrorPrefix?: MaybeRefOrGetter<string | undefined>;
	readonly?: MaybeRefOrGetter<boolean | undefined>;
	errorSummaryElement?: Ref<HTMLElement | null>;
	generalErrorsElement?: Ref<{ $el: HTMLElement } | null>;
	submitButtonRef?: Ref<{ reset: () => void } | null>;
}

interface BindableForm {
	modelValue: Record<string, unknown>;
	"onUpdate:modelValue": (value: Record<string, unknown>) => void;
	rules: Record<string, unknown[]> | undefined;
	onSubmit: ((data: Record<string, unknown>) => unknown) | undefined;
}

interface UseFormReturn {
	form: ComputedRef<BindableForm>;
	formData: Ref<Record<string, unknown>>;
	formFields: Record<string, FormField>;
	haveFormFields: ComputedRef<boolean>;
	submitErrors: Ref<Record<string, string | string[]>>;
	formLevelErrors: Ref<Record<string, string[]>>;
	generalSubmitErrors: ComputedRef<string[]>;
	haveGeneralSubmitErrors: ComputedRef<boolean>;
	errorSummary: ComputedRef<ErrorSummaryEntry[]>;
	haveErrorSummary: ComputedRef<boolean>;
	isSubmitting: Ref<boolean>;
	isReadonly: ComputedRef<boolean>;
	registerField: (field: FormField) => Promise<void>;
	updateFieldValue: (name: string, value: unknown) => Promise<void>;
	fieldErrorsFor: (fieldName: string) => string[];
	handleFormSubmit: () => Promise<void>;
	handleSubmitError: (error: unknown) => Promise<void>;
	resetSubmitButton: () => void;
	focusField: (fieldName: string) => void;
	isFieldRequired: (fieldName: string) => boolean;
	getSubmitData: () => Record<string, unknown>;
}

export declare function normaliseForSubmit(
	data: Record<string, unknown>,
	fieldTypes: Record<string, FieldType>,
): Record<string, unknown>;

export declare function useForm<T = unknown>(options: UseFormOptions<T>): UseFormReturn;
