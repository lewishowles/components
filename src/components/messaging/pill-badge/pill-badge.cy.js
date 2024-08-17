import PillBadge from "./pill-badge.vue";
import { createMount } from "@cypress/support/mount";

const defaultSlots = { default: "Pill label" };
const mount = createMount(PillBadge, { slots: defaultSlots } );

describe("pill-badge", () => {
	it("Renders a pill badge", () => {
		mount();

		cy.getByData("pill-badge").shouldBeVisible();
	});

	const colors = [
		{ name: "grey", classes: ["bg-grey-50"] },
		{ name: "red", classes: ["bg-red-50"] },
		{ name: "orange", classes: ["bg-orange-50"] },
		{ name: "yellow", classes: ["bg-yellow-50"] },
		{ name: "green", classes: ["bg-green-50"] },
		{ name: "teal", classes: ["bg-teal-50"] },
		{ name: "blue", classes: ["bg-blue-50"] },
		{ name: "indigo", classes: ["bg-indigo-50"] },
		{ name: "purple", classes: ["bg-purple-50"] },
		{ name: "pink", classes: ["bg-pink-50"] },
	];

	colors.forEach(colour => {
		it(`Supports colour: ${colour.name}`, () => {
			mount({ colour: colour.name });

			colour.classes.forEach(className => {
				cy.getByData("pill-badge").shouldHaveClass(className);
			});
		});
	});
});
