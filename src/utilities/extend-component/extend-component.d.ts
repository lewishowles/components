import type { Component } from "vue";

interface ExtendComponentOptions {
	name?: string;
	props?: Record<string, unknown>;
	slots?: Record<string, (...args: unknown[]) => unknown>;
}

export declare function extendComponent(
	baseComponent: Component,
	options?: ExtendComponentOptions,
): Component;
