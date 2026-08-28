import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import FormFlowReviewFixture from "./form-flow-review.fixture.vue";

// Mount the fixture so custom summary components stay inside the browser bundle.
const mountFormFlowReview = createMount(FormFlowReviewFixture);

test.describe("form-flow-review", () => {
	test("renders screen titles, answers, and custom answer summaries", async ({ mount, page }) => {
		await mountFormFlowReview(mount);

		const screen = page.getByTestId("form-flow-review-screen");
		const rows = screen.locator("dl > div");

		await expect(screen).toBeVisible();
		await expect(screen.getByTestId("form-flow-review-screen-title")).toHaveText("Account details");
		await expect(rows).toHaveCount(2);
		await expect(rows.nth(0).locator("dt")).toHaveText("Email address");
		await expect(rows.nth(0).locator("dd").first()).toHaveText("person@example.com");
		await expect(rows.nth(1).locator("dt")).toHaveText("Plan");
		await expect(rows.nth(1).locator("dd").first()).toHaveText("Professional");
		await expect(rows.nth(1).getByTestId("custom-answer")).toHaveText("Professional");
	});
});
