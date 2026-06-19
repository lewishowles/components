import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import UserAvatars from "./user-avatars.vue";

const users = [
	{ name: "Mickey Mouse", initials: "MM", avatar: "https://placecats.com/100/100" },
	{ name: "Donald Duck", initials: "DD", avatar: "https://placecats.com/101/101" },
	{ name: "Goofy", initials: "G", avatar: "https://placecats.com/102/102" },
	{ name: "Buzz Lightyear", initials: "BL", avatar: "https://placecats.com/103/103" },
	{ name: "Woody", initials: "W", avatar: "https://placecats.com/104/104" },
];

// Mount user-avatars with sensible defaults for testing.
const mountUserAvatars = createMount(UserAvatars, { props: { users } });

test.describe("user-avatars", () => {
	test("renders a user-avatars", async ({ mount, page }) => {
		await mountUserAvatars(mount);

		await expect(page.getByTestId("user-avatars")).toBeVisible();
	});

	test("displays the appropriate number of avatars", async ({ mount, page }) => {
		await mountUserAvatars(mount);

		await expect(page.getByTestId("user-avatars-user")).toHaveCount(5);
		await expect(page.getByTestId("user-avatars-avatar")).toHaveCount(5);
	});
});
