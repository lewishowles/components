import "./mount";
import "@lewishowles/testing/src/commands.js";
import "cypress-real-events";

Cypress.Commands.add("getComponent", () => {
	return cy.wrap(Cypress.vueWrapper.vm);
});
