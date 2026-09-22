<template>
	<component-playground id="playground-ui-button-overview">
		<template #title>Overview</template>

		<template #introduction>
			<p>Compare button alignment across font sizes and icon placements.</p>
		</template>

		<div class="overflow-x-auto">
			<table class="min-w-max border-separate border-spacing-x-3 border-spacing-y-2 text-sm">
				<caption class="sr-only">
					UI Button icon placements shown at base, small, and extra-small font sizes.
				</caption>

				<thead>
					<tr>
						<th scope="col">
							<span class="sr-only">Font size</span>
						</th>

						<th
							v-for="iconPlacement in iconPlacements"
							:key="iconPlacement.label"
							scope="col"
							class="text-start font-normal"
						>
							{{ iconPlacement.label }}
						</th>
					</tr>
				</thead>

				<tbody>
					<tr v-for="fontSizeRow in fontSizeRows" :key="fontSizeRow.label">
						<th class="text-start font-normal" scope="row">
							{{ fontSizeRow.label }}
						</th>

						<td v-for="iconPlacement in iconPlacements" :key="iconPlacement.label">
							<ui-button
								v-bind="{
									...iconPlacement.props,
									class: ['button--muted', fontSizeRow.className],
								}"
							>
								{{ iconPlacement.label }}
							</ui-button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</component-playground>
</template>

<script setup>
// The icon placements shown as columns, one button per placement.
const iconPlacements = [
	{
		label: "No icon",
		props: {},
	},
	{
		label: "Icon left",
		props: { iconStart: "icon-user" },
	},
	{
		label: "Icon right",
		props: { iconEnd: "icon-arrow-right" },
	},
	{
		label: "Both icons",
		props: {
			iconStart: "icon-user",
			iconEnd: "icon-arrow-right",
		},
	},
	{
		label: "Icon only",
		props: {
			iconStart: "icon-user",
			iconOnly: true,
		},
	},
];

// The text sizes shown as rows, to check how each icon placement scales with the text around it.
const fontSizeRows = [
	{ className: "text-base", label: "Base" },
	{ className: "text-sm", label: "Small" },
	{ className: "text-xs", label: "Extra small" },
];
</script>
