<template>
	<component-playground v-bind="{ copy: template }" id="playground-content-card-sections">
		<template #title>Multiple sections</template>

		<template #introduction>
			Add as many
			<code>content-card-section</code>
			components as needed. Borders collapse automatically between sections, and the outer edges are
			rounded.
		</template>

		<content-card>
			<content-card-header>Camera overview</content-card-header>

			<content-card-section>
				<p class="text-content-strong font-semibold">Front door</p>
				<p class="text-content-muted text-sm">Online — last seen just now</p>
			</content-card-section>

			<content-card-section>
				<p class="text-content-strong font-semibold">Back garden</p>
				<p class="text-content-muted text-sm">Online — last seen 2 minutes ago</p>
			</content-card-section>

			<content-card-section>
				<p class="text-content-strong font-semibold">Garage</p>
				<p class="text-content-muted text-sm text-red-600">Offline — last seen 4 hours ago</p>
			</content-card-section>
		</content-card>
	</component-playground>
</template>

<script setup>
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

const headerTemplate = useTemplateGenerator("content-card-header", {
	slots: { default: { value: "Camera overview" } },
	indent: 1,
});

const section1Template = useTemplateGenerator("content-card-section", {
	slots: { default: { value: "Front door" } },
	indent: 1,
});

const section2Template = useTemplateGenerator("content-card-section", {
	slots: { default: { value: "Back garden" } },
	indent: 1,
});

const section3Template = useTemplateGenerator("content-card-section", {
	slots: { default: { value: "Garage" } },
	indent: 1,
});

const template = useTemplateGenerator("content-card", {
	additionalContent: [headerTemplate, section1Template, section2Template, section3Template],
});
</script>
