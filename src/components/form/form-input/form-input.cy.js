import { createMount } from "@cypress/support/mount";
import { h } from "vue";
import FormInput from "./form-input.vue";
import IconChevronLeft from "@/components/icon/icon-chevron-left/icon-chevron-left.vue";
import IconChevronRight from "@/components/icon/icon-chevron-right/icon-chevron-right.vue";

const defaultProps = { id: "id-abc" };
const defaultSlots = { default: "Your name" };
const mount = createMount(FormInput, { props: defaultProps, slots: defaultSlots });

describe("form-input", () => {
	it("A text input is rendered", () => {
		mount();

		cy.getByData("form-input").shouldBeVisible();

		cy.getFormField("form-input")
			.shouldHaveAttribute("id", "id-abc");

		cy.getByData("form-input")
			.getByData("form-label")
			.shouldHaveText("Your name")
			.shouldHaveAttribute("for", "id-abc");
	});

	it("Additional attributes can be provided to the input", () => {
		mount({ inputAttributes: { autocomplete: "given-name" } });

		cy.getFormField("form-input").shouldHaveAttribute("autocomplete", "given-name");
	});

	describe("Supplementary information", () => {
		it("Help can be supplied", () => {
			mount({ slots: { help: "Help text" } });

			cy.getByData("form-help")
				.shouldBeVisible()
				.shouldHaveText("Help text")
				.shouldHaveAttribute("id", "id-abc-help");

			cy.getFormField("form-input")
				.shouldHaveAttribute("aria-describedby", "id-abc-help");
		});

		it("An error can be supplied", () => {
			mount({ slots: { error: "Error text" } });

			cy.getByData("form-error")
				.shouldBeVisible()
				.shouldHaveText("Error text")
				.shouldHaveAttribute("id", "id-abc-error");

			cy.getFormField("form-input")
				.shouldHaveAttribute("aria-describedby", "id-abc-error");
		});

		it("Both help and an error can be supplied", () => {
			mount({ slots: { help: "Help text", error: "Error text" } });

			cy.getByData("form-help")
				.shouldBeVisible()
				.shouldHaveText("Help text")
				.shouldHaveAttribute("id", "id-abc-help");

			cy.getByData("form-error")
				.shouldBeVisible()
				.shouldHaveText("Error text")
				.shouldHaveAttribute("id", "id-abc-error");

			cy.getFormField("form-input")
				.shouldHaveAttribute("aria-describedby", "id-abc-help id-abc-error");
		});
	});

	describe("Decoration", () => {
		it("An icon can be added to the start", () => {
			mount({ slots: { prefix: h(IconChevronLeft) } });

			cy.getByData("form-prefix").find("svg").shouldBeVisible();
		});

		it("An icon can be added to the end", () => {
			mount({ slots: { suffix: h(IconChevronRight) } });

			cy.getByData("form-suffix").find("svg").shouldBeVisible();
		});

		it("Text can be added to the start", () => {
			mount({ slots: { prefix: "https://" } });

			cy.getByData("form-prefix").shouldBeVisible().shouldHaveText("https://");
		});

		it("Text can be added to the end", () => {
			mount({ slots: { suffix: "mph" } });

			cy.getByData("form-suffix").shouldBeVisible().shouldHaveText("mph");
		});
	});
});
