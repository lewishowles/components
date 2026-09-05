import { describe, expect, test } from "vite-plus/test";
import { dataTableMetadata } from "./data-table.metadata.js";

describe("data-table metadata", () => {
	test("Reports the runtime columns and name defaults", () => {
		expect(dataTableMetadata.props.find((prop) => prop.name === "columns")).toMatchObject({
			type: "object",
			default: "{}",
		});
		expect(dataTableMetadata.props.find((prop) => prop.name === "name")).toMatchObject({
			type: "string",
			default: null,
		});
	});
});
