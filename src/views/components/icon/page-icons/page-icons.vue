<template>
	<component-page>
		<template #title>
			Icons
		</template>

		<template #introduction>
			<p>A number of icons are available baked into the component library and globally available, which allows their use as strings via props and in other components. These icons are primarily from Nucleo and Phosphor Icons, and some have been tweaked to better suit the library.</p>

			<p>Each icon is listed here in alphabetical order, and can be used as a regular component, e.g. <code>&lt;icon-arrow-up /&gt;</code></p>
		</template>

		<searchable-list v-bind="{ data: icons }">
			<template #label>
				Search icons
			</template>

			<template #default="{ items }">
				<ol class="flex flex-col gap-4">
					<li v-for="icon in items" :key="icon.name" class="flex items-center gap-4 text-sm group">
						<component :is="icon.name" class="size-6 text-purple-800" />

						<span class="font-mono">{{ icon.name }}</span>

						<copy-content v-bind="{ content: icon.name }" class="button--muted opacity-0 group-hover:opacity-100 focus-visible:opacity-100">
							Copy icon name
						</copy-content>
					</li>
				</ol>
			</template>
		</searchable-list>
	</component-page>
</template>

<script setup>
const iconsFiles = import.meta.glob("@/components/icon/**/*.vue");

const icons = Object.keys(iconsFiles).reduce((icons, iconPath) => {
	// We exclude our base icon, since it can't be displayed anyway.
	if (iconPath.includes("base-icon")) {
		return icons;
	}

	const parts = iconPath.split("/");
	const name = parts.pop().replace("page-", "").replace(".vue", "").toLowerCase();

	icons.push({
		name,
	});

	return icons;
}, []);
</script>
