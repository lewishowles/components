import UserAvatars from "./user-avatars.vue";
import { createMount } from "@cypress/support/mount";

const users = [
	{ name: "Mickey Mouse", initials: "MM", avatar: "https://placecats.com/100/100" },
	{ name: "Donald Duck", initials: "DD", avatar: "https://placecats.com/101/101" },
	{ name: "Goofy", initials: "G", avatar: "https://placecats.com/102/102" },
	{ name: "Buzz Lightyear", initials: "BL", avatar: "https://placecats.com/103/103" },
	{ name: "Woody", initials: "W", avatar: "https://placecats.com/104/104" },
];

const defaultProps = { users };
const mount = createMount(UserAvatars, { props: defaultProps });

describe("user-avatars", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("user-avatars").shouldBeVisible();
	});

	it("Displays the appropriate number of avatars", () => {
		mount();

		cy.getByData("user-avatars-user").shouldHaveCount(5);
		cy.getByData("user-avatars-avatar").shouldHaveCount(5);
	});
});
