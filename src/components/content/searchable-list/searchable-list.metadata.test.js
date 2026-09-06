import { describe, expect, test } from "vite-plus/test";
import { searchableListMetadata } from "./searchable-list.metadata.js";

describe("searchable-list metadata", () => {
	test("Reports the runtime search, exclude, and include defaults", () => {
		const search = searchableListMetadata.props.find((prop) => prop.name === "search");

		expect(search).toMatchObject({ type: "function" });
		expect(search.default("item")).toBe("item");
		expect(searchableListMetadata.props.find((prop) => prop.name === "exclude")).toMatchObject({
			default: [],
		});
		expect(searchableListMetadata.props.find((prop) => prop.name === "include")).toMatchObject({
			default: [],
		});
	});
});
