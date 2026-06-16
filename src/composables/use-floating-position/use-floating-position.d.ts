import type { ComputedRef, Ref } from "vue";

type MaybeRefOrGetter<T> = T | Ref<T> | (() => T);

type FloatingPlacement = "above" | "below";
type FloatingAlign = "end" | "start";

interface FloatingPositionOptions {
	initialAlign?: MaybeRefOrGetter<FloatingAlign>;
	initialPlacement?: MaybeRefOrGetter<FloatingPlacement>;
	panelElement: Ref<Element | null>;
	triggerElement: Ref<Element | null>;
}

export declare function useFloatingPosition(options: FloatingPositionOptions): {
	computedAlign: Ref<FloatingAlign>;
	computedPlacement: Ref<FloatingPlacement>;
	handleClose(): void;
	handleOpen(): Promise<void>;
	isPositioning: Ref<boolean>;
	placementClasses: ComputedRef<string>;
};
