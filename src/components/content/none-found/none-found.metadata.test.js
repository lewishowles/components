import { describe, expect, test } from "vite-plus/test";
import { noneFoundMetadata } from "./none-found.metadata.js";

describe("none-found metadata", () => {
	test("Reports the runtime heading level type and default", () => {
		expect(noneFoundMetadata.props.find((prop) => prop.name === "headingLevel")).toMatchObject({
			type: "String",
			default: "h2",
		});
	});
});
