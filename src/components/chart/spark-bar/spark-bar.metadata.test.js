import { describe, expect, test } from "vite-plus/test";
import { sparkBarMetadata } from "./spark-bar.metadata.js";

describe("spark-bar metadata", () => {
	test("Reports undefined defaults for track, bar and value classes", () => {
		expect(sparkBarMetadata.props.find((prop) => prop.name === "trackClasses")).toMatchObject({
			default: undefined,
		});
		expect(sparkBarMetadata.props.find((prop) => prop.name === "barClasses")).toMatchObject({
			default: undefined,
		});
		expect(sparkBarMetadata.props.find((prop) => prop.name === "valueClasses")).toMatchObject({
			default: undefined,
		});
	});
});
