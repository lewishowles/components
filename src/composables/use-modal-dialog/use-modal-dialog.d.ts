import type { Ref } from "vue";

interface ModalEntry {
	component: object;
	id: number;
	props: Record<string, unknown>;
}

export declare function useModalDialog(): {
	_clearModals(): void;
	closeTopModal(): void;
	modals: Readonly<Ref<ReadonlyArray<ModalEntry>>>;
	openModal(component: object, props?: Record<string, unknown>): void;
};
