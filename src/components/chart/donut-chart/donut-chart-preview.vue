<template>
	<preview-wrapper>
		<template #title>
			donut-chart
		</template>

		<preview-section>
			<template #title>
				Section
			</template>

			<donut-chart v-bind="{ values: [50, 25, 25] }" class="size-48" />
		</preview-section>
	</preview-wrapper>
</template>
