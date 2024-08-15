import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import LinkTag from "./link-tag.vue";

const defaultProps = { href: "https://howles.dev" };
const mount = createMount(LinkTag, { props: defaultProps });

describe("link-tag", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
