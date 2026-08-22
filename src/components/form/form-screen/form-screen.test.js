import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test, vi } from "vite-plus/test";

import FormScreen from "./form-screen.vue";

const mount = createMount(FormScreen);

describe("form-screen", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount({ props: { id: "profile" } });

			expect(wrapper.vm).toBeTypeOf("object");
		});

		test("renders its content when used without a flow", () => {
			const wrapper = mount({
				props: { id: "profile" },
				slots: { default: "Profile details" },
			});

			expect(wrapper.text()).toContain("Profile details");
		});

		test("registers and unregisters with its flow", () => {
			const registerScreen = vi.fn();
			const unregisterScreen = vi.fn();

			const wrapper = mount({
				props: { id: "profile" },
				global: {
					provide: {
						"form-flow": {
							isCurrentScreen: () => true,
							registerScreen,
							unregisterScreen,
						},
					},
				},
			});

			expect(registerScreen).toHaveBeenCalledWith("profile");

			wrapper.unmount();

			expect(unregisterScreen).toHaveBeenCalledWith("profile");
		});
	});
});
