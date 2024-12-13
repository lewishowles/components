import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import BreadcrumbItem from "./breadcrumb-item.vue";

const defaultProps = { href: "/" };
const mount = createMount(BreadcrumbItem, { props: defaultProps });

describe("breadcrumb-item", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
