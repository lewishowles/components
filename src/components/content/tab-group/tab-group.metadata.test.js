import { describe, expect, test } from "vite-plus/test";
import { tabGroupMetadata } from "./tab-group.metadata.js";

describe("tab-group metadata", () => {
	test("Reports the runtime activation and wrapping defaults", () => {
		expect(tabGroupMetadata.props.find((prop) => prop.name === "activation")).toMatchObject({
			default: "auto",
		});
		expect(tabGroupMetadata.props.find((prop) => prop.name === "wrap")).toMatchObject({
			default: false,
		});
	});
});
