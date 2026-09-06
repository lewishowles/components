import { describe, expect, test } from "vite-plus/test";
import { comboBoxMetadata } from "./combo-box.metadata.js";

describe("combo-box metadata", () => {
	test("Reports the runtime placement and alignment defaults", () => {
		expect(comboBoxMetadata.props.find((prop) => prop.name === "placement")).toMatchObject({
			default: "below",
		});
		expect(comboBoxMetadata.props.find((prop) => prop.name === "align")).toMatchObject({
			default: "start",
		});
	});
});
