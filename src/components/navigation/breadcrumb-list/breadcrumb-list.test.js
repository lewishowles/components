import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import BreadcrumbList from "./breadcrumb-list.vue";

const mount = createMount(BreadcrumbList);

describe("breadcrumb-list", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
