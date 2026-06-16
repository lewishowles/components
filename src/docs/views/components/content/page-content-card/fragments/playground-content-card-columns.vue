<template>
	<component-playground v-bind="{ copy: template }" id="playground-content-card-columns">
		<template #title>Columns</template>

		<template #introduction>
			Wrap
			<code>content-card-section</code>
			children in
			<code>content-card-columns</code>
			to arrange them side by side with a vertical divider. Border collapsing and rounding with
			adjacent sections apply automatically.
		</template>

		<content-card>
			<content-card-header>Site overview</content-card-header>

			<content-card-columns>
				<content-card-section>
					<h3 class="text-content-subtle text-sm">Cameras online</h3>
					<p class="text-content-strong text-2xl font-bold">12</p>
				</content-card-section>

				<content-card-section>
					<h3 class="text-content-subtle text-sm">Alerts today</h3>
					<p class="text-content-strong text-2xl font-bold">3</p>
				</content-card-section>

				<content-card-section>
					<h3 class="text-content-subtle text-sm">Storage used</h3>
					<p class="text-content-strong text-2xl font-bold">68%</p>
				</content-card-section>
			</content-card-columns>
		</content-card>
	</component-playground>
</template>

<script setup>
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

const headerTemplate = useTemplateGenerator("content-card-header", {
	slots: { default: { value: "Site overview" } },
	indent: 1,
});

const section1Template = useTemplateGenerator("content-card-section", {
	slots: { default: { value: "Cameras online" } },
	indent: 1,
});

const section2Template = useTemplateGenerator("content-card-section", {
	slots: { default: { value: "Alerts today" } },
	indent: 1,
});

const section3Template = useTemplateGenerator("content-card-section", {
	slots: { default: { value: "Storage used" } },
	indent: 1,
});

const columnsTemplate = useTemplateGenerator("content-card-columns", {
	additionalContent: [section1Template, section2Template, section3Template],
	indent: 1,
});

const template = useTemplateGenerator("content-card", {
	additionalContent: [headerTemplate, columnsTemplate],
});
</script>
