import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import ImageTag from "./image-tag.vue";

const defaultProps = { src: "https://picsum.photos/300/300" };
const mount = createMount(ImageTag, { props: defaultProps });

describe("image-tag", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
