import { describe, expect, test } from "vitest";
import { validateField } from "./validate-field";

const fieldName = "username";
const formData = { [fieldName]: "jack_skellington" };

const validationRules = [
	{ rule: "required", message: "Required field message" },
	{ rule: "minimum_length", lenght: 1, message: "Minimum length message" },
];

describe("validate-field", () => {
	describe("should pass if an invalid field name is provided", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (empty)", ""],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["null", null],
			["undefined", undefined],
		])("%s", ([, name]) => {
			expect(validateField(name, validationRules, formData)).toBe(true);
		});
	});

	test("should pass if no validation rules are provided", () => {
		expect(validateField(fieldName, [], formData)).toBe(true);
	});

	test("should pass if no form data is provided", () => {
		expect(validateField(fieldName, validationRules, {})).toBe(true);
	});

	describe("required", () => {
		test("should allow passing validation", () => {
			expect(validateField(fieldName, [{ rule: "required" }], { [fieldName]: "jack_skellington" })).toEqual([]);
		});

		test("should detect failing validation", () => {
			expect(validateField(fieldName, [{ rule: "required" }], { [fieldName]: undefined })).toEqual(false);
			expect(validateField(fieldName, [{ rule: "required" }], { [fieldName]: "" })).toEqual(false);
		});
	});

	describe("email", () => {
		test("should allow passing validation", () => {
			expect(validateField(fieldName, [{ rule: "email" }], { [fieldName]: "jack_skellington@" })).toEqual([]);
		});

		test("should detect failing validation", () => {
			expect(validateField(fieldName, [{ rule: "email" }], { [fieldName]: "jack_skellington" })).toEqual(false);
		});
	});

	describe("minimum_length", () => {
		test("should fail without a provided length", () => {
			expect(validateField(fieldName, [{ rule: "minimum_length" }], { [fieldName]: "jack_skellington" })).toEqual(false);
		});

		describe("should fail with an invalid length", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["string (non-empty)", "string"],
				["string (empty)", ""],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["array (non-empty)", [1, 2, 3]],
				["array (empty)", []],
				["null", null],
				["undefined", undefined],
			])("%s", ([, length]) => {
				expect(validateField(fieldName, [{ rule: "minimum_length", length }], { [fieldName]: "jack_skellington" })).toEqual(false);
			});
		});

		test("should allow passing validation", () => {
			expect(validateField(fieldName, [{ rule: "minimum_length", length: 5 }], { [fieldName]: "jack_skellington" })).toEqual([]);
		});

		test("should detect failing validation", () => {
			expect(validateField(fieldName, [{ rule: "minimum_length", length: 20 }], { [fieldName]: "jack_skellington" })).toEqual(false);
		});
	});

	describe("maximum_length", () => {
		test("should fail without a provided length", () => {
			expect(validateField(fieldName, [{ rule: "maximum_length" }], { [fieldName]: "jack_skellington" })).toEqual(false);
		});

		describe("should fail with an invalid length", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["string (non-empty)", "string"],
				["string (empty)", ""],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["array (non-empty)", [1, 2, 3]],
				["array (empty)", []],
				["null", null],
				["undefined", undefined],
			])("%s", ([, length]) => {
				expect(validateField(fieldName, [{ rule: "maximum_length", length }], { [fieldName]: "jack_skellington" })).toEqual(false);
			});
		});

		test("should allow passing validation", () => {
			expect(validateField(fieldName, [{ rule: "maximum_length", length: 20 }], { [fieldName]: "jack_skellington" })).toEqual([]);
		});

		test("should detect failing validation", () => {
			expect(validateField(fieldName, [{ rule: "maximum_length", length: 5 }], { [fieldName]: "jack_skellington" })).toEqual(false);
		});
	});

	describe("regexp", () => {
		test("should fail without a provided regexp", () => {
			expect(validateField(fieldName, [{ rule: "regexp" }], { [fieldName]: "jack_skellington" })).toEqual(false);
		});

		describe("should fail with an invalid regexp", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["number (positive)", 1],
				["number (negative)", -1],
				["number (NaN)", NaN],
				["string (non-empty)", "string"],
				["string (empty)", ""],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["null", null],
				["undefined", undefined],
			])("%s", ([, regexp]) => {
				expect(validateField(fieldName, [{ rule: "regexp", regexp }], { [fieldName]: "jack_skellington" })).toEqual(false);
			});
		});

		test("should allow passing validation", () => {
			expect(validateField(fieldName, [{ rule: "regexp", regexp: /[a-z]+/ }], { [fieldName]: "jack_skellington" })).toEqual([]);
		});

		test("should detect failing validation", () => {
			expect(validateField(fieldName, [{ rule: "regexp", length: /[a-z]{2,3}/ }], { [fieldName]: "jack_skellington" })).toEqual(false);
		});
	});
});
