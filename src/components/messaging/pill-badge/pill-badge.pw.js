import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "#test/ct/support/mount.js";

import PillBadge from "./pill-badge.vue";

const mountPillBadge = createMount(PillBadge, { slots: { default: "Pill label" } });

const colours = [
	{ name: "grey", classes: ["bg-grey-50"] },
	{ name: "red", classes: ["bg-red-50"] },
	{ name: "orange", classes: ["bg-orange-50"] },
	{ name: "yellow", classes: ["bg-yellow-50"] },
	{ name: "green", classes: ["bg-green-50"] },
	{ name: "teal", classes: ["bg-teal-50"] },
	{ name: "blue", classes: ["bg-blue-50"] },
	{ name: "indigo", classes: ["bg-indigo-50"] },
	{ name: "purple", classes: ["bg-purple-50"] },
	{ name: "pink", classes: ["bg-pink-50"] },
	{ name: "primary", classes: ["bg-primary-subtle"] },
	{ name: "danger", classes: ["bg-danger-subtle"] },
	{ name: "warning", classes: ["bg-warning-subtle"] },
	{ name: "success", classes: ["bg-success-subtle"] },
	{ name: "info", classes: ["bg-info-subtle"] },
];

test.describe("pill-badge", () => {
	test("renders a pill badge", async ({ mount, page }) => {
		await mountPillBadge(mount);

		await expect(page.getByTestId("pill-badge")).toBeVisible();
	});

	for (const colour of colours) {
		test(`supports colour: ${colour.name}`, async ({ mount, page }) => {
			await mountPillBadge(mount, { colour: colour.name });

			for (const className of colour.classes) {
				await expect(page.getByTestId("pill-badge")).toHaveClass(new RegExp(className));
			}
		});
	}
});
