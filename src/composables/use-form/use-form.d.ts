import type { ComponentInternalInstance, ComputedRef, Ref } from "vue";

interface UseFormProps {
	fieldErrors?: Record<string, string | string[]>;
	rules?: Record<string, unknown[]>;
	submitErrorsCallback?: ((error: unknown) => Record<string, unknown> | null) | null;
	updatePageTitleOnError?: boolean;
	pageTitleErrorPrefix?: string;
	readonly?: boolean;
}

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

interface UseFormOptions {
	formData: Ref<Record<string, unknown>>;
	props: UseFormProps;
	errorSummaryElement: Ref<HTMLElement | null>;
	generalErrorsElement: Ref<{ $el: HTMLElement } | null>;
	submitButtonRef: Ref<{ reset: () => void } | null>;
	instance: ComponentInternalInstance | null;
}

interface UseFormReturn {
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
}

export declare function useForm(options: UseFormOptions): UseFormReturn;
