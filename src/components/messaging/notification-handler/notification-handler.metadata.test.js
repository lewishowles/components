import { describe, expect, test } from "vite-plus/test";
import { notificationHandlerMetadata } from "./notification-handler.metadata.js";

describe("notification-handler metadata", () => {
	test("Reports the runtime defaults", () => {
		const dateFormat = notificationHandlerMetadata.props.find((prop) => prop.name === "dateFormat");
		const align = notificationHandlerMetadata.props.find((prop) => prop.name === "align");

		const allowReload = notificationHandlerMetadata.props.find(
			(prop) => prop.name === "allowReload",
		);

		const readNotificationCount = notificationHandlerMetadata.props.find(
			(prop) => prop.name === "readNotificationCount",
		);

		expect(dateFormat).toMatchObject({
			default: { year: "numeric", day: "numeric", month: "long" },
		});
		expect(align).toMatchObject({
			default: "end",
		});
		expect(allowReload).toMatchObject({
			default: true,
		});
		expect(readNotificationCount).toMatchObject({
			default: null,
		});
	});
});
