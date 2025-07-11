<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-searchable-list" v-model="textSlots">
		<template #title>
			Searchable list
		</template>

		<searchable-list v-bind="componentProps" v-model="componentModel">
			<template #label>
				{{ textSlots.label?.value }}
			</template>

			<template #default="{ items }">
				<ul class="flex flex-col gap-4">
					<li v-for="person in items" :key="person.id" class="flex items-center gap-4">
						<image-tag :src="person.image_url" class="size-8 rounded" />

						<div class="flex flex-col">
							{{ person.name }}

							<span class="text-xs text-grey-500 dark:text-white/60">
								{{ person.role }}
							</span>
						</div>
					</li>
				</ul>
			</template>
		</searchable-list>

		<template #additional-code>
			<code-block :code="`const data = ${JSON.stringify(data, null, '\t')};`" />
		</template>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

// Our base text slots, available for the user to update.
const textSlots = ref({
	label: {
		label: "Input label",
		value: "Search staff",
	},
});

const data = [
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
	{
		id: "d7e79d45-1e23-45ad-a750-017a2b4cfd2a",
		name: "Deanna Troi",
		role: "Ship's Counselor",
		image_url: "https://placehold.co/400x400?text=DT",
	},
	{
		id: "f1e4d3bd-85ff-432a-b6ab-80c425eb6d09",
		name: "Beverly Crusher",
		role: "Chief Medical Officer",
		image_url: "https://placehold.co/400x400?text=BC",
	},
	{
		id: "cb3fdb86-12f5-4ff9-9e89-09d4f2b3deaf",
		name: "Wesley Crusher",
		role: "Acting Ensign",
		image_url: "https://placehold.co/400x400?text=WC",
	},
	{
		id: "88e4f8fd-50be-4175-a2e2-912e7c5a4e76",
		name: "Tasha Yar",
		role: "Chief of Security",
		image_url: "https://placehold.co/400x400?text=TY",
	},
	{
		id: "ab1236e7-9e3e-48a1-bb80-2a3df5d4e8c4",
		name: "Guinan",
		role: "Bartender",
		image_url: "https://placehold.co/400x400?text=G",
	},
];

// Props both for the template and for the component example itself.
const props = ref({
	data: {
		label: "Data",
		value: data,
		type: "array",
	},
});

const additionalContent = [
	useTemplateGenerator("template", {
		props: {
			"#default": { value: "{ items }", isInline: true },
		},
		slots: {
			default: {
				value: useTemplateGenerator("ul", {
					props: { class: { value: "flex flex-col gap-4", isInline: true } },
					slots: {
						default: {
							value: useTemplateGenerator("li", {
								props: {
									"v-for": { value: "person in items", isInline: true },
									":key": { value: "person.id", isInline: true },
									"class": { value: "flex items-center gap-4", isInline: true },
								},
								additionalContent: [
									useTemplateGenerator("image-tag", {
										props: {
											":src": { value: "person.image_url", isInline: true },
											"class": { value: "size-8 rounded", isInline: true },
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
														value: "text-xs text-grey-500 dark:text-white/60", isInline: true,
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
			},
		},
		indent: 1,
	}),
];

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("searchable-list", { slots: textSlots, props, additionalContent });
</script>
