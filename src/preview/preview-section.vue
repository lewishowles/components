<template>
	<div>
		<h2 class="relative -ms-4 mb-4 inline-block py-1 ps-4 text-lg font-bold text-grey-950">
			<div class="absolute inset-y-0 end-full w-1 rounded-sm bg-[#be185d]" />
			<slot name="title" />
		</h2>

		<slot />
	</div>
</template>
