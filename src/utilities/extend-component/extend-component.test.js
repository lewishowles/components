import { mount } from "@vue/test-utils";
import { describe, expect, test, vi } from "vite-plus/test";
import { h } from "vue";
import { extendComponent } from "./extend-component.js";

// A minimal base component exercising props, a v-model, events, slots, and an
// exposed method.
const BaseComponent = {
	name: "base-component",
	props: {
		label: { type: String, default: "default-label" },
		modelValue: { type: String, default: "" },
	},
	emits: ["ping"],
	setup(props, { emit, expose, slots }) {
		expose({ shout: () => "loud" });

		return () =>
			h("div", { class: "base", onClick: () => emit("ping", "pong") }, [
				props.label,
				props.modelValue,
				slots.default ? slots.default() : null,
				slots.heading ? slots.heading() : null,
			]);
	},
};

describe("extend-component", () => {
	test("derives a name from the base component", () => {
		const Extended = extendComponent(BaseComponent);

		expect(Extended.name).toBe("extended-base-component");
	});

	test("applies default props", () => {
		const Extended = extendComponent(BaseComponent, { props: { label: "extended-label" } });
		const wrapper = mount(Extended);

		expect(wrapper.text()).toContain("extended-label");
	});

	test("caller props override default props", () => {
		const Extended = extendComponent(BaseComponent, { props: { label: "extended-label" } });
		const wrapper = mount(Extended, { attrs: { label: "caller-label" } });

		expect(wrapper.text()).toContain("caller-label");
		expect(wrapper.text()).not.toContain("extended-label");
	});

	test("forwards v-model bindings to the base component", () => {
		const Extended = extendComponent(BaseComponent);
		const wrapper = mount(Extended, { attrs: { modelValue: "model-value" } });

		expect(wrapper.text()).toContain("model-value");
	});

	test("forwards event listeners to the base component", async () => {
		const onPing = vi.fn();
		const Extended = extendComponent(BaseComponent);
		const wrapper = mount(Extended, { attrs: { onPing } });

		await wrapper.find(".base").trigger("click");

		expect(onPing).toHaveBeenCalledWith("pong");
	});

	test("uses default slots when the caller omits them", () => {
		const Extended = extendComponent(BaseComponent, {
			slots: { default: () => "default-content" },
		});

		const wrapper = mount(Extended);

		expect(wrapper.text()).toContain("default-content");
	});

	test("caller slots override default slots", () => {
		const Extended = extendComponent(BaseComponent, {
			slots: { default: () => "default-content" },
		});

		const wrapper = mount(Extended, { slots: { default: "caller-content" } });

		expect(wrapper.text()).toContain("caller-content");
		expect(wrapper.text()).not.toContain("default-content");
	});

	test("forwards arbitrary slots to the base component", () => {
		const Extended = extendComponent(BaseComponent);
		const wrapper = mount(Extended, { slots: { heading: "heading-content" } });

		expect(wrapper.text()).toContain("heading-content");
	});

	test("re-exposes the base component's public API", () => {
		const Extended = extendComponent(BaseComponent);
		const wrapper = mount(Extended);

		expect(wrapper.vm.shout()).toBe("loud");
	});
});
