import { describe, expect, test } from "vite-plus/test";
import { accordionGroupMetadata } from "./accordion-group.metadata.js";

describe("accordion-group metadata", () => {
	test("Reports the runtime heading level type and default", () => {
		expect(accordionGroupMetadata.props.find((prop) => prop.name === "headingLevel")).toMatchObject(
			{
				type: "String",
				default: "h2",
			},
		);
	});
});
