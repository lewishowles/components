import { createDeepMount, createMount } from "@lewishowles/testing/vue";
import { describe, expect, test, vi } from "vite-plus/test";
import { unref } from "vue";

import FormScreen from "./form-screen.vue";

const mount = createMount(FormScreen);
const mountDeep = createDeepMount(FormScreen);

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
		label: registerScreen.mock.calls[0][0].label,
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
			const wrapper = mountDeep({
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

		test("renders an introduction", () => {
			const wrapper = mount({
				props: { id: "profile" },
				slots: {
					introduction: "Tell us about yourself",
					title: "Profile details",
				},
			});

			const introduction = wrapper.get('[data-part="introduction"]');

			expect(introduction.element.tagName).toBe("P");
			expect(introduction.text()).toBe("Tell us about yourself");
		});

		test("does not render an h2 without a title slot", () => {
			const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
			const wrapper = mount({ props: { id: "profile" } });

			expect(wrapper.find('[data-test="form-screen-title"]').exists()).toBe(false);
			expect(warning).toHaveBeenCalledWith(
				"[form-screen] No accessible title found. Provide a `title` slot.",
			);
		});

		test("uses the label slot when it has content", () => {
			const { label, wrapper } = mountWithFlow({
				title: "Profile details",
				label: "Profile",
			});

			expect(label.value).toBe("Profile");

			wrapper.unmount();
		});

		test("uses the title slot when label is not supplied", () => {
			const { label, wrapper } = mountWithFlow({ title: "Profile details" });

			expect(label.value).toBe("Profile details");

			wrapper.unmount();
		});

		test("uses the title slot when label has no content", () => {
			const { label, wrapper } = mountWithFlow({
				title: "Profile details",
				label: () => [],
			});

			expect(label.value).toBe("Profile details");

			wrapper.unmount();
		});

		test("does not register a label when neither slot is supplied", () => {
			const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
			const { label, wrapper } = mountWithFlow();

			expect(label.value).toBe("");
			expect(warning).toHaveBeenCalledWith(
				"[form-screen] No accessible title found. Provide a `title` slot.",
			);

			wrapper.unmount();
		});

		test("registers and unregisters with its flow", async () => {
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

			const screen = registerScreen.mock.calls[0][0];

			expect(screen).toEqual(
				expect.objectContaining({
					element: expect.any(Object),
					id: "profile",
					label: expect.any(Object),
				}),
			);
			expect(unref(screen.autoAdvance)).toBeUndefined();
			expect(unref(screen.autoFocus)).toBeUndefined();

			await wrapper.setProps({ autoAdvance: "email", autoFocus: "name" });

			expect(unref(screen.autoAdvance)).toBe("email");
			expect(unref(screen.autoFocus)).toBe("name");

			wrapper.unmount();

			expect(unregisterScreen).toHaveBeenCalledWith("profile");
		});
	});
});
