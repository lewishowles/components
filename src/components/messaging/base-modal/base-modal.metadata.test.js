import { describe, expect, test } from "vite-plus/test";
import { baseModalMetadata } from "./base-modal.metadata.js";

describe("base-modal metadata", () => {
	test("Reports the runtime initiallyOpen default", () => {
		expect(baseModalMetadata.props.find((prop) => prop.name === "initiallyOpen")).toMatchObject({
			default: true,
		});
	});
});
