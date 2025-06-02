<template>
	<div>
		<div class="sr-only" aria-live="polite" data-test="skeleton-loader">
			<slot name="label" />
		</div>

		<slot />
	</div>
</template>
