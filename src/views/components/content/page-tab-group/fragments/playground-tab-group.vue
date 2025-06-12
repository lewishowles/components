<template>
	<component-playground v-bind="{ copy: template }" id="playground-tab-group" v-model="textSlots">
		<template #title>
			Tab group
		</template>

		<tab-group v-bind="componentProps">
			<tab-item icon="icon-object">
				<template #label>
					Props
				</template>

				<div class="prose">
					<h2>Props</h2>
					<p>…</p>
				</div>
			</tab-item>
			<tab-item icon="icon-slot">
				<template #label>
					Slots
				</template>

				<div class="prose">
					<h2>Slots</h2>
					<p>…</p>
				</div>
			</tab-item>
		</tab-group>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// Props both for the template and for the component example itself.
const props = ref({});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const additionalContent = [
	useTemplateGenerator("tab-item", {
		slots: {
			label: {
				value: "Props",
			},
		},
		props: {
			icon: {
				value: "icon-object",
				inline: true,
			},
		},
		additionalContent: useTemplateGenerator("div", {
			props: {
				class: {
					value: "prose",
					inline: true,
				},
			},
			additionalContent: [
				useTemplateGenerator("h2", { slots: { default: { value: "Props" } }, indent: 1 }),
				useTemplateGenerator("p", { slots: { default: { value: "…" } }, indent: 1 }),
			],
			indent: 1,
		}),
		indent: 1,
	}),
	useTemplateGenerator("tab-item", {
		slots: {
			label: {
				value: "Slots",
			},
		},
		props: {
			icon: {
				value: "icon-slot",
				inline: true,
			},
		},
		additionalContent: useTemplateGenerator("div", {
			props: {
				class: {
					value: "prose",
					inline: true,
				},
			},
			additionalContent: [
				useTemplateGenerator("h2", { slots: { default: { value: "Slots" } }, indent: 1 }),
				useTemplateGenerator("p", { slots: { default: { value: "…" } }, indent: 1 }),
			],
			indent: 1,
		}),
		indent: 1,
	}),
];

const template = useTemplateGenerator("tab-group", { props, additionalContent });
</script>
