<template>
	<preview-wrapper>
		<template #title>
			link-tag
		</template>

		<preview-section>
			<template #title>
				Base links
			</template>

			<div class="flex flex-wrap gap-6">
				<link-tag href="https://howles.dev">
					https://howles.dev
				</link-tag>
			</div>
		</preview-section>

		<preview-section>
			<template #title>
				Icon links
			</template>

			<div class="flex flex-wrap gap-6">
				<link-tag href="https://howles.dev" icon-start="icon-chevron-left">
					Previous page
				</link-tag>
				<link-tag href="https://howles.dev" icon-end="icon-chevron-right">
					Next page
				</link-tag>
			</div>
		</preview-section>

		<preview-section>
			<template #title>
				External links
			</template>

			<div class="flex flex-wrap gap-6">
				<link-tag href="https://howles.dev" icon-start="icon-chevron-left" v-bind="{ external: true }">
					Previous page
				</link-tag>
				<link-tag href="https://howles.dev" icon-end="icon-chevron-right" v-bind="{ external: true }">
					Next page
				</link-tag>
			</div>
		</preview-section>

		<preview-section>
			<template #title>
				External links, <code>showExternalIcon: false</code>
			</template>

			<div class="flex flex-wrap gap-6">
				<link-tag href="https://howles.dev" icon-start="icon-chevron-left" v-bind="{ external: true, showExternalIcon: false }">
					Previous page
				</link-tag>
				<link-tag href="https://howles.dev" icon-end="icon-chevron-right" v-bind="{ external: true, showExternalIcon: false }">
					Next page
				</link-tag>
			</div>
		</preview-section>
	</preview-wrapper>
</template>
