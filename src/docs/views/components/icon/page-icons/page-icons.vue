<template>
	<component-page>
		<template #title>Icons</template>

		<template #introduction>
			<p>
				A number of icons are available baked into the component library and globally available,
				which allows their use as strings via props and in other components. These icons are
				primarily from Nucleo and Phosphor Icons, and some have been tweaked to better suit the
				library.
			</p>

			<p>
				Each icon is listed here in alphabetical order, and can be used as a regular component, e.g.
				<code>&lt;icon-arrow-up /&gt;</code>
			</p>

			<p>
				Most of the icons here were added out of necessity for this project or others, and more can
				be added as required.
			</p>
		</template>

		<searchable-list v-bind="{ data: icons }">
			<template #label>Search icons</template>

			<template #default="{ items }">
				<ol class="grid grid-cols-[repeat(auto-fit,minmax(13rem,1fr))] gap-4">
					<li
						v-for="icon in items"
						:key="icon.name"
						class="border-grey-200 relative flex flex-col items-center justify-center rounded-lg border px-4 py-6 dark:border-transparent dark:bg-white/5"
					>
						<component :is="icon.name" class="mb-4 size-6 text-purple-800 dark:text-purple-300" />

						<span class="text-center font-mono text-xs">{{ icon.name }}</span>

						<copy-content
							v-bind="{ content: icon.name }"
							class="absolute inset-0 justify-center rounded-lg bg-white text-sm opacity-0 backdrop-blur-xl group-hover:opacity-100 hover:opacity-100 focus-visible:opacity-100 dark:bg-purple-950/30"
						>
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
