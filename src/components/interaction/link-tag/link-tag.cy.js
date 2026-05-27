import LinkTag from "./link-tag.vue";
import { createMount } from "@cypress/support/mount";

const defaultProps = { href: "https://howles.dev" };
const defaultSlots = { default: "howles.dev" };
const mount = createMount(LinkTag, { props: defaultProps, slots: defaultSlots });

describe("link-tag", () => {
	it("A link is rendered", () => {
		mount();

		cy.getByData("link-tag").shouldHaveText("howles.dev");
	});

	it("An icon can be added to the start", () => {
		mount({ iconStart: "icon-chevron-left" });

		cy.getByData("link-tag-icon-start").shouldBeVisible();
		cy.getByData("link-tag-icon-end").should("not.exist");
	});

	it("An icon can be added to the end", () => {
		mount({ iconEnd: "icon-chevron-right" });

		cy.getByData("link-tag-icon-start").should("not.exist");
		cy.getByData("link-tag-icon-end").shouldBeVisible();
	});

	describe("External", () => {
		it("An external link can be defined", () => {
			mount({ external: true });

			cy.getByData("link-tag-icon-start").should("not.exist");
			cy.getByData("link-tag-icon-end").should("not.exist");
			cy.getByData("link-tag-icon-external").shouldBeVisible();
		});

		it("An external link icon overrides an end icon", () => {
			mount({ iconEnd: "icon-chevron-right", external: true });

			cy.getByData("link-tag-icon-start").should("not.exist");
			cy.getByData("link-tag-icon-end").should("not.exist");
			cy.getByData("link-tag-icon-external").shouldBeVisible();
		});

		it("An external link icon can be hidden", () => {
			mount({ iconEnd: "icon-chevron-right", external: true, showExternalIcon: false });

			cy.getByData("link-tag-icon-start").should("not.exist");
			cy.getByData("link-tag-icon-end").shouldBeVisible();
			cy.getByData("link-tag-icon-external").should("not.exist");
		});
	});

	describe("Styling hooks", () => {
		it("Has data-component on the root element", () => {
			mount();

			cy.getByData("link-tag").shouldHaveAttribute("data-component", "link-tag");
		});

		it("Has data-external when external is true", () => {
			mount({ external: true });

			cy.getByData("link-tag").shouldHaveAttribute("data-external");
		});

		it("Does not have data-external for a standard link", () => {
			mount();

			cy.getByData("link-tag").shouldNotHaveAttribute("data-external");
		});
	});
});
