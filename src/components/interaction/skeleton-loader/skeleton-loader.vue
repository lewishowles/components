<template>
	<div class="sr-only" aria-live="polite" data-test="skeleton-loader">
		<slot name="label">
			Loading…
		</slot>
	</div>

	<slot />
</template>
