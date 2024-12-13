import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import BreadcrumbItem from "./breadcrumb-item.vue";

const mount = createMount(BreadcrumbItem);

describe("breadcrumb-item", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
