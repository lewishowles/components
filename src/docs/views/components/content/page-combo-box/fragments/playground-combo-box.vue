<template>
	<component-playground
		v-bind="{ copy: template, componentModel: query }"
		id="playground-combo-box"
		v-model="textSlots"
	>
		<template #title>Crew quick search</template>

		<template #introduction>
			<p>
				Type to filter the crew.
				<code>combo-box</code>
				never filters itself — here a simple list is matched by name and handed over as
				<code>items</code>
				.
			</p>
		</template>

		<combo-box v-model="query" v-bind="{ items: filteredCrew }" @select="handleSelect">
			<template #label>
				{{ textSlots.label?.value }}
			</template>

			<template #default="{ item: person }">
				<div class="flex items-center gap-3">
					<image-tag :src="person.image_url" class="size-8 rounded" />

					<div class="flex flex-col">
						{{ person.name }}

						<span class="text-grey-500 text-xs dark:text-white/60">
							{{ person.role }}
						</span>
					</div>
				</div>
			</template>
		</combo-box>

		<p v-if="selectedPerson" class="mt-4 text-sm" data-test="playground-combo-box-selection">
			You chose
			<span class="font-bold">{{ selectedPerson.name }}</span>
			.
		</p>

		<template #additional-code>
			<code-block :code="`const crew = ${JSON.stringify(crew, null, '\t')};`" />
		</template>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// The current search query.
const query = ref("");
// The most recently chosen crew member, shown as feedback.
const selectedPerson = ref(null);

// Our base text slots, available for the user to update.
const textSlots = ref({
	label: {
		label: "Input label",
		value: "Search crew",
	},
});

const crew = [
	{
		id: "550e8400-e29b-41d4-a716-446655440000",
		name: "Jean-Luc Picard",
		role: "Captain",
		image_url: "https://placehold.co/400x400?text=JLP",
	},
	{
		id: "6f9619ff-8b86-d011-b42d-00c04fc964ff",
		name: "William Riker",
		role: "First Officer",
		image_url: "https://placehold.co/400x400?text=WR",
	},
	{
		id: "3d6f0a97-6a6a-4b89-99d2-685dd4ff542c",
		name: "Data",
		role: "Chief Operations Officer",
		image_url: "https://placehold.co/400x400?text=D",
	},
	{
		id: "4a3c1b6c-5b7f-4b8d-9a4a-1d9c9ebc90b3",
		name: "Geordi La Forge",
		role: "Chief Engineer",
		image_url: "https://placehold.co/400x400?text=GLF",
	},
	{
		id: "bd2a9b90-9097-42a5-8df5-f4f2d73bb1e4",
		name: "Worf",
		role: "Chief Security Officer",
		image_url: "https://placehold.co/400x400?text=W",
	},
];

// The crew filtered by the current query. This stands in for whatever matching
// a real source would do before handing results to the combo box.
const filteredCrew = computed(() => {
	const normalisedQuery = query.value.trim().toLowerCase();

	if (!normalisedQuery) {
		return [];
	}

	return crew.filter((person) => person.name.toLowerCase().includes(normalisedQuery));
});

/**
 * Record the chosen crew member.
 *
 * @param  {object}  person
 *     The chosen crew member.
 */
function handleSelect(person) {
	selectedPerson.value = person;
}

// Props for the generated template preview.
const props = ref({
	"v-model": {
		value: "query",
		isInline: true,
	},
	items: {
		label: "Items",
		type: "array",
		variableName: "filteredCrew",
	},
});

// Events for the generated template preview.
const events = ref({
	select: {
		value: "handleSelect",
	},
});

// The default slot, reconstructed for the generated template preview so the
// example shows how each result is rendered.
const additionalContent = [
	useTemplateGenerator("template", {
		props: {
			"#default": { value: "{ item: person }", isInline: true },
		},
		slots: {
			default: {
				value: useTemplateGenerator("div", {
					props: { class: { value: "flex items-center gap-3", isInline: true } },
					additionalContent: [
						useTemplateGenerator("image-tag", {
							props: {
								":src": { value: "person.image_url", isInline: true },
								class: { value: "size-8 rounded", isInline: true },
							},
							indent: 1,
						}),
						useTemplateGenerator("div", {
							props: { class: { value: "flex flex-col", isInline: true } },
							additionalContent: [
								"\t{{ person.name }}",

								useTemplateGenerator("span", {
									props: {
										class: {
											value: "text-xs text-grey-500 dark:text-white/60",
											isInline: true,
										},
									},
									slots: {
										default: {
											value: "{{ person.role }}",
										},
									},
									indent: 1,
								}),
							],
							indent: 1,
						}),
					],
					indent: 1,
				}),
			},
		},
		indent: 1,
	}),
];

const template = useTemplateGenerator("combo-box", {
	slots: textSlots,
	props,
	events,
	additionalContent,
});
</script>
