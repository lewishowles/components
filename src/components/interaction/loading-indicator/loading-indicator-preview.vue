<template>
	<preview-wrapper>
		<template #title>
			loading-indicator
		</template>

		<preview-section>
			<template #title>
				Basic indicators
			</template>

			<loading-indicator>
				Loading data…
			</loading-indicator>

			<loading-indicator v-bind="{ large: true }">
				Loading data…
			</loading-indicator>
		</preview-section>
	</preview-wrapper>
</template>
