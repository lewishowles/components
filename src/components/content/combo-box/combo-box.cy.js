import ComboBox from "./combo-box.vue";
import { createMount } from "@cypress/support/mount";
import { h } from "vue";

const defaultItems = [
	{ id: "1", name: "Picard" },
	{ id: "2", name: "Riker" },
	{ id: "3", name: "Data" },
];

const defaultProps = { items: defaultItems, placeholder: "e.g. Picard" };

const defaultSlots = {
	label: "Search crew",
	default: ({ item }) => h("span", { "data-test": "combo-box-demo-item" }, item.name),
};

const mount = createMount(ComboBox, { slots: defaultSlots, props: defaultProps });

/**
 * Get the underlying input element.
 */
function getInput() {
	return cy.getByData("combo-box-input").find("input");
}

describe("combo-box", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("combo-box").shouldBeVisible();
		cy.getByData("combo-box-input").shouldBeVisible();
	});

	it("The results are hidden until a query is entered", () => {
		mount();

		cy.getByData("combo-box-dropdown").should("not.exist");

		getInput().type("a");

		cy.getByData("combo-box-dropdown").shouldBeVisible();
		cy.getByData("combo-box-option").shouldHaveCount(3);
	});

	describe("ARIA", () => {
		it('The input has role="combobox"', () => {
			mount();

			getInput().shouldHaveAttribute("role", "combobox");
		});

		it("The input reflects the closed state in aria-expanded", () => {
			mount();

			getInput().shouldHaveAttribute("aria-expanded", "false");
		});

		it("The input reflects the open state in aria-expanded", () => {
			mount();

			getInput().type("a");

			getInput().shouldHaveAttribute("aria-expanded", "true");
		});

		it('The results list has role="listbox"', () => {
			mount();

			getInput().type("a");

			cy.getByData("combo-box-listbox").shouldHaveAttribute("role", "listbox");
		});

		it("The input's aria-controls matches the listbox id", () => {
			mount();

			getInput().type("a");

			getInput()
				.invoke("attr", "aria-controls")
				.then((controls) => {
					cy.getByData("combo-box-listbox").shouldHaveAttribute("id", controls);
				});
		});

		it('Each option has role="option"', () => {
			mount();

			getInput().type("a");

			cy.getByData("combo-box-option").first().shouldHaveAttribute("role", "option");
		});
	});

	describe("Keyboard navigation", () => {
		it("Arrow keys move the highlight through the options", () => {
			mount();

			getInput().type("a");

			getInput().type("{downarrow}");
			cy.getByData("combo-box-option").eq(0).shouldHaveAttribute("aria-selected", "true");

			getInput().type("{downarrow}");
			cy.getByData("combo-box-option").eq(1).shouldHaveAttribute("aria-selected", "true");
			cy.getByData("combo-box-option").eq(0).shouldHaveAttribute("aria-selected", "false");
		});

		it("Enter chooses the highlighted option and clears the query", () => {
			mount();

			getInput().type("a");
			getInput().type("{downarrow}");
			getInput().type("{enter}");

			getInput().shouldHaveValue("");
			cy.getByData("combo-box-dropdown").should("not.exist");
		});

		it("Escape closes the results", () => {
			mount();

			getInput().type("a");
			getInput().type("{esc}");

			cy.getByData("combo-box-dropdown").should("not.exist");
		});
	});

	describe("Selection", () => {
		it("Clicking an option emits select with the original item", () => {
			mount({ items: defaultItems, onSelect: cy.spy().as("selectSpy") });

			getInput().type("a");

			cy.getByData("combo-box-option").eq(1).click();

			cy.get("@selectSpy").should("have.been.calledWith", defaultItems[1]);
		});

		it("Choosing an option clears the query and closes the results", () => {
			mount();

			getInput().type("a");

			cy.getByData("combo-box-option").first().click();

			getInput().shouldHaveValue("");
			cy.getByData("combo-box-dropdown").should("not.exist");
		});
	});

	describe("Closing", () => {
		it("Clicking outside the component closes the results", () => {
			mount();

			createSiblingElement("Click target", "click-target");

			getInput().type("a");
			cy.getByData("click-target").click();

			cy.getByData("combo-box-dropdown").should("not.exist");

			cy.getByData("click-target").then((element) => element.remove());
		});

		it("Moving focus outside the component closes the results", () => {
			mount();

			createSiblingElement("Focus target", "focus-target", "button");

			getInput().type("a");
			cy.getByData("focus-target").focus();

			cy.getByData("combo-box-dropdown").should("not.exist");

			cy.getByData("focus-target").then((element) => element.remove());
		});
	});

	describe("States", () => {
		it("Shows a message while loading", () => {
			mount({ items: [], loading: true });

			getInput().type("a");

			cy.getByData("combo-box-loading").shouldBeVisible();
			cy.getByData("combo-box-listbox").should("not.be.visible");
		});

		it("Shows a message when there are no results", () => {
			mount({ items: [] });

			getInput().type("xyz");

			cy.getByData("combo-box-no-results").shouldBeVisible();
			cy.getByData("combo-box-option").should("not.exist");
		});
	});

	describe("Styling", () => {
		it("data-component is set on the root element", () => {
			mount();

			cy.getByData("combo-box").shouldHaveAttribute("data-component", "combo-box");
		});

		it("Additional classes can be applied to the results list", () => {
			mount({ items: defaultItems, dropdownClasses: "test-dropdown-class" });

			getInput().type("a");

			cy.getByData("combo-box-dropdown").should("have.class", "test-dropdown-class");
		});
	});
});

/**
 * Create a sibling element alongside the mounted component, used to test
 * click-outside and focus-outside behaviour.
 *
 * @param  {string}  content
 *     The text content of the element.
 * @param  {string}  selector
 *     The data-test value to apply to the element.
 * @param  {string}  tag
 *     The element tag to create.
 */
function createSiblingElement(content, selector, tag = "div") {
	const element = document.createElement(tag);

	element.textContent = content;
	element.setAttribute("data-test", selector);
	// Pin the element clear of the absolutely positioned results so it is never
	// covered by them.
	element.style.cssText = "position: fixed; bottom: 0; right: 0; z-index: 9999;";

	cy.get("body").then((body) => body.append(element));
}
