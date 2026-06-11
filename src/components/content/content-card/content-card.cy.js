import ContentCard from "./content-card.vue";
import IconCctvCamera from "@/components/icon/icon-cctv-camera/icon-cctv-camera.vue";
import { createMount } from "@cypress/support/mount";
import { h } from "vue";

const defaultOptions = {
	slots: {
		default: "Card content",
		title: "Card title",
	},
};

const mount = createMount(ContentCard, defaultOptions);

describe("content-card", () => {
	it("Card content is rendered", () => {
		mount();

		cy.getByData("content-card").shouldBeVisible();
		cy.getByData("content-card-body").shouldHaveText("Card content");
	});

	it("Header content is rendered", () => {
		mount({
			slots: {
				default: "Card content",
				"header-additional": "Card actions",
				icon: () => h(IconCctvCamera, { "data-test": "card-example-icon" }),
				title: "Card title",
			},
		});

		cy.getByData("content-card-header").shouldBeVisible();
		cy.getByData("content-card-title").shouldHaveText("Card title");
		cy.getByData("content-card-icon").find('[data-test="card-example-icon"]').shouldBeVisible();
		cy.getByData("content-card-header-additional").shouldHaveText("Card actions");
	});

	it("Heading level is configurable", () => {
		mount({
			props: {
				headingLevel: "h3",
			},
			slots: {
				default: "Card content",
				title: "Card title",
			},
		});

		cy.getByData("content-card-title").should("match", "h3");
	});

	it("A plain footer excludes well styling", () => {
		mount({
			props: {
				footerVariant: "plain",
			},
			slots: {
				default: "Card content",
				footer: "Card footer",
				title: "Card title",
			},
		});

		cy.getByData("content-card-footer")
			.shouldHaveText("Card footer")
			.should("not.have.class", "bg-grey-50");
	});

	it("Custom header content is rendered inside the header", () => {
		mount({
			slots: {
				default: "Card content",
				header: '<div data-test="custom-card-header">Custom header</div>',
				title: "Card title",
			},
		});

		cy.getByData("content-card-header")
			.find('[data-test="custom-card-header"]')
			.shouldHaveText("Custom header");
		cy.getByData("content-card-title").should("not.exist");
	});

	describe("Styling hooks", () => {
		it("data-component is set on the root element", () => {
			mount({ slots: { default: "Content" } });

			cy.getByData("content-card").shouldHaveAttribute("data-component", "content-card");
		});
	});
});
