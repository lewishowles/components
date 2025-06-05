<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-summary-details" v-model="textSlots">
		<template #title>
			Summary details
		</template>

		<template #introduction>
			<p>The default implementation, where details appear below the summary.</p>
		</template>

		<summary-details v-bind="componentProps" v-model="componentModel">
			<template #summary>
				{{ textSlots.summary?.value }}
			</template>

			<div class="prose">
				<p>NASA's Voyager 1 spacecraft, launched in 1977, is the most distant human-made object from Earth. As of today, it is over 15 billion miles away and continues to transmit data from interstellar space.</p>

				<p>One of its most profound contributions is the Pale Blue Dot image, captured in 1990 at the request of astronomer Carl Sagan. This photograph, taken from about 3.7 billion miles away, depicts Earth as a mere speck within the vastness of space. It serves as a reminder of humanity's place within the universe—both insignificant in scale yet uniquely capable of exploration and understanding.</p>

				<p>Voyager 1’s longevity defies expectations, with its scientific instruments still operational despite dwindling power reserves. Engineers have adapted its systems over time, enabling continued communication, even as the spacecraft ventures into the unknown. It stands as a testament to human ingenuity and the enduring quest for knowledge beyond our solar system.</p>
			</div>
		</summary-details>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

// Our base text slots, available for the user to update.
const textSlots = ref({
	summary: {
		label: "Summary text",
		value: "Did you know?",
	},
});

// Props both for the template and for the component example itself.
const props = ref({});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const additionalContent = useTemplateGenerator("div", {
	props: { class: { value: "prose", inline: true } },
	additionalContent: [
		useTemplateGenerator("p", {
			slots: { default: { value: "NASA's Voyager 1 spacecraft, launched in 1977, is the most distant human-made object from Earth. As of today, it is over 15 billion miles away and continues to transmit data from interstellar space." } },
			indent: 1,
		}),
		useTemplateGenerator("p", {
			slots: { default: { value: "One of its most profound contributions is the Pale Blue Dot image, captured in 1990 at the request of astronomer Carl Sagan. This photograph, taken from about 3.7 billion miles away, depicts Earth as a mere speck within the vastness of space. It serves as a reminder of humanity's place within the universe—both insignificant in scale yet uniquely capable of exploration and understanding." } },
			indent: 1,
		}),
		useTemplateGenerator("p", {
			slots: { default: { value: "Voyager 1’s longevity defies expectations, with its scientific instruments still operational despite dwindling power reserves. Engineers have adapted its systems over time, enabling continued communication, even as the spacecraft ventures into the unknown. It stands as a testament to human ingenuity and the enduring quest for knowledge beyond our solar system." } },
			indent: 1,
		}),
	],
	indent: 1,
});

const template = useTemplateGenerator("summary-details", { slots: textSlots, props, additionalContent });
</script>
