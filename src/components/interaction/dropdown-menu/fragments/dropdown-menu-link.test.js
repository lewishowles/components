import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import DropdownMenuLink from "./dropdown-menu-link.vue";

const defaultProps = { href: "#" };
const mount = createMount(DropdownMenuLink, { props: defaultProps });

describe("dropdown-menu-link", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
