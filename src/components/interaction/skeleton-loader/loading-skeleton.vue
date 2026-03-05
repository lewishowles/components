<template>
	<div>
		<div class="sr-only" aria-live="polite" data-test="loading-skeleton">
			<slot name="label" />
		</div>

		<slot />
	</div>
</template>
