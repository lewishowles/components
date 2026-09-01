import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import FormFlowFixture from "./form-flow.fixture.vue";
import FormFlowEmptyFixture from "./form-flow-empty.fixture.vue";
import FormFlowErrorRoutingFixture from "./form-flow-error-routing.fixture.vue";
import FormFlowFocusFixture from "./form-flow-focus.fixture.vue";
import FormFlowReviewFixture from "./form-flow-review.fixture.vue";

// Baseline two-screen flow for navigation and progress assertions.
const mountFormFlow = createMount(FormFlowFixture);
// Flow with a removable screen for empty-state assertions.
const mountEmptyFormFlow = createMount(FormFlowEmptyFixture);

// Flow with controls for root and cross-screen final-error focus tests.
const mountErrorRoutingFormFlow = createMount(FormFlowErrorRoutingFixture);

// Flow with a screen configured with autoFocus for focus-target tests.
const mountFocusFormFlow = createMount(FormFlowFocusFixture);

// Flow with an optional review destination and submit journey.
const mountReviewFormFlow = createMount(FormFlowReviewFixture);

test.describe("form-flow", () => {
	test.describe("navigation", () => {
		test("shows only the first screen initially", async ({ mount, page }) => {
			await mountFormFlow(mount);

			await expect(
				page.getByTestId("form-screen").filter({ has: page.getByText("Email address") }),
			).toBeVisible();
			await expect(page.getByText("Display name")).toBeHidden();
			await expect(page.getByTestId("form-screen-title")).not.toBeFocused();
		});

		test("screens can be navigated", async ({ mount, page }) => {
			await mountFormFlow(mount);

			await page.getByTestId("form-flow-continue-button").click();
			await expect(page.getByText("Display name")).toBeVisible();

			await page.getByTestId("form-flow-back-button").click();
			await expect(page.getByText("Email address")).toBeVisible();
		});

		test("supports review, Change navigation, back navigation, and final submission", async ({
			mount,
			page,
		}) => {
			await mountReviewFormFlow(mount);

			await page.getByTestId("form-flow-continue-button").click();
			await page.getByLabel("Display name", { exact: true }).fill("Taylor");
			await expect(page.getByTestId("form-flow-continue-button")).toHaveText("Continue");
			await page.getByTestId("form-flow-continue-button").click();

			const review = page.getByTestId("form-flow-review");

			await expect(review).toBeVisible();
			await expect(review).toContainText("Review your answers");
			await expect(review).toContainText("Taylor");
			await expect(page.getByTestId("form-flow-continue-button")).toHaveText("Submit application");
			await expect(page.getByTestId("form-flow-review-title")).toBeFocused();

			await page.getByRole("button", { name: "Change Display name on Profile details" }).click();
			await expect(page.getByLabel("Display name", { exact: true })).toBeFocused();

			await page.getByTestId("form-flow-continue-button").click();
			await page.getByTestId("form-flow-back-button").click();
			await expect(page.getByTestId("form-screen-title")).toBeFocused();

			await page.getByTestId("form-flow-continue-button").click();
			await page.getByTestId("form-flow-continue-button").click();
			await expect(page.getByTestId("form-flow-review-submitted")).toBeVisible();
		});

		test("navigates to and focuses an earlier screen field from review", async ({
			mount,
			page,
		}) => {
			await mountReviewFormFlow(mount);

			await page.getByTestId("form-flow-continue-button").click();
			await page.getByLabel("Display name", { exact: true }).fill("Taylor");
			await page.getByTestId("form-flow-continue-button").click();

			await page.getByRole("button", { name: "Change Email address on Account details" }).click();

			await expect(page.getByText("Email address")).toBeVisible();
			await expect(page.getByLabel("Email address", { exact: true })).toBeFocused();
		});
	});

	test.describe("progress", () => {
		test("shows descriptive numeric progress without navigation controls", async ({
			mount,
			page,
		}) => {
			await mountFormFlow(mount);

			const progress = page.getByTestId("step-indicator");

			await expect(progress).toHaveRole("progressbar");
			await expect(progress).toContainText("Account details");
			await expect(progress).toContainText("Step 1 of 2");
			await expect(progress.locator("a, button")).toHaveCount(0);

			await page.getByTestId("form-flow-continue-button").click();

			await expect(progress).toContainText("Profile details");
			await expect(progress).toContainText("Step 2 of 2");
		});
	});

	test.describe("actions", () => {
		test("renders the layout and forwarded action slots", async ({ mount, page }) => {
			await mountFormFlow(mount, { props: { layoutClasses: "gap-y-4" } });

			await expect(page.getByTestId("form-layout")).toHaveClass(/gap-y-4/);
			await expect(page.getByTestId("form-actions")).toContainText("Flow actions");
			await expect(page.getByTestId("flow-secondary-action")).toBeVisible();
			await expect(page.getByTestId("flow-tertiary-action")).toBeVisible();
		});
	});

	test.describe("focus management", () => {
		test.describe("auto-focus", () => {
			test("focuses the configured autoFocus field", async ({ mount, page }) => {
				await mountFocusFormFlow(mount);

				await page.getByTestId("form-flow-continue-button").click();

				await expect(page.getByLabel("Second answer", { exact: true })).toBeFocused();
			});

			test("focuses the screen title when autoFocus is not configured", async ({ mount, page }) => {
				await mountFormFlow(mount);
				await page.getByTestId("form-flow-continue-button").click();

				await expect(page.getByTestId("form-screen-title")).toBeFocused();
			});
		});

		test("scrolls the flow to the viewport top after a screen change", async ({ mount, page }) => {
			await mountFormFlow(mount);

			const formFlow = page.getByTestId("form-flow");
			const continueButton = page.getByTestId("form-flow-continue-button");

			await formFlow.evaluate((element) => {
				element.style.marginBlock = "200vh";
				window.scrollTo(
					0,
					element.getBoundingClientRect().top + window.scrollY + window.innerHeight,
				);
			});

			await expect
				.poll(() => formFlow.evaluate((element) => element.getBoundingClientRect().top))
				.toBeLessThan(0);
			await continueButton.evaluate((button) => button.click());
			await expect(page.getByText("Display name")).toBeVisible();
			await expect
				.poll(() => formFlow.evaluate((element) => element.getBoundingClientRect().top))
				.toBe(0);
		});

		test("focuses the error summary before the first invalid current field", async ({
			mount,
			page,
		}) => {
			await mountFormFlow(mount);

			const email = page.getByLabel("Email address", { exact: true });

			await email.fill("");
			await expect(email).toHaveValue("");
			await page.getByTestId("form-flow-continue-button").click();

			const errorSummary = page.getByTestId("form-flow-error-summary");

			await expect(errorSummary).toBeVisible();
			await expect(errorSummary).toBeFocused();
		});

		test("moves focus to the first visible screen field after final validation fails", async ({
			mount,
			page,
		}) => {
			await mountErrorRoutingFormFlow(mount);

			await page.getByTestId("form-flow-continue-button").click();
			await page.getByTestId("invalidate-first-field").click();
			await page.getByTestId("form-flow-continue-button").click();

			await expect(page.getByLabel("First answer", { exact: true })).toBeVisible();
			await expect(page.getByTestId("form-flow-error-summary")).toBeFocused();
		});

		test("shows root final errors in the flow summary and focuses it", async ({ mount, page }) => {
			await mountErrorRoutingFormFlow(mount);

			await page.getByTestId("form-flow-continue-button").click();
			await page.getByTestId("show-root-error").click();
			await page.getByTestId("form-flow-continue-button").click();

			const errorSummary = page.getByTestId("form-flow-error-summary");

			await expect(errorSummary).toBeVisible();
			await expect(errorSummary).toContainText("The form is not ready to submit");
			await expect(errorSummary).toBeFocused();
		});
	});

	test.describe("empty state", () => {
		test("shows an accessible empty state when all screens are removed", async ({
			mount,
			page,
		}) => {
			await mountEmptyFormFlow(mount);

			const removeScreensButton = page.getByTestId("remove-form-flow-screens");

			await removeScreensButton.click();

			const emptyState = page.getByTestId("form-flow-empty");

			await expect(emptyState).toBeVisible();
			await expect(emptyState).toHaveRole("status");
			await expect(emptyState).toHaveAttribute("aria-live", "polite");
			await expect(emptyState).toContainText("No screens are available.");
			await expect(removeScreensButton).toBeFocused();
			await expect(page.getByTestId("form-flow-continue-button")).not.toBeAttached();
		});
	});
});
