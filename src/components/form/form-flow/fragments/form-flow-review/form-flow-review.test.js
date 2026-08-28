import { createDeepMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import { h } from "vue";

import FormFlowReview from "./form-flow-review.vue";

// Render the custom answer summary supplied for the account plan field.
const customAnswerSummary = ({ answer }) => h("strong", { "data-test": "custom-answer" }, answer);

// Review data with a default answer and a custom answer renderer.
const reviewSummaries = [
	{
		id: "account",
		title: "Account details",
		fields: [
			{ fieldName: "email", label: "Email address", answer: "person@example.com" },
			{
				answer: "Professional",
				answerSummary: customAnswerSummary,
				fieldName: "plan",
				label: "Plan",
			},
		],
	},
];

const mount = createDeepMount(FormFlowReview, { props: { summaries: reviewSummaries } });

describe("form-flow-review", () => {
	describe("Rendering", () => {
		test("renders screen titles, answers, and custom answer summaries", () => {
			const wrapper = mount();
			const screen = wrapper.get('[data-test="form-flow-review-screen"]');
			const rows = screen.findAll("dl > div");

			expect(screen.get('[data-test="form-flow-review-screen-title"]').text()).toBe(
				"Account details",
			);
			expect(rows).toHaveLength(2);
			expect(rows[0].get("dt").text()).toBe("Email address");
			expect(rows[0].findAll("dd")[0].text()).toBe("person@example.com");
			expect(rows[1].get("dt").text()).toBe("Plan");
			expect(rows[1].findAll("dd")[0].text()).toBe("Professional");
			expect(rows[1].get('[data-test="custom-answer"]').text()).toBe("Professional");
		});
	});

	describe("Events", () => {
		test("emits the selected field and screen when Change is clicked", async () => {
			const wrapper = mount();

			await wrapper
				.get('[data-test="form-flow-review-screen"]')
				.findAll("button")[0]
				.trigger("click");

			expect(wrapper.emitted("change")).toEqual([[{ fieldName: "email", screenId: "account" }]]);
		});
	});
});
