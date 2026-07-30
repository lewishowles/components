import { describe, expect, test, vi } from "vite-plus/test";
import { cloneFormData } from "./clone-form-data.js";

describe("clone-form-data", () => {
	test("primitives pass through unchanged", () => {
		expect(cloneFormData("hello")).toBe("hello");
		expect(cloneFormData(42)).toBe(42);
		expect(cloneFormData(true)).toBe(true);
		expect(cloneFormData(false)).toBe(false);
		expect(cloneFormData(null)).toBe(null);
		expect(cloneFormData(undefined)).toBe(undefined);
	});

	test("plain object is deep-cloned (mutations don't affect the original)", () => {
		const original = { name: "Alice", age: 30 };
		const clone = cloneFormData(original);

		expect(clone).not.toBe(original);
		expect(clone).toEqual(original);

		clone.name = "Bob";
		expect(original.name).toBe("Alice");
	});

	test("array is deep-cloned (mutations don't affect the original)", () => {
		const original = [1, 2, { nested: true }];
		const clone = cloneFormData(original);

		expect(clone).not.toBe(original);
		expect(clone).toEqual(original);

		clone[0] = 99;
		clone[2].nested = false;

		expect(original[0]).toBe(1);
		expect(original[2].nested).toBe(true);
	});

	test("Date values are deep-cloned inside plain objects", () => {
		const original = { submittedAt: new Date("2026-07-30T12:00:00.000Z") };
		const clone = cloneFormData(original);

		expect(clone).not.toBe(original);
		expect(clone.submittedAt).not.toBe(original.submittedAt);
		expect(clone.submittedAt).toEqual(original.submittedAt);
	});

	test("unsupported structured values retain their references", () => {
		const map = new Map([["name", "Alice"]]);
		const original = { items: [map], settings: map };
		const clone = cloneFormData(original);

		expect(cloneFormData(map)).toBe(map);
		expect(clone).not.toBe(original);
		expect(clone.items).not.toBe(original.items);
		expect(clone.items[0]).toBe(map);
		expect(clone.settings).toBe(map);
	});

	test("does not throw when FileList is unavailable", () => {
		const file = new File(["content"], "test.txt", { type: "text/plain" });
		const blob = new Blob(["content"], { type: "text/plain" });

		vi.stubGlobal("FileList", undefined);

		try {
			expect(() => cloneFormData({ blob, file })).not.toThrow();
		} finally {
			vi.unstubAllGlobals();
		}
	});

	test("File instance is returned by reference, not cloned", () => {
		const file = new File(["content"], "test.txt", { type: "text/plain" });
		const clone = cloneFormData(file);

		expect(clone).toBe(file);
	});

	test("Blob instance is returned by reference, not cloned", () => {
		const blob = new Blob(["content"], { type: "text/plain" });
		const clone = cloneFormData(blob);

		expect(clone).toBe(blob);
	});

	test("nested object containing a File preserves the File by reference while deep-cloning the rest", () => {
		const file = new File(["content"], "upload.pdf", { type: "application/pdf" });

		const original = {
			name: "Alice",
			avatar: file,
			metadata: {
				tags: ["profile", "user"],
			},
		};

		const clone = cloneFormData(original);

		// Top-level object is a new reference.
		expect(clone).not.toBe(original);
		// File is the same reference, not a clone.
		expect(clone.avatar).toBe(file);
		// Nested plain object is deep-cloned.
		expect(clone.metadata).not.toBe(original.metadata);
		expect(clone.metadata).toEqual(original.metadata);

		// Mutating the clone's nested object doesn't affect the original.
		clone.metadata.tags.push("new-tag");
		expect(original.metadata.tags).toEqual(["profile", "user"]);
	});

	test("FileList is returned by reference if constructible in the test environment", () => {
		// FileList is not directly constructible in most environments. Try via
		// DataTransfer, which is the standard way to obtain a FileList.
		let fileList;

		try {
			const dataTransfer = new DataTransfer();

			dataTransfer.items.add(new File(["content"], "a.txt"));
			dataTransfer.items.add(new File(["content"], "b.txt"));
			fileList = dataTransfer.files;
		} catch {
			// DataTransfer or FileList not available in this test environment.
		}

		if (!fileList) {
			return;
		}

		// In happy-dom, DataTransfer.files is a FileList-like object but
		// `instanceof FileList` does not match because the constructor is not
		// exposed on the global. cloneFormData guards via `instanceof FileList`,
		// so it would fall through to the object branch here. Skip the
		// reference assertion when the instanceof check doesn't hold — it is
		// exercised at runtime in real browsers where FileList is available.
		if (typeof FileList === "undefined" || !(fileList instanceof FileList)) {
			return;
		}

		const clone = cloneFormData(fileList);

		expect(clone).toBe(fileList);
	});
});
