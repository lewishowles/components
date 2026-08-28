import type { ComputedRef, MaybeRefOrGetter, Ref } from "vue";

type FieldType = "nullable-number" | "nullable-string";

export type FormStatus = {
	type: "success" | "error";
	message?: string;
};

type SubmitSuccessCallback = (result: unknown, data: Record<string, unknown>) => unknown;
type SubmitErrorCallback = (error: unknown, data: Record<string, unknown>) => unknown;
type SubmitSettledCallback = (
	result: unknown | undefined,
	error: unknown | undefined,
	data: Record<string, unknown>,
) => unknown;

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

interface ValidateOptions {
	focus?: boolean;
	scoped?: boolean;
}

interface StandardSchemaLike {
	"~standard": {
		validate: (value: unknown) => unknown;
	};
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
	recordId?: MaybeRefOrGetter<string | number | null | undefined>;
	unsavedChangesGuard?: boolean;
	fieldTypes?: MaybeRefOrGetter<Record<string, FieldType> | undefined>;
	fieldErrors?: MaybeRefOrGetter<Record<string, string | string[]> | undefined>;
	rules?: MaybeRefOrGetter<Record<string, unknown[]> | undefined>;
	schema?: MaybeRefOrGetter<StandardSchemaLike | undefined>;
	onSubmit?: (data: Record<string, unknown>) => unknown;
	onSuccess?: Ref<SubmitSuccessCallback | null> | SubmitSuccessCallback;
	onError?: Ref<SubmitErrorCallback | null> | SubmitErrorCallback;
	onSettled?: Ref<SubmitSettledCallback | null> | SubmitSettledCallback;
	submitErrorsCallback?:
		| Ref<((error: unknown) => Record<string, unknown> | null | undefined) | null>
		| ((error: unknown) => Record<string, unknown> | null | undefined)
		| null;
	updatePageTitleOnError?: MaybeRefOrGetter<boolean | undefined>;
	pageTitleErrorPrefix?: MaybeRefOrGetter<string | undefined>;
	readonly?: MaybeRefOrGetter<boolean | undefined>;
	includeUnregisteredFields?: boolean;
	errorSummaryElement?: Ref<HTMLElement | null>;
	generalErrorsElement?: Ref<{ $el: HTMLElement } | null>;
	submitButtonRef?: Ref<{ reset: () => void } | null>;
}

interface BindableForm {
	modelValue: Record<string, unknown>;
	"onUpdate:modelValue": (value: Record<string, unknown>) => void;
	rules: Record<string, unknown[]> | undefined;
	schema: StandardSchemaLike | undefined;
	onSubmit: ((data: Record<string, unknown>) => unknown) | undefined;
	unsavedChangesGuard: boolean;
}

interface UseFormReturn {
	form: ComputedRef<BindableForm>;
	formData: Ref<Record<string, unknown>>;
	formFields: Record<string, FormField>;
	haveFormFields: ComputedRef<boolean>;
	submitErrors: Ref<Record<string, string | string[]>>;
	formLevelErrors: Ref<Record<string, string[]>>;
	status: Ref<FormStatus | null>;
	generalSubmitErrors: ComputedRef<string[]>;
	haveGeneralSubmitErrors: ComputedRef<boolean>;
	errorSummary: ComputedRef<ErrorSummaryEntry[]>;
	haveErrorSummary: ComputedRef<boolean>;
	isSubmitting: Ref<boolean>;
	isReadonly: ComputedRef<boolean>;
	isDirty: ComputedRef<boolean>;
	registerField: (field: FormField) => Promise<void>;
	unregisterField: (fieldName: string) => void;
	updateFieldValue: (name: string, value: unknown) => Promise<void>;
	fieldErrorsFor: (fieldName: string) => string[];
	normaliseFieldErrors: (value: unknown) => string[];
	handleFormSubmit: (options?: ValidateOptions) => Promise<void>;
	handleSubmitError: (error: unknown) => Promise<void>;
	resetSubmitButton: () => void;
	focusField: (fieldName: string) => void;
	isFieldRequired: (fieldName: string) => boolean;
	validate: (options?: ValidateOptions) => Promise<boolean>;
	getSubmitData: () => Record<string, unknown>;
}

export declare function useForm<T = unknown>(options: UseFormOptions<T>): UseFormReturn;

interface RouterLike {
	beforeEach(guard: () => unknown): void;
}

export declare function installUnsavedChangesGuard(
	router: RouterLike,
	options?: { message?: string },
): void;
