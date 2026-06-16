import type { ComputedRef, Ref } from "vue";

type MaybeRefOrGetter<T> = T | Ref<T> | (() => T);

interface ComboboxConfig {
	options?: MaybeRefOrGetter<string[]>;
	listboxId?: string;
	onSelect?: (id: string) => void;
}

interface InputAttributes {
	"aria-activedescendant": string | undefined;
	"aria-autocomplete": string;
	"aria-controls": string;
	"aria-expanded": boolean;
	role: string;
}

interface ListboxAttributes {
	id: string;
	role: string;
}

interface OptionAttributes {
	"aria-selected": boolean;
	id: string;
	role: string;
}

export declare function useCombobox(config?: ComboboxConfig): {
	activeId: Ref<string | null>;
	close(): void;
	getOptionAttributes(id: string): ComputedRef<OptionAttributes>;
	handleKeydown(event: KeyboardEvent): void;
	inputAttributes: ComputedRef<InputAttributes>;
	isOpen: Ref<boolean>;
	listboxAttributes: ComputedRef<ListboxAttributes>;
	open(): void;
	selectOption(id?: string): void;
};
