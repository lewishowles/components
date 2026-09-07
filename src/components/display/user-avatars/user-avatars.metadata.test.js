import { describe, expect, test } from "vite-plus/test";
import { userAvatarsMetadata } from "./user-avatars.metadata.js";

describe("user-avatars metadata", () => {
	test("Reports the runtime initials colour classes default", () => {
		expect(
			userAvatarsMetadata.props.find((prop) => prop.name === "initialsColourClasses"),
		).toMatchObject({
			default: "bg-primary-subtle text-primary",
		});
	});
});
