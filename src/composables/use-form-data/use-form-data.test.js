import { nextTick, ref } from "vue";
import { describe, expect, test } from "vite-plus/test";
import { useFormData } from "./use-form-data.js";

// Sample source data representing a resolved API response.
const sampleSource = { name: "Alice", email: "alice@example.com" };

// A mapper that extracts the relevant fields from the source.
const sampleMapper = (data) => ({
	email: data.email,
	name: data.name,
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
});
