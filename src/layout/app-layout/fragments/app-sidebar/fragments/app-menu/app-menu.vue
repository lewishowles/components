<template>
	<define-template>
		<nav>
			<ol class="flex flex-col gap-6">
				<app-menu-link to="/getting-started">
					Getting started
				</app-menu-link>

				<app-menu-section>
					<template #title>
						Form
					</template>

					<app-menu-link to="/form/form-wrapper">
						form-wrapper
					</app-menu-link>
					<app-menu-link to="/form/form-fieldset">
						form-fieldset
					</app-menu-link>
					<app-menu-link to="/form/form-layout">
						form-layout
					</app-menu-link>
					<app-menu-link to="/form/form-field">
						form-field
					</app-menu-link>
					<app-menu-link to="/form/form-actions">
						form-actions
					</app-menu-link>
					<app-menu-link to="/form/form-input">
						form-input
					</app-menu-link>
					<app-menu-link to="/form/form-textarea">
						form-textarea
					</app-menu-link>
					<app-menu-link to="/form/form-checkbox">
						form-checkbox
					</app-menu-link>
					<app-menu-link to="/form/form-checkbox-group">
						form-checkbox-group
					</app-menu-link>
					<app-menu-link to="/form/form-radio-group">
						form-radio-group
					</app-menu-link>
					<app-menu-link to="/form/button-group">
						button-group
					</app-menu-link>
					<app-menu-link to="/form/form-date">
						form-date
					</app-menu-link>
					<app-menu-link to="/form/form-select">
						form-select
					</app-menu-link>
				</app-menu-section>

				<app-menu-section>
					<template #title>
						Interaction
					</template>

					<app-menu-link to="/interaction/ui-button">
						ui-button
					</app-menu-link>
					<app-menu-link to="/interaction/link-tag">
						link-tag
					</app-menu-link>
					<app-menu-link to="/interaction/dropdown-menu">
						dropdown-menu
					</app-menu-link>
					<app-menu-link to="/interaction/copy-content">
						copy-content
					</app-menu-link>
					<app-menu-link to="/interaction/star-rating">
						star-rating
					</app-menu-link>
				</app-menu-section>

				<app-menu-section>
					<template #title>
						Content
					</template>

					<app-menu-link to="/content/data-table">
						data-table
					</app-menu-link>
					<app-menu-link to="/content/tab-group">
						tab-group
					</app-menu-link>
					<app-menu-link to="/content/accordion-group">
						accordion-group
					</app-menu-link>
					<app-menu-link to="/content/searchable-list">
						searchable-list
					</app-menu-link>
					<app-menu-link to="/content/summary-details">
						summary-details
					</app-menu-link>
					<app-menu-link to="/content/floating-details">
						floating-details
					</app-menu-link>
					<app-menu-link to="/content/display-date">
						display-date
					</app-menu-link>
					<app-menu-link to="/content/loading-indicator">
						loading-indicator
					</app-menu-link>
					<app-menu-link to="/content/skeleton-loader">
						skeleton-loader
					</app-menu-link>
				</app-menu-section>

				<app-menu-section>
					<template #title>
						Icons
					</template>

					<app-menu-link to="/icon/icons">
						icons
					</app-menu-link>
				</app-menu-section>

				<app-menu-section>
					<template #title>
						Navigation
					</template>

					<app-menu-link to="/navigation/breadcrumb-list">
						breadcrumb-list
					</app-menu-link>
					<app-menu-link to="/navigation/app-pagination">
						app-pagination
					</app-menu-link>
				</app-menu-section>

				<app-menu-section>
					<template #title>
						Display
					</template>

					<app-menu-link to="/display/image-tag">
						image-tag
					</app-menu-link>
					<app-menu-link to="/display/user-avatars">
						user-avatars
					</app-menu-link>
				</app-menu-section>

				<app-menu-section>
					<template #title>
						Messaging
					</template>

					<app-menu-link to="/messaging/alert-message">
						alert-message
					</app-menu-link>
					<app-menu-link to="/messaging/pill-badge">
						pill-badge
					</app-menu-link>
					<app-menu-link to="/messaging/modal-controller">
						modal-controller
					</app-menu-link>
					<app-menu-link to="/messaging/modal-dialog">
						modal-dialog
					</app-menu-link>
					<app-menu-link to="/messaging/notification-handler">
						notification-handler
					</app-menu-link>
				</app-menu-section>

				<app-menu-section>
					<template #title>
						Chart
					</template>

					<app-menu-link to="/chart/donut-chart">
						donut-chart
					</app-menu-link>
					<app-menu-link to="/chart/progress-bar">
						progress-bar
					</app-menu-link>
				</app-menu-section>

				<app-menu-section>
					<template #title>
						General
					</template>

					<app-menu-link to="/general/conditional-wrapper">
						conditional-wrapper
					</app-menu-link>
				</app-menu-section>
			</ol>
		</nav>
	</define-template>

	<floating-details
		v-if="!showFullMenu"
		ref="menu-floating-details"
		class="lg:hidden"
		summary-classes="button -me-[1em] dark:text-white"
		details-additional-classes="-me-6"
		v-bind="{ iconOnly: true, iconClosed: 'icon-hamburger', iconOpen: 'icon-cross', align: 'end' }"
	>
		<template #summary>
			Menu
		</template>

		<reuse-template />
	</floating-details>

	<reuse-template v-if="showFullMenu" class="hidden lg:block" />
</template>

<script setup>
/**
 * While `app-menu` could be auto-generated in some way, based on importing the
 * components from the components folder, what we're actually displaying is a
 * component showcase page, not the component itself, and by manually creating
 * our navigation menu we can more cleanly order the components based on their
 * importance, or exclude supplementary components, for example.
 */
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { createReusableTemplate } from "@vueuse/core";
import { runComponentMethod } from "@lewishowles/helpers/vue";
import { useRoute } from "vue-router";
import { useTemplateRef, watch } from "vue";

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

import AppMenuLink from "./fragments/app-menu-link/app-menu-link.vue";
import AppMenuSection from "./fragments/app-menu-section/app-menu-section.vue";

// Access the route information.
const route = useRoute();
// Our floating details element, so we can close it as required.
const floatingDetailsComponent = useTemplateRef("menu-floating-details");
// Set up our breakpoints to use Tailwind media queries.
const breakpoints = useBreakpoints(breakpointsTailwind);
// Whether to show the full menu, which is shown when reaching the "lg"
// breakpoint.
const showFullMenu = breakpoints.greaterOrEqual("lg");

watch(() => route.fullPath, () => {
	runComponentMethod(floatingDetailsComponent.value, "closeDetails");
});
</script>
