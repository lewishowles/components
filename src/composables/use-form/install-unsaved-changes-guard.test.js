import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { installUnsavedChangesGuard } from "./install-unsaved-changes-guard.js";
import { registerDirtyForm, unregisterDirtyForm } from "./dirty-forms-registry.js";

// A minimal router double, exposing only what installUnsavedChangesGuard uses.
function createFakeRouter() {
	let guard;

	return {
		beforeEach: (callback) => {
			guard = callback;
		},
		runGuard: () => guard(),
	};
}

describe("installUnsavedChangesGuard", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	test("registers a beforeEach guard on the router", () => {
		const router = createFakeRouter();
		const beforeEach = vi.spyOn(router, "beforeEach");

		installUnsavedChangesGuard(router);

		expect(beforeEach).toHaveBeenCalledWith(expect.any(Function));
	});

	test("allows navigation when no forms are dirty", () => {
		const router = createFakeRouter();

		installUnsavedChangesGuard(router);

		expect(router.runGuard()).toBe(true);
	});

	test("confirms before allowing navigation when a form is dirty", () => {
		vi.stubGlobal("confirm", vi.fn().mockReturnValue(true));

		const router = createFakeRouter();

		installUnsavedChangesGuard(router);
		registerDirtyForm();

		expect(router.runGuard()).toBe(true);
		expect(window.confirm).toHaveBeenCalledWith(
			"You have unsaved changes. Are you sure you want to leave?",
		);

		unregisterDirtyForm();
	});

	test("blocks navigation when a form is dirty and the user cancels", () => {
		vi.stubGlobal("confirm", vi.fn().mockReturnValue(false));

		const router = createFakeRouter();

		installUnsavedChangesGuard(router);
		registerDirtyForm();

		expect(router.runGuard()).toBe(false);

		unregisterDirtyForm();
	});

	test("uses a custom message when provided", () => {
		vi.stubGlobal("confirm", vi.fn().mockReturnValue(true));

		const router = createFakeRouter();

		installUnsavedChangesGuard(router, { message: "Custom message" });
		registerDirtyForm();
		router.runGuard();

		expect(window.confirm).toHaveBeenCalledWith("Custom message");

		unregisterDirtyForm();
	});
});
