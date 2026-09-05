import { describe, expect, test } from "vite-plus/test";
import { breadcrumbItemMetadata } from "./breadcrumb-item.metadata.js";

describe("breadcrumb-item metadata", () => {
	test("Reports the runtime href default", () => {
		expect(breadcrumbItemMetadata.props.find((prop) => prop.name === "href")).toMatchObject({
			default: undefined,
		});
	});
});
