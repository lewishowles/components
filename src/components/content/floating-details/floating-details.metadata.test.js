import { describe, expect, test } from "vite-plus/test";
import { floatingDetailsMetadata } from "./floating-details.metadata.js";

describe("floating-details metadata", () => {
	test("Reports the runtime placement and summary class defaults", () => {
		expect(floatingDetailsMetadata.props.find((prop) => prop.name === "placement")).toMatchObject({
			default: "below",
		});
		expect(
			floatingDetailsMetadata.props.find((prop) => prop.name === "summaryClasses"),
		).toMatchObject({
			default: "button--muted",
		});
	});
});
