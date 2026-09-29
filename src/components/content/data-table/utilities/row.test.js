import { describe, expect, test } from "vite-plus/test";
import { getRawRow, getRowContent, getRowId } from "./row.js";

// A row as the user passes it to data-table, before it becomes an internal row.
const sampleRow = { id: "123", title: "Toy Story", release_year: "1995" };

describe("row", () => {
	describe("getRowId", () => {
		test("should retrieve a row ID from configuration", () => {
			const row = { configuration: { id: "abcde" } };

			expect(getRowId(row)).toBe("abcde");
		});

		test("should handle a malformed row", () => {
			const row = { content: {} };

			expect(getRowId(row)).toBe(null);
		});
	});

	describe("getRowContent", () => {
		test("should return the content of a row", () => {
			const row = { content: { title: { content: "Toy Story" } } };
			const content = getRowContent(row, "title");

			expect(content).toEqual("Toy Story");
		});

		test("should return content for a dotted column key", () => {
			const row = {
				content: {
					"address.city": { content: "Bristol" },
				},
			};

			expect(getRowContent(row, "address.city")).toEqual("Bristol");
		});

		describe("should correctly retrieve supported values", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["number (positive)", 1],
				["number (negative)", -1],
				["string (non-empty)", "string"],
			])("%s", ([, input]) => {
				const row = { content: { id: { content: input } } };
				const content = getRowContent(row, "id");

				expect(content).toEqual(input);
			});
		});

		describe("should ignore invalid cell content", () => {
			test.for([
				["number (NaN)", NaN],
				["string (empty)", ""],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["array (non-empty)", [1, 2, 3]],
				["array (empty)", []],
				["null", null],
				["undefined", undefined],
			])("%s", ([, input]) => {
				const row = { content: { id: { content: input } } };
				const content = getRowContent(row, "id");

				expect(content).toEqual("");
			});
		});
	});

	describe("getRawRow", () => {
		test("should retrieve the original raw row data", () => {
			const row = { raw: sampleRow };

			expect(getRawRow(row)).toEqual(sampleRow);
		});
	});
});
