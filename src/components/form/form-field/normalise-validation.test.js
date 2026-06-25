import { describe, expect, test } from "vite-plus/test";
import { normaliseValidation, validateFunctionRules } from "./normalise-validation.js";

describe("normaliseValidation", () => {
	test("returns empty arrays for non-array input", () => {
		expect(normaliseValidation(null)).toEqual({ objectRules: [], functionRules: [] });
		expect(normaliseValidation([])).toEqual({ objectRules: [], functionRules: [] });
	});

	test("returns empty arrays for undefined", () => {
		expect(normaliseValidation(undefined)).toEqual({ objectRules: [], functionRules: [] });
	});

	test("splits object rules from function rules", () => {
		const required = { rule: "required", message: "Enter name" };
		const email = { rule: "email", message: "Enter valid email" };
		const customFn = (v) => !!v || "Required";
		const rules = [required, customFn, email];

		const { objectRules, functionRules } = normaliseValidation(rules);

		expect(objectRules).toEqual([required, email]);
		expect(functionRules).toEqual([customFn]);
	});

	test("all function rules are collected", () => {
		const fn1 = (v) => v.length > 3 || "Too short";
		const fn2 = (v) => !!v || "Required";

		const { objectRules, functionRules } = normaliseValidation([fn1, fn2]);

		expect(objectRules).toEqual([]);
		expect(functionRules).toEqual([fn1, fn2]);
	});

	test("all object rules pass through", () => {
		const obj1 = { rule: "required", message: "Required" };
		const obj2 = { rule: "max", max: 10, message: "Too long" };

		const { objectRules, functionRules } = normaliseValidation([obj1, obj2]);

		expect(objectRules).toEqual([obj1, obj2]);
		expect(functionRules).toEqual([]);
	});
});

describe("validateFunctionRules", () => {
	test("returns empty array for no function rules", () => {
		expect(validateFunctionRules([], "", {})).toEqual([]);
	});

	test("returns no errors when function returns true", () => {
		const rules = [(v) => !!v || "Required"];

		expect(validateFunctionRules(rules, "hello", {})).toEqual([]);
	});

	test("returns no errors when function returns truthy non-string", () => {
		const rules = [() => 1];

		expect(validateFunctionRules(rules, "", {})).toEqual([]);
	});

	test("returns no error when function returns false (only strings are errors)", () => {
		const rules = [() => false];

		expect(validateFunctionRules(rules, "anything", {})).toEqual([]);
	});

	test("returns custom message when function returns a string", () => {
		const rules = [(v) => v.length > 3 || "Must be at least 4 characters"];

		expect(validateFunctionRules(rules, "abc", {})).toEqual(["Must be at least 4 characters"]);
	});

	test("passes formData to the function", () => {
		const rules = [(value, formData) => value === formData.password || "Passwords must match"];

		expect(validateFunctionRules(rules, "abc", { password: "xyz" })).toEqual([
			"Passwords must match",
		]);
	});

	test("collects errors from multiple function rules", () => {
		const rules = [(v) => !!v || "Required", (v) => v.length >= 5 || "Too short"];

		expect(validateFunctionRules(rules, "", {})).toEqual(["Required", "Too short"]);
	});

	test("mixes valid and invalid rules correctly", () => {
		const rules = [(v) => !!v || "Required", (v) => v.length >= 5 || "Too short"];

		expect(validateFunctionRules(rules, "ok", {})).toEqual(["Too short"]);
	});

	test("empty string return is not treated as error message", () => {
		const rules = [() => ""];

		expect(validateFunctionRules(rules, "anything", {})).toEqual([]);
	});

	test("returns multiple errors when function returns an array of strings", () => {
		const rules = [
			(v) => {
				const errors = [];

				if (!v) errors.push("Required");
				if (v && v.length < 5) errors.push("Too short");
				if (v && !/[A-Z]/.test(v)) errors.push("Must contain an uppercase letter");

				return errors.length ? errors : true;
			},
		];

		expect(validateFunctionRules(rules, "", {})).toEqual(["Required"]);
		expect(validateFunctionRules(rules, "abc", {})).toEqual([
			"Too short",
			"Must contain an uppercase letter",
		]);
		expect(validateFunctionRules(rules, "Abcde", {})).toEqual([]);
	});

	test("filters out empty strings from array returns", () => {
		const rules = [() => ["Valid error", "", "Another error"]];

		expect(validateFunctionRules(rules, "", {})).toEqual(["Valid error", "Another error"]);
	});
});
