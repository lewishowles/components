import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconCctvCamera from "./icon-cctv-camera.vue";

const mount = createMount(IconCctvCamera);

describe("icon-cctv-camera", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
