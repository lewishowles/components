import DropdownMenu from "./dropdown-menu.vue";
import DropdownMenuButton from "@/components/interaction/dropdown-menu-button/dropdown-menu-button.vue";
import { createMount } from "@cypress/support/mount";
import { h } from "vue";

const defaultSlots = {
	summary: "Actions",
	default: () => [
		h(DropdownMenuButton, { type: "button" }, () => "Edit"),
		h(DropdownMenuButton, { type: "button" }, () => "Duplicate"),
		h(DropdownMenuButton, { type: "button" }, () => "Delete"),
	],
};

const mount = createMount(DropdownMenu, { slots: defaultSlots });

describe("dropdown-menu", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("dropdown-menu").shouldBeVisible();
		cy.getByData("dropdown-menu-trigger").shouldBeVisible();
	});

	describe("ARIA", () => {
		it('The trigger has aria-haspopup="menu"', () => {
			mount();

			cy.getByData("dropdown-menu-trigger").shouldHaveAttribute("aria-haspopup", "menu");
		});

		it('The trigger has aria-expanded="false" when closed', () => {
			mount();

			cy.getByData("dropdown-menu-trigger").shouldHaveAttribute("aria-expanded", "false");
		});

		it('The trigger has aria-expanded="true" when open', () => {
			mount();

			cy.getByData("dropdown-menu-trigger").click();

			cy.getByData("dropdown-menu-trigger").shouldHaveAttribute("aria-expanded", "true");
		});

		it('The panel has role="menu"', () => {
			mount();

			cy.getByData("dropdown-menu-trigger").click();

			cy.getByData("dropdown-menu-panel").shouldHaveAttribute("role", "menu");
		});

		it("The trigger's aria-controls matches the panel id", () => {
			mount();

			cy.getByData("dropdown-menu-trigger").click();

			cy.getByData("dropdown-menu-trigger")
				.invoke("attr", "aria-controls")
				.then((controls) => {
					cy.getByData("dropdown-menu-panel").shouldHaveAttribute("id", controls);
				});
		});
	});

	describe("Interaction", () => {
		it("Clicking on the trigger opens the menu", () => {
			mount();

			cy.getByData("dropdown-menu-panel").should("not.exist");

			cy.getByData("dropdown-menu-trigger").click();

			cy.getByData("dropdown-menu-panel").shouldBeVisible();
		});

		it("Clicking on the trigger closes the menu", () => {
			mount();

			cy.getByData("dropdown-menu-trigger").click();
			cy.getByData("dropdown-menu-trigger").click();

			cy.getByData("dropdown-menu-panel").should("not.exist");
		});

		it("Clicking outside the menu closes the menu", () => {
			mount();

			createSiblingElement("Click target", "click-target");

			cy.getByData("dropdown-menu-trigger").click();
			cy.getByData("click-target").click();

			cy.getByData("dropdown-menu-panel").should("not.exist");

			cy.getByData("click-target").then((element) => element.remove());
		});

		it("Escape closes the menu and returns focus to the trigger", () => {
			mount();

			cy.getByData("dropdown-menu-trigger").click();

			cy.getByData("dropdown-menu-trigger").type("{esc}");

			cy.getByData("dropdown-menu-panel").should("not.exist");
			cy.getByData("dropdown-menu-trigger").shouldHaveFocus();
		});
	});

	describe("Menu item behaviour", () => {
		it("Clicking a menu item closes the menu", () => {
			mount();

			cy.getByData("dropdown-menu-trigger").click();

			cy.getByData("dropdown-menu-button").first().click();

			cy.getByData("dropdown-menu-panel").should("not.exist");
		});

		it("Clicking a menu item returns focus to the trigger", () => {
			mount();

			cy.getByData("dropdown-menu-trigger").click();

			cy.getByData("dropdown-menu-button").first().click();

			cy.getByData("dropdown-menu-trigger").shouldHaveFocus();
		});
	});

	describe("Keyboard navigation", () => {
		it("ArrowDown opens the menu and focuses the first item", () => {
			mount();

			cy.getByData("dropdown-menu-trigger").focus();
			cy.getByData("dropdown-menu-trigger").type("{downArrow}");

			cy.getByData("dropdown-menu-panel").shouldBeVisible();
			cy.getByData("dropdown-menu-panel").find("button").first().shouldHaveFocus();
		});

		it("ArrowDown moves focus to the next item", () => {
			mount();

			cy.getByData("dropdown-menu-trigger").click();
			cy.getByData("dropdown-menu-panel").find("button").first().focus();

			cy.getByData("dropdown-menu-panel").trigger("keydown", { key: "ArrowDown" });

			cy.getByData("dropdown-menu-panel").find("button").eq(1).shouldHaveFocus();
		});

		it("ArrowDown wraps from the last item to the first", () => {
			mount();

			cy.getByData("dropdown-menu-trigger").click();
			cy.getByData("dropdown-menu-panel").find("button").last().focus();

			cy.getByData("dropdown-menu-panel").trigger("keydown", { key: "ArrowDown" });

			cy.getByData("dropdown-menu-panel").find("button").first().shouldHaveFocus();
		});

		it("ArrowUp moves focus to the previous item", () => {
			mount();

			cy.getByData("dropdown-menu-trigger").click();
			cy.getByData("dropdown-menu-panel").find("button").eq(1).focus();

			cy.getByData("dropdown-menu-panel").trigger("keydown", { key: "ArrowUp" });

			cy.getByData("dropdown-menu-panel").find("button").first().shouldHaveFocus();
		});

		it("ArrowUp wraps from the first item to the last", () => {
			mount();

			cy.getByData("dropdown-menu-trigger").click();
			cy.getByData("dropdown-menu-panel").find("button").first().focus();

			cy.getByData("dropdown-menu-panel").trigger("keydown", { key: "ArrowUp" });

			cy.getByData("dropdown-menu-panel").find("button").last().shouldHaveFocus();
		});

		it("Home moves focus to the first item", () => {
			mount();

			cy.getByData("dropdown-menu-trigger").click();
			cy.getByData("dropdown-menu-panel").find("button").last().focus();

			cy.getByData("dropdown-menu-panel").trigger("keydown", { key: "Home" });

			cy.getByData("dropdown-menu-panel").find("button").first().shouldHaveFocus();
		});

		it("End moves focus to the last item", () => {
			mount();

			cy.getByData("dropdown-menu-trigger").click();
			cy.getByData("dropdown-menu-panel").find("button").first().focus();

			cy.getByData("dropdown-menu-panel").trigger("keydown", { key: "End" });

			cy.getByData("dropdown-menu-panel").find("button").last().shouldHaveFocus();
		});

		it("Type-ahead focuses the first item starting with the typed character", () => {
			mount();

			cy.getByData("dropdown-menu-trigger").click();
			cy.getByData("dropdown-menu-panel").find("button").first().focus();

			// "e" matches "Edit" — the first button starting with that character
			cy.getByData("dropdown-menu-panel").trigger("keydown", { key: "e" });

			cy.getByData("dropdown-menu-panel").contains("button", "Edit").shouldHaveFocus();
		});

		it("Type-ahead matches a multi-character prefix", () => {
			mount();

			cy.getByData("dropdown-menu-trigger").click();
			cy.getByData("dropdown-menu-panel").find("button").first().focus();

			// "du" matches "Duplicate" rather than "Delete"
			cy.getByData("dropdown-menu-panel").trigger("keydown", { key: "d" });
			cy.getByData("dropdown-menu-panel").trigger("keydown", { key: "u" });

			cy.getByData("dropdown-menu-panel").contains("button", "Duplicate").shouldHaveFocus();
		});
	});

	describe("Styling hooks", () => {
		it("Has data-component on the root element", () => {
			mount();

			cy.getByData("dropdown-menu").shouldHaveAttribute("data-component", "dropdown-menu");
		});

		it("Has data-part on the trigger", () => {
			mount();

			cy.getByData("dropdown-menu-trigger").shouldHaveAttribute("data-part", "trigger");
		});

		it("Has data-state=closed when the menu is closed", () => {
			mount();

			cy.getByData("dropdown-menu").shouldHaveAttribute("data-state", "closed");
		});

		it("Has data-state=open when the menu is open", () => {
			mount();

			cy.getByData("dropdown-menu-trigger").click();
			cy.getByData("dropdown-menu").shouldHaveAttribute("data-state", "open");
		});

		it("Has data-part on the panel when open", () => {
			mount();

			cy.getByData("dropdown-menu-trigger").click();
			cy.getByData("dropdown-menu-panel").shouldHaveAttribute("data-part", "panel");
		});
	});
});

/**
 * Create an element beside the currently mounted component by adding it to the
 * body.
 *
 * @param  {string}  content
 *     The content of the element
 * @param  {string}  selector
 *     The `data-test` selector for the element
 */
function createSiblingElement(content, selector) {
	cy.get("body").then((body) => {
		const siblingElement = document.createElement("div");

		siblingElement.setAttribute("data-test", selector);
		siblingElement.innerText = content;

		body.append(siblingElement);
	});
}
