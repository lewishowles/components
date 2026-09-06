import { describe, expect, test } from "vite-plus/test";
import { relativeDateMetadata } from "./relative-date.metadata.js";

describe("relative-date metadata", () => {
	test("Reports the runtime reference date types and default", () => {
		expect(relativeDateMetadata.props.find((prop) => prop.name === "relativeTo")).toMatchObject({
			type: "string | number | Date | object",
			default: null,
		});
	});
});
