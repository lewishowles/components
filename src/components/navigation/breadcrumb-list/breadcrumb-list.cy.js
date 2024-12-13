import BreadcrumbList from "./breadcrumb-list.vue";
import BreadcrumbItem from "@/components/navigation/breadcrumb-item/breadcrumb-item.vue";
import { createMount } from "@cypress/support/mount";
import { h } from "vue";

const defaultSlots = {
	default: () => [
		h(BreadcrumbItem, { href: "/" }, "Home"),
		h(BreadcrumbItem, { href: "/users" }, "Users"),
	],
};

const mount = createMount(BreadcrumbList, { slots: defaultSlots });

describe("breadcrumb-list", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("breadcrumb-list").shouldBeVisible();
		cy.getByData("breadcrumb-list-list").shouldBeVisible();
		cy.getByData("breadcrumb-item").shouldHaveCount(2);
	});

	it("Chevrons are displayed as appropriate", () => {
		mount();

		cy.getByData("breadcrumb-item").eq(0).find("svg").shouldNotBeVisible();
		cy.getByData("breadcrumb-item").eq(1).find("svg").shouldBeVisible();
	});
});
