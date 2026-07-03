import { nextTick, ref } from "vue";
import { describe, expect, test } from "vite-plus/test";
import { mapFormData, normaliseForInitialisation, useFormData } from "./use-form-data.js";

// Sample source data representing a resolved API response.
const sampleSource = { name: "Alice", email: "alice@example.com" };

// A mapper that extracts the relevant fields from the source.
const sampleMapper = (data) => ({
	email: data.email,
	name: data.name,
});

describe("mapFormData", () => {
	test("should use a function mapper to shape the value", () => {
		expect(mapFormData(sampleSource, sampleMapper)).toEqual({
			email: "alice@example.com",
			name: "Alice",
		});
	});

	test("should use an options object to pick fields", () => {
		expect(mapFormData(sampleSource, { fields: ["name"] })).toEqual({ name: "Alice" });
	});

	test("should deep clone the value when no mapper is provided", () => {
		const mapped = mapFormData(sampleSource);

		expect(mapped).toEqual(sampleSource);
		expect(mapped).not.toBe(sampleSource);
	});
});

describe("useFormData", () => {
	describe("Initialisation", () => {
		test("should return an empty object before the source resolves", () => {
			const source = ref(null);
			const formData = useFormData(source, sampleMapper);

			expect(formData.value).toEqual({});
		});

		test("should populate immediately when the source is already available", () => {
			const source = ref(sampleSource);
			const formData = useFormData(source, sampleMapper);

			expect(formData.value).toEqual({
				email: "alice@example.com",
				name: "Alice",
			});
		});
	});

	describe("Default mapper", () => {
		test("Deep clones the source when no mapper is provided", () => {
			const source = ref(sampleSource);
			const formData = useFormData(source);

			expect(formData.value).toEqual(sampleSource);
			expect(formData.value).not.toBe(sampleSource);
		});
	});

	describe("Population", () => {
		test("should populate formData when the source first becomes available", async () => {
			const source = ref(null);
			const formData = useFormData(source, sampleMapper);

			source.value = sampleSource;

			await nextTick();

			expect(formData.value).toEqual({
				email: "alice@example.com",
				name: "Alice",
			});
		});

		test("should apply the mapper to the source value", async () => {
			const source = ref(null);

			const formData = useFormData(source, (data) => ({
				name: data.label.toUpperCase(),
			}));

			source.value = { label: "test" };

			await nextTick();

			expect(formData.value).toEqual({ name: "TEST" });
		});

		test("should not reset formData on subsequent source changes", async () => {
			const source = ref(sampleSource);
			const formData = useFormData(source, sampleMapper);

			source.value = { name: "Bob", email: "bob@example.com" };

			await nextTick();

			expect(formData.value).toEqual({
				email: "alice@example.com",
				name: "Alice",
			});
		});
	});

	describe("Object convention — fields", () => {
		test("should pick listed keys when fields is an array", () => {
			const source = ref({ name: "Alice", email: "alice@example.com", age: 30 });

			const formData = useFormData(source, { fields: ["name", "email"] });

			expect(formData.value).toEqual({
				name: "Alice",
				email: "alice@example.com",
			});
		});

		test("should rename keys when fields is an object", () => {
			const source = ref({ firstName: "Alice", emailAddress: "alice@example.com" });

			const formData = useFormData(source, {
				fields: { name: "firstName", email: "emailAddress" },
			});

			expect(formData.value).toEqual({
				name: "Alice",
				email: "alice@example.com",
			});
		});
	});

	describe("Object convention — fieldTypes", () => {
		test("nullable-number converts null to empty string", () => {
			const source = ref({ age: null });

			const formData = useFormData(source, {
				fields: ["age"],
				fieldTypes: { age: "nullable-number" },
			});

			expect(formData.value).toEqual({ age: "" });
		});

		test("nullable-number converts undefined to empty string", () => {
			const source = ref({ age: undefined });

			const formData = useFormData(source, {
				fields: ["age"],
				fieldTypes: { age: "nullable-number" },
			});

			expect(formData.value).toEqual({ age: "" });
		});

		test("nullable-number converts a real number to a string", () => {
			const source = ref({ age: 30 });

			const formData = useFormData(source, {
				fields: ["age"],
				fieldTypes: { age: "nullable-number" },
			});

			expect(formData.value).toEqual({ age: "30" });
		});

		test("nullable-string converts null to empty string", () => {
			const source = ref({ notes: null });

			const formData = useFormData(source, {
				fields: ["notes"],
				fieldTypes: { notes: "nullable-string" },
			});

			expect(formData.value).toEqual({ notes: "" });
		});

		test("nullable-string converts undefined to empty string", () => {
			const source = ref({ notes: undefined });

			const formData = useFormData(source, {
				fields: ["notes"],
				fieldTypes: { notes: "nullable-string" },
			});

			expect(formData.value).toEqual({ notes: "" });
		});

		test("nullable-string keeps a real string value as-is", () => {
			const source = ref({ notes: "Some notes" });

			const formData = useFormData(source, {
				fields: ["notes"],
				fieldTypes: { notes: "nullable-string" },
			});

			expect(formData.value).toEqual({ notes: "Some notes" });
		});

		test("fields without a listed type pass through unchanged", () => {
			const source = ref({ name: "Alice", age: 30, notes: null });

			const formData = useFormData(source, {
				fields: ["name", "age", "notes"],
				fieldTypes: { age: "nullable-number" },
			});

			expect(formData.value).toEqual({
				name: "Alice",
				age: "30",
				notes: null,
			});
		});
	});

	describe("Function mapper (regression)", () => {
		test("should still accept a function as the second argument", () => {
			const source = ref({ first: "Alice", last: "Smith" });

			const formData = useFormData(source, (data) => ({
				fullName: `${data.first} ${data.last}`,
			}));

			expect(formData.value).toEqual({ fullName: "Alice Smith" });
		});

		test("should still use the default mapper when no second argument is provided", () => {
			const source = ref(sampleSource);
			const formData = useFormData(source);

			expect(formData.value).toEqual(sampleSource);
			expect(formData.value).not.toBe(sampleSource);
		});
	});
});

describe("normaliseForInitialisation", () => {
	test("nullable-number converts null to empty string", () => {
		expect(normaliseForInitialisation({ age: null }, { age: "nullable-number" })).toEqual({
			age: "",
		});
	});

	test("nullable-number converts undefined to empty string", () => {
		expect(normaliseForInitialisation({ age: undefined }, { age: "nullable-number" })).toEqual({
			age: "",
		});
	});

	test("nullable-number converts a real number to a string", () => {
		expect(normaliseForInitialisation({ age: 30 }, { age: "nullable-number" })).toEqual({
			age: "30",
		});
	});

	test("nullable-string converts null to empty string", () => {
		expect(normaliseForInitialisation({ notes: null }, { notes: "nullable-string" })).toEqual({
			notes: "",
		});
	});

	test("nullable-string converts undefined to empty string", () => {
		expect(normaliseForInitialisation({ notes: undefined }, { notes: "nullable-string" })).toEqual({
			notes: "",
		});
	});

	test("nullable-string keeps a real string value as-is", () => {
		expect(
			normaliseForInitialisation({ notes: "Some notes" }, { notes: "nullable-string" }),
		).toEqual({
			notes: "Some notes",
		});
	});

	test("fields without a listed type pass through unchanged", () => {
		expect(
			normaliseForInitialisation(
				{ name: "Alice", age: 30, notes: null },
				{ age: "nullable-number" },
			),
		).toEqual({
			name: "Alice",
			age: "30",
			notes: null,
		});
	});
});
