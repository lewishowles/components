<template>
	<component-playground v-bind="{ copy: template }" id="playground-ui-button-overview">
		<template #title>Overview</template>

		<template #introduction>
			<p>Compare button alignment across font sizes and icon placements.</p>
		</template>

		<div class="overflow-x-auto">
			<table class="min-w-max border-separate border-spacing-x-3 border-spacing-y-2 text-sm">
				<caption class="sr-only">
					UI Button variants shown at base, small, and extra-small font sizes.
				</caption>

				<thead>
					<tr>
						<th scope="col">
							<span class="sr-only">Font size</span>
						</th>

						<th
							v-for="buttonVariant in buttonVariants"
							:key="buttonVariant.label"
							scope="col"
							class="text-start font-normal"
						>
							{{ buttonVariant.label }}
						</th>
					</tr>
				</thead>

				<tbody>
					<tr v-for="fontSizeRow in fontSizeRows" :key="fontSizeRow.label">
						<th class="text-start font-normal" scope="row">
							{{ fontSizeRow.label }}
						</th>

						<td v-for="buttonVariant in buttonVariants" :key="buttonVariant.label">
							<ui-button
								v-bind="{
									...buttonVariant.props,
									class: ['button--muted', fontSizeRow.className],
								}"
							>
								{{ buttonVariant.label }}
							</ui-button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</component-playground>
</template>

<script setup>
import { computed } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// Button variants shown in each font-size row.
const buttonVariants = [
	{
		label: "No icon",
		props: {},
		templateProps: {},
	},
	{
		label: "Icon left",
		props: { iconStart: "icon-user" },
		templateProps: {
			"icon-start": {
				isInline: true,
				value: "icon-user",
			},
		},
	},
	{
		label: "Icon right",
		props: { iconEnd: "icon-arrow-right" },
		templateProps: {
			"icon-end": {
				isInline: true,
				value: "icon-arrow-right",
			},
		},
	},
	{
		label: "Both icons",
		props: {
			iconStart: "icon-user",
			iconEnd: "icon-arrow-right",
		},
		templateProps: {
			"icon-end": {
				isInline: true,
				value: "icon-arrow-right",
			},
			"icon-start": {
				isInline: true,
				value: "icon-user",
			},
		},
	},
	{
		label: "Icon only",
		props: {
			iconStart: "icon-user",
			iconOnly: true,
		},
		templateProps: {
			"icon-only": {
				type: "boolean",
				value: true,
			},
			"icon-start": {
				isInline: true,
				value: "icon-user",
			},
		},
	},
];

// Font-size rows used to compare the button variants.
const fontSizeRows = [
	{ className: "text-base", label: "Base" },
	{ className: "text-sm", label: "Small" },
	{ className: "text-xs", label: "Extra small" },
];

// Generate the copied button markup for each row.
const overviewRows = fontSizeRows.map((fontSizeRow) => ({
	...fontSizeRow,
	buttonTemplates: buttonVariants.map((buttonVariant) =>
		useTemplateGenerator("ui-button", {
			props: {
				class: {
					isInline: true,
					value: `button--muted ${fontSizeRow.className}`,
				},
				...buttonVariant.templateProps,
			},
			slots: {
				default: {
					value: buttonVariant.label,
				},
			},
			indent: 5,
		}),
	),
}));

// Copyable markup for the complete alignment comparison.
const template = computed(() => {
	const rowTemplates = overviewRows.map((fontSizeRow) =>
		[
			`\t\t\t<tr>`,
			`\t\t\t\t<th class="text-start text-sm font-normal text-content-muted" scope="row">${fontSizeRow.label}</th>`,
			...fontSizeRow.buttonTemplates.map((buttonTemplate) =>
				[`\t\t\t\t<td>`, buttonTemplate.value, `\t\t\t\t</td>`].join("\n"),
			),
			`\t\t\t</tr>`,
		].join("\n"),
	);

	return [
		`<div class="overflow-x-auto">`,
		`\t<table class="min-w-max border-separate border-spacing-x-3 border-spacing-y-2">`,
		`\t\t<caption class="sr-only">UI Button variants shown at base, small, and extra-small font sizes.</caption>`,
		`\t\t<thead>`,
		`\t\t\t<tr>`,
		`\t\t\t\t<th scope="col"><span class="sr-only">Font size</span></th>`,
		...buttonVariants.map(
			(buttonVariant) =>
				`\t\t\t\t<th class="text-start text-sm font-normal text-content-muted" scope="col">${buttonVariant.label}</th>`,
		),
		`\t\t\t</tr>`,
		`\t\t</thead>`,
		`\t\t<tbody>`,
		...rowTemplates,
		`\t\t</tbody>`,
		`\t</table>`,
		`</div>`,
	].join("\n");
});
</script>
