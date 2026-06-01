import { describe, expect, test } from "vite-plus/test";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";
import useFormField from "./use-form-field.js";

describe("useFormField", () => {
	describe("Initialisation", () => {
		test("Returns the expected shape", () => {
			const instance = createComposable({ id: "field-abc" });

			for (const key of [
				"describedBy",
				"errorId",
				"haveError",
				"haveHelp",
				"haveIntroduction",
				"helpId",
				"inputId",
				"introductionId",
				"invalid",
			]) {
				expect(instance).not.toHaveProperty(key);
			}
		});
	});

	describe("ID generation", () => {
		test("Uses the provided id for inputId", () => {
			const { inputId } = createComposable({ id: "my-field" });

			expect(inputId.value).toBe("my-field");
		});

		test("Generates a random inputId when none is provided", () => {
			const { inputId } = createComposable();

			expect(inputId.value).toBeTypeOf("string");
			expect(inputId.value.length).toBeGreaterThan(0);
		});

		test("Derives errorId from inputId", () => {
			const { errorId } = createComposable({ id: "my-field" });

			expect(errorId.value).toBe("my-field-error");
		});

		test("Derives introductionId from inputId", () => {
			const { introductionId } = createComposable({ id: "my-field" });

			expect(introductionId.value).toBe("my-field-introduction");
		});

		test("Derives helpId from inputId", () => {
			const { helpId } = createComposable({ id: "my-field" });

			expect(helpId.value).toBe("my-field-help");
		});
	});

	describe("Slot detection", () => {
		test("haveError is false without an error slot", () => {
			const { haveError } = createComposable();

			expect(haveError.value).toBe(false);
		});

		test("haveError is true when an error slot is provided", () => {
			const { haveError } = createComposable({}, { error: "<p>Error</p>" });

			expect(haveError.value).toBe(true);
		});

		test("haveHelp is false without a help slot", () => {
			const { haveHelp } = createComposable();

			expect(haveHelp.value).toBe(false);
		});

		test("haveHelp is true when a help slot is provided", () => {
			const { haveHelp } = createComposable({}, { help: "<p>Help</p>" });

			expect(haveHelp.value).toBe(true);
		});

		test("haveIntroduction is false without an introduction slot", () => {
			const { haveIntroduction } = createComposable();

			expect(haveIntroduction.value).toBe(false);
		});

		test("haveIntroduction is true when an introduction slot is provided", () => {
			const { haveIntroduction } = createComposable({}, { introduction: "<p>Intro</p>" });

			expect(haveIntroduction.value).toBe(true);
		});

		test("invalid mirrors haveError", () => {
			const { invalid, haveError } = createComposable({}, { error: "<p>Error</p>" });

			expect(invalid.value).toBe(haveError.value);
			expect(invalid.value).toBe(true);
		});
	});

	describe("describedBy", () => {
		test("Is undefined when no supplementary slots are present", () => {
			const { describedBy } = createComposable({ id: "my-field" });

			expect(describedBy.value).toBeUndefined();
		});

		test("Includes introductionId when introduction slot is present", () => {
			const { describedBy } = createComposable(
				{ id: "my-field" },
				{ introduction: "<p>Intro</p>" },
			);

			expect(describedBy.value).toBe("my-field-introduction");
		});

		test("Includes helpId when help slot is present", () => {
			const { describedBy } = createComposable({ id: "my-field" }, { help: "<p>Help</p>" });

			expect(describedBy.value).toBe("my-field-help");
		});

		test("Includes errorId when error slot is present", () => {
			const { describedBy } = createComposable({ id: "my-field" }, { error: "<p>Error</p>" });

			expect(describedBy.value).toBe("my-field-error");
		});

		test("Combines introduction and help", () => {
			const { describedBy } = createComposable(
				{ id: "my-field" },
				{ introduction: "<p>Intro</p>", help: "<p>Help</p>" },
			);

			expect(describedBy.value).toBe("my-field-introduction my-field-help");
		});

		test("Combines introduction and error", () => {
			const { describedBy } = createComposable(
				{ id: "my-field" },
				{ introduction: "<p>Intro</p>", error: "<p>Error</p>" },
			);

			expect(describedBy.value).toBe("my-field-introduction my-field-error");
		});

		test("Combines help and error", () => {
			const { describedBy } = createComposable(
				{ id: "my-field" },
				{ help: "<p>Help</p>", error: "<p>Error</p>" },
			);

			expect(describedBy.value).toBe("my-field-help my-field-error");
		});

		test("Combines all three supplementary slots", () => {
			const { describedBy } = createComposable(
				{ id: "my-field" },
				{ introduction: "<p>Intro</p>", help: "<p>Help</p>", error: "<p>Error</p>" },
			);

			expect(describedBy.value).toBe("my-field-introduction my-field-help my-field-error");
		});
	});
});

/**
 * Create a simple component wrapper to test our composable.
 *
 * @param  {object}  options
 *     Options forwarded to useFormField.
 * @param  {object}  slots
 *     Slots to mount the component with, keyed by slot name.
 */
function createComposable(options = {}, slots = {}) {
	let instance;

	const component = defineComponent({
		setup() {
			instance = useFormField(options);

			return () => h("div");
		},
	});

	mount(component, { slots });

	return instance;
}
