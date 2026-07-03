import { describe, expect, test } from "vite-plus/test";
import { hasDirtyForms, registerDirtyForm, unregisterDirtyForm } from "./dirty-forms-registry.js";

describe("dirtyFormsRegistry", () => {
	test("reports no dirty forms initially", () => {
		expect(hasDirtyForms()).toBe(false);
	});

	test("reports dirty once a form registers", () => {
		registerDirtyForm();

		expect(hasDirtyForms()).toBe(true);

		unregisterDirtyForm();
	});

	test("reports dirty while any of several forms remain registered", () => {
		registerDirtyForm();
		registerDirtyForm();

		unregisterDirtyForm();

		expect(hasDirtyForms()).toBe(true);

		unregisterDirtyForm();

		expect(hasDirtyForms()).toBe(false);
	});

	test("does not go negative when unregistering more than registered", () => {
		unregisterDirtyForm();
		unregisterDirtyForm();

		expect(hasDirtyForms()).toBe(false);

		registerDirtyForm();

		expect(hasDirtyForms()).toBe(true);

		unregisterDirtyForm();
	});
});
