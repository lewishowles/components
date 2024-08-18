import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import DonutChart from "./donut-chart.vue";

const defaultProps = { values: [50, 25, 25] };
const mount = createMount(DonutChart, { props: defaultProps });

describe("donut-chart", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
