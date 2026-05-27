<template>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92 92" aria-hidden="true">
		<g fill="none">
			<path
				fill="var(--colour-logo-h)"
				d="M17 34.747c1.906-3.171 5.151-5.621 8.28-7.35q4.693-2.592 11.008-2.592 6.869 0 12.16 3.424 5.29 3.424 8.277 9.451A31.1 31.1 0 0 1 60 51.643V90H42.432V54.95q0-6.785-3.339-10.614-3.337-3.83-9.226-3.83-5.804 0-9.184 3.83C18.429 46.889 17 50.426 17 54.95V90H0V23C.384 8.244 6.103.536 17 0z"
			/>
			<path
				fill="var(--colour-logo-dot)"
				d="M80.462 91.28q-4.48 0-7.616-3.136-3.136-3.135-3.136-7.616t3.136-7.616 7.616-3.135 7.615 3.135 3.136 7.616-3.135 7.616-7.616 3.136"
			/>
		</g>
	</svg>
</template>

<style>
:root {
	--colour-logo-h: var(--color-purple-950);
	--colour-logo-dot: var(--color-purple-700);

	&:where(.dark, .dark *) {
		--colour-logo-h: #fff;
		--colour-logo-dot: var(--color-purple-300);
	}
}
</style>
