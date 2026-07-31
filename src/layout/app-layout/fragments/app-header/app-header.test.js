import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import { name as packageName, version } from "/package.json";
import AppHeader from "./app-header.vue";

const mount = createMount(AppHeader, {
	global: {
		stubs: {
			LinkTag: {
				template: "<a><slot /></a>",
			},
			PillBadge: {
				template: "<span><slot /></span>",
			},
		},
	},
});

describe("app-header", () => {
	test("links the package version to the changelog", () => {
		const wrapper = mount();
		const repositoryUrl = `https://github.com/${packageName.slice(1)}`;

		expect(wrapper.get('[data-test="docs-version"]').attributes("href")).toBe(
			`${repositoryUrl}/blob/main/CHANGELOG.md`,
		);
		expect(wrapper.get('[data-test="project-repository"]').attributes("href")).toBe(repositoryUrl);
		expect(wrapper.get('[data-test="docs-version"]').text()).toContain(`v${version}`);
	});
});
