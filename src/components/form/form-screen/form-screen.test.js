import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test, vi } from "vite-plus/test";

import FormScreen from "./form-screen.vue";

const mount = createMount(FormScreen);

function mountWithFlow(slots = {}) {
	const registerScreen = vi.fn();

	const wrapper = mount({
		props: { id: "profile" },
		slots,
		global: {
			provide: {
				"form-flow": {
					isCurrentScreen: () => true,
					registerScreen,
				},
			},
		},
	});

	return {
		progressLabel: registerScreen.mock.calls[0][0].progressLabel,
		wrapper,
	};
}

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

		test("renders an h2 when the title slot has content", () => {
			const wrapper = mount({
				props: { id: "profile" },
				slots: { title: "Profile details" },
			});

			expect(wrapper.get('[data-test="form-screen-title"]').element.tagName).toBe("H2");
			expect(wrapper.get('[data-test="form-screen-title"]').text()).toBe("Profile details");
		});

		test("does not render an h2 without a title slot", () => {
			const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
			const wrapper = mount({ props: { id: "profile" } });

			expect(wrapper.find('[data-test="form-screen-title"]').exists()).toBe(false);
			expect(warning).toHaveBeenCalledWith(
				"[form-screen] No accessible title found. Provide a `title` slot.",
			);
		});

		test("uses the progress-label slot when it has content", () => {
			const { progressLabel, wrapper } = mountWithFlow({
				title: "Profile details",
				"progress-label": "Profile",
			});

			expect(progressLabel.value).toBe("Profile");

			wrapper.unmount();
		});

		test("uses the title slot when progress-label is not supplied", () => {
			const { progressLabel, wrapper } = mountWithFlow({ title: "Profile details" });

			expect(progressLabel.value).toBe("Profile details");

			wrapper.unmount();
		});

		test("uses the title slot when progress-label has no content", () => {
			const { progressLabel, wrapper } = mountWithFlow({
				title: "Profile details",
				"progress-label": () => [],
			});

			expect(progressLabel.value).toBe("Profile details");

			wrapper.unmount();
		});

		test("does not register a progress label when neither slot is supplied", () => {
			const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
			const { progressLabel, wrapper } = mountWithFlow();

			expect(progressLabel.value).toBe("");
			expect(warning).toHaveBeenCalledWith(
				"[form-screen] No accessible title found. Provide a `title` slot.",
			);

			wrapper.unmount();
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

			expect(registerScreen).toHaveBeenCalledWith({
				id: "profile",
				progressLabel: expect.any(Object),
			});

			wrapper.unmount();

			expect(unregisterScreen).toHaveBeenCalledWith("profile");
		});
	});
});
