<template>
	<div class="prose prose-slate dark:prose-invert *:animate-fade-in *:delay">
		<h1>
			<slot name="title" />
		</h1>

		<slot name="introduction" />
	</div>

	<tab-group class="mt-10">
		<slot />
	</tab-group>
</template>
