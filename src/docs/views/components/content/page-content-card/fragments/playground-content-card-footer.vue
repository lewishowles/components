<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-content-card-footer"
		v-model="textSlots"
	>
		<template #title>Card with footer</template>

		<template #introduction>
			Pass
			<code>class</code>
			directly to
			<code>content-card-footer</code>
			to extend its styles. The base structural styles (border, rounding, flex, padding) are always
			applied.
		</template>

		<content-card>
			<content-card-header v-bind="{ iconClasses: 'text-success' }">
				<template #icon>
					<icon-check-circled />
				</template>

				<template #title>
					{{ textSlots.title.value }}
				</template>
			</content-card-header>

			<content-card-section>
				{{ textSlots.default.value }}
			</content-card-section>

			<content-card-footer class="bg-grey-50">
				{{ textSlots.footer.value }}
			</content-card-footer>
		</content-card>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

const textSlots = ref({
	title: {
		label: "Title",
		value: "Connection health",
	},
	default: {
		label: "Content",
		value: "All sensors reported recently.",
		type: "textarea",
	},
	footer: {
		label: "Footer",
		value: "Last checked just now",
	},
});

const headerTemplate = useTemplateGenerator("content-card-header", {
	props: { iconClasses: { value: "text-success" } },
	slots: computed(() => ({
		icon: { value: "<icon-check-circled />" },
		title: textSlots.value.title,
	})),
	indent: 1,
});

const sectionTemplate = useTemplateGenerator("content-card-section", {
	slots: computed(() => ({ default: textSlots.value.default })),
	indent: 1,
});

const footerTemplate = useTemplateGenerator("content-card-footer", {
	props: { class: { value: "bg-grey-50", isInline: true } },
	slots: computed(() => ({ default: textSlots.value.footer })),
	indent: 1,
});

const template = useTemplateGenerator("content-card", {
	additionalContent: [headerTemplate, sectionTemplate, footerTemplate],
});
</script>
