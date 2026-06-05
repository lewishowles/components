<template>
	<div class="prose prose-slate dark:prose-invert *:animate-fade-in *:delay">
		<h1>@lewishowles/components</h1>

		<p>
			A library of beautiful components with a focus on accessibility, as well as ease of use for
			developers and for users.
		</p>

		<p>
			The components in this library have mostly been created as needed, to remove repetition from
			the process of creating interfaces, letting the developer focus on creating the best user
			experience they can.
		</p>

		<h2>Why accessibility?</h2>

		<p>
			Accessibility is one of the most important things we can spend time improving. The web is for
			everyone, and making steps to ensure content is as accessible as possible helps everyone, not
			just those who need it most.
		</p>

		<p>
			This library helps improve accessibility in two primary ways; the first by implementing the
			components with accessibility in mind, so a developer can be confident out of the box; and the
			second by using the documentation to help promote the mindset of accessibility. In addition,
			some components show visible errors if standards are not met—such as form fields requiring
			labels.
		</p>

		<p>
			<router-link v-bind="{ to: { name: 'getting-started' } }">Get started &rarr;</router-link>
		</p>
	</div>

	<div class="mt-12 grid gap-8 lg:grid-cols-4">
		<div
			v-for="section in internalSections"
			:key="section.label"
			class="animate-fade-in delay rounded-md px-4 py-3 dark:ring-0"
			:class="section.colours"
		>
			<component :is="section.icon" class="my-6 block size-12" />

			<h3 class="font-semibold">
				{{ section.label }}
			</h3>

			<ol class="font-mono">
				<li v-for="item in section.items" :key="item.label">
					<router-link
						v-bind="{ to: item.to }"
						class="group hocus:underline block flex items-center justify-between py-1 font-mono text-current no-underline"
					>
						{{ item.label }}

						<icon-arrow-right
							class="group-hocus:opacity-100 group-hocus:translate-x-0 size-3 -translate-x-1 opacity-0 transition-all"
						/>
					</router-link>
				</li>
			</ol>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import useMenu from "@/docs/composables/use-menu/use-menu";
import useTitle from "@/docs/composables/use-title/use-title";

import IconChart from "./fragments/icon/icon-chart.vue";
import IconComposables from "./fragments/icon/icon-composables.vue";
import IconContent from "./fragments/icon/icon-content.vue";
import IconDisplay from "./fragments/icon/icon-display.vue";
import IconForm from "./fragments/icon/icon-form.vue";
import IconGeneral from "./fragments/icon/icon-general.vue";
import IconIcons from "./fragments/icon/icon-icons.vue";
import IconInteraction from "./fragments/icon/icon-interaction.vue";
import IconMessaging from "./fragments/icon/icon-messaging.vue";
import IconNavigation from "./fragments/icon/icon-navigation.vue";

const { setTitle } = useTitle();

setTitle("");

const { menuItems } = useMenu();

// Our section configuration allows the menu to be built dynamically in the
// template, but still have unique features for each section.
const sectionConfiguration = {
	Chart: {
		icon: IconChart,
		colours:
			"bg-orange-50 ring-orange-200 text-orange-800 dark:bg-orange-500/20 dark:text-orange-200",
	},
	Composables: {
		icon: IconComposables,
		colours: "bg-cyan-50 ring-cyan-200 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-200",
	},
	Content: {
		icon: IconContent,
		colours:
			"bg-purple-50 ring-purple-200 text-purple-800 dark:bg-purple-500/20 dark:text-purple-200",
	},
	Display: {
		icon: IconDisplay,
		colours: "bg-pink-50 ring-pink-200 text-pink-800 dark:bg-pink-500/20 dark:text-pink-200",
	},
	Form: {
		icon: IconForm,
		colours: "bg-blue-50 ring-blue-200 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200",
	},
	General: {
		icon: IconGeneral,
		colours: "bg-grey-50 ring-grey-200 text-grey-800 dark:bg-grey-500/20 dark:text-grey-200",
	},
	Icons: {
		icon: IconIcons,
		colours:
			"bg-indigo-50 ring-indigo-200 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200",
	},
	Interaction: {
		icon: IconInteraction,
		colours: "bg-green-50 ring-green-200 text-green-800 dark:bg-green-500/20 dark:text-green-200",
	},
	Messaging: {
		icon: IconMessaging,
		colours: "bg-teal-50 ring-teal-200 text-teal-800 dark:bg-teal-500/20 dark:text-teal-200",
	},
	Navigation: {
		icon: IconNavigation,
		colours: "bg-red-50 ring-red-200 text-red-800 dark:bg-red-500/20 dark:text-red-200",
	},
	Utilities: {
		icon: IconGeneral,
		colours:
			"bg-yellow-50 ring-yellow-200 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-200",
	},
};

// Our internal copy of the menu, grouped by category, with the required
// additional config, ready for use in our template.
const internalSections = computed(() => {
	if (!isNonEmptyArray(menuItems.value)) {
		return [];
	}

	const sections = {};

	menuItems.value.forEach((item) => {
		if (item.section === "Introduction") {
			return;
		}

		if (!Object.hasOwn(sections, item.section)) {
			sections[item.section] = {
				label: item.section,
				items: [],
				...sectionConfiguration[item.section],
			};
		}

		sections[item.section].items.push(item);
	});

	return sections;
});
</script>
