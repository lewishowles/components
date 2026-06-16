import ContentCard from "./content-card.vue";
import ContentCardFooter from "@/components/content/content-card-footer/content-card-footer.vue";
import ContentCardHeader from "@/components/content/content-card-header/content-card-header.vue";
import ContentCardSection from "@/components/content/content-card-section/content-card-section.vue";
import IconCctvCamera from "@/components/icon/icon-cctv-camera/icon-cctv-camera.vue";
import { createMount } from "@cypress/support/mount";
import { h } from "vue";

const mount = createMount(ContentCard);

describe("content-card", () => {
	it("Card content is rendered", () => {
		mount({
			slots: {
				default: () => h(ContentCardSection, null, { default: () => "Card content" }),
			},
		});

		cy.getByData("content-card").shouldBeVisible();
		cy.getByData("content-card-section").shouldHaveText("Card content");
	});

	it("Header content is rendered", () => {
		mount({
			slots: {
				default: () => [
					h(ContentCardHeader, null, {
						default: () => "Card title",
						icon: () => h(IconCctvCamera, { "data-test": "card-example-icon" }),
						"header-additional": () => "Card actions",
					}),
					h(ContentCardSection, null, { default: () => "Card content" }),
				],
			},
		});

		cy.getByData("content-card-header").shouldBeVisible();
		cy.getByData("content-card-title").shouldHaveText("Card title");
		cy.getByData("content-card-icon").find('[data-test="card-example-icon"]').shouldBeVisible();
		cy.getByData("content-card-header-additional").shouldHaveText("Card actions");
	});

	it("Heading level is configurable", () => {
		mount({
			slots: {
				default: () => [
					h(ContentCardHeader, { headingLevel: "h3" }, { default: () => "Card title" }),
					h(ContentCardSection, null, { default: () => "Card content" }),
				],
			},
		});

		cy.getByData("content-card-title").should("match", "h3");
	});

	it("Multiple sections stack with collapsed borders", () => {
		mount({
			slots: {
				default: () => [
					h(ContentCardSection, null, { default: () => "First section" }),
					h(ContentCardSection, null, { default: () => "Second section" }),
				],
			},
		});

		cy.getByData("content-card-section").should("have.length", 2);
	});

	it("Custom title content replaces the default header layout", () => {
		mount({
			slots: {
				default: () => [
					h(ContentCardHeader, null, {
						header: () => h("div", { "data-test": "custom-card-header" }, "Custom header"),
					}),
					h(ContentCardSection, null, { default: () => "Card content" }),
				],
			},
		});

		cy.getByData("content-card-header")
			.find('[data-test="custom-card-header"]')
			.shouldHaveText("Custom header");
		cy.getByData("content-card-title").should("not.exist");
	});

	it("Footer content is rendered", () => {
		mount({
			slots: {
				default: () => [
					h(ContentCardSection, null, { default: () => "Card content" }),
					h(ContentCardFooter, null, { default: () => "Card footer" }),
				],
			},
		});

		cy.getByData("content-card-footer").shouldHaveText("Card footer");
	});

	describe("Styling hooks", () => {
		it("data-component is set on the root element", () => {
			mount();

			cy.getByData("content-card").shouldHaveAttribute("data-component", "content-card");
		});
	});
});
