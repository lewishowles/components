<template>
	<li>
		<span class="text-grey-500 font-semibold">
			<slot name="title" />
		</span>

		<div class="h-px w-full bg-gradient-to-r from-grey-200 mt-3 mb-2" />

		<ol>
			<slot />
		</ol>
	</li>
</template>
