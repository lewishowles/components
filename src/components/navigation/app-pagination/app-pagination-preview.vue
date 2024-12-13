<template>
	<preview-wrapper>
		<template #title>
			app-pagination
		</template>

		<preview-section>
			<template #title>
				Standard pagination
			</template>

			<div class="flex flex-col gap-4">
				<app-pagination v-bind="{ count: 100 }" />
				<app-pagination v-bind="{ count: 40 }" />
				<app-pagination v-bind="{ count: 20 }" />
			</div>
		</preview-section>

		<preview-section>
			<template #title>
				Without items
			</template>

			<div class="border border-grey-200 bg-grey-50 p-4">
				<app-pagination v-bind="{ count: 0 }" />
			</div>
		</preview-section>

		<preview-section>
			<template #title>
				Single page
			</template>

			<div class="border border-grey-200 bg-grey-50 p-4">
				<app-pagination v-bind="{ count: 10 }" />
			</div>
		</preview-section>
	</preview-wrapper>
</template>
