<template>
	<preview-wrapper>
		<template #title>
			searchable-list
		</template>

		<preview-section>
			<template #title>
				Section
			</template>

			<searchable-list v-bind="{ data, placeholder }">
				<template #label>
					Search X-Men
				</template>

				<template #default="{ items }">
					<ul class="flex flex-col gap-4">
						<li v-for="character in items" :key="character.name">
							<span class="font-semibold">{{ character.name }}</span> <span class="text-sm italic text-grey-500">&mdash; {{ character.first_appearance }}</span>
							<span class="block text-sm">{{ character.primary_ability }}</span>
						</li>
					</ul>
				</template>
			</searchable-list>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref } from "vue";

const placeholder = "e.g. Jean Grey, 1974, or Telepathy";

const data = ref([
	{
		name: "Jean Grey",
		first_appearance: "X-Men #1 (1963)",
		primary_ability: "Telepathy and Telekinesis",
	},
	{
		name: "Professor X",
		first_appearance: "X-Men #1 (1963)",
		primary_ability: "Telepathy",
	},
	{
		name: "Storm",
		first_appearance: "Giant-Size X-Men #1 (1975)",
		primary_ability: "Weather Manipulation",
	},
	{
		name: "Magneto",
		first_appearance: "X-Men #1 (1963)",
		primary_ability: "Magnetism Manipulation",
	},
	{
		name: "Wolverine",
		first_appearance: "The Incredible Hulk #180 (1974)",
		primary_ability: "Regeneration and Enhanced Senses",
	},
	{
		name: "Rogue",
		first_appearance: "Avengers Annual #10 (1981)",
		primary_ability: "Power Absorption",
	},
	{
		name: "Cyclops",
		first_appearance: "X-Men #1 (1963)",
		primary_ability: "Optic Blasts",
	},
	{
		name: "Iceman",
		first_appearance: "X-Men #1 (1963)",
		primary_ability: "Cryokinesis",
	},
]);
</script>
