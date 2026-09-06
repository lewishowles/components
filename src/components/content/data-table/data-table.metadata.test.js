import { describe, expect, test } from "vite-plus/test";
import { dataTableMetadata } from "./data-table.metadata.js";

describe("data-table metadata", () => {
	test("Reports the runtime heading and cell class types and defaults", () => {
		expect(dataTableMetadata.props.find((prop) => prop.name === "headingClasses")).toMatchObject({
			type: "string",
			default: "font-bold text-content-strong",
		});
		expect(dataTableMetadata.props.find((prop) => prop.name === "cellClasses")).toMatchObject({
			type: "string",
			default: "text-content-muted",
		});
	});

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
