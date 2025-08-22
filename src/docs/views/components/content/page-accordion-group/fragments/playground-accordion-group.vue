<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-accordion-group" v-model="textSlots">
		<template #title>
			Accordion group
		</template>

		<accordion-group v-bind="componentProps" v-model="componentModel">
			<template #show-all-panels-label>
				{{ textSlots["show-all-panels-label"]?.value }}
			</template>

			<template #hide-all-panels-label>
				{{ textSlots["hide-all-panels-label"]?.value }}
			</template>

			<template #show-panel-label>
				{{ textSlots["show-panel-label"]?.value }}
			</template>

			<template #hide-panel-label>
				{{ textSlots["hide-panel-label"]?.value }}
			</template>

			<accordion-panel>
				<template #title>
					The Flux Capacitor
				</template>

				<template #introduction>
					The key to time travel.
				</template>

				<div class="prose dark:prose-invert">
					<p>In the world of Back to the Future, the time circuits are the heart of the DeLorean's time-traveling capabilities. With a simple keypad interface, Doc Brown can input any date and time to travel to. The display shows the destination time, the present time, and the last departed time.</p>

					<p>It's a marvel of 1980s science fiction, giving Marty the ability to journey to the past, present, or future at the press of a button. The time circuits add an element of urgency and excitement, as every second counts when avoiding time paradoxes and ensuring the timeline remains intact.</p>
				</div>
			</accordion-panel>
			<accordion-panel>
				<template #title>
					The DeLorean
				</template>

				<template #introduction>
					The iconic time-travelling machine.
				</template>

				<div class="prose dark:prose-invert">
					<p>...</p>
				</div>
			</accordion-panel>
		</accordion-group>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

// Our base text slots, available for the user to update.
const textSlots = ref({
	"show-all-panels-label": {
		label: "Show all panels label",
		value: "Show all panels",
	},
	"hide-all-panels-label": {
		label: "Hide all panels label",
		value: "Hide all panels",
	},
	"show-panel-label": {
		label: "Show panel label",
		value: "Show panel",
	},
	"hide-panel-label": {
		label: "Hide panel label",
		value: "Hide panel",
	},
});

// Props both for the template and for the component example itself.
const props = ref({});

const additionalContent = [
	useTemplateGenerator("accordion-panel", {
		slots: {
			title: { value: "The Flux Capacitor" },
			introduction: { value: "The key to time travel." },
		},
		additionalContent: useTemplateGenerator("div", {
			props: {
				class: { value: "prose", isInline: true },
			},
			additionalContent: [
				useTemplateGenerator("p", {
					slots: {
						default: {
							value: "In the world of Back to the Future, the time circuits are the heart of the DeLorean's time-traveling capabilities. With a simple keypad interface, Doc Brown can input any date and time to travel to. The display shows the destination time, the present time, and the last departed time.",
						},
					},
					indent: 1,
				}),
				useTemplateGenerator("p", {
					slots: {
						default: {
							value: "It's a marvel of 1980s science fiction, giving Marty the ability to journey to the past, present, or future at the press of a button. The time circuits add an element of urgency and excitement, as every second counts when avoiding time paradoxes and ensuring the timeline remains intact.",
						},
					},
					indent: 1,
				}),
			],
			indent: 1,
		}),
		indent: 1,
	}),
	useTemplateGenerator("accordion-panel", {
		slots: {
			title: { value: "The DeLorean" },
			introduction: { value: "The iconic time-travelling machine." },
		},
		additionalContent: useTemplateGenerator("div", {
			props: {
				class: { value: "prose", isInline: true },
			},
			additionalContent: [
				useTemplateGenerator("p", {
					slots: {
						default: { value: "..." },
					},
					indent: 1,
				}),
			],
			indent: 1,
		}),
		indent: 1,
	}),
];

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("accordion-group", { slots: textSlots, props, additionalContent });
</script>
