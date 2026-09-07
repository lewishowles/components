import { describe, expect, test } from "vite-plus/test";
import { alertMessageMetadata } from "./alert-message.metadata.js";

describe("alert-message metadata", () => {
	test("Reports the runtime type default", () => {
		expect(alertMessageMetadata.props.find((prop) => prop.name === "type")).toMatchObject({
			default: "muted",
		});
	});
});
