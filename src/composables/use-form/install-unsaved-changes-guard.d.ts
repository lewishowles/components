interface RouterLike {
	beforeEach(guard: () => unknown): void;
}

export declare function installUnsavedChangesGuard(
	router: RouterLike,
	options?: { message?: string },
): void;
