import { describe, expect, test } from "vite-plus/test";
import { flashMessagesMetadata } from "./flash-messages.metadata.js";

describe("flash-messages metadata", () => {
	test("Reports the runtime namespace default", () => {
		expect(flashMessagesMetadata.props.find((prop) => prop.name === "namespace")).toMatchObject({
			default: null,
		});
	});
});
