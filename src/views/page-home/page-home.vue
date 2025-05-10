<template>
	<div class="prose prose-slate dark:prose-invert *:animate-fade-in *:delay">
		<h1>@lewishowles/components</h1>

		<p>A library of beautiful components with a focus on accessibility, as well as ease of use for developers and for users.</p>

		<p>The components in this library have mostly been created as needed, to remove repetition from the process of creating interfaces, letting the developer focus on creating the best user experience they can.</p>

		<h2>Why accessibility?</h2>

		<p>Accessibility is one of the most important things we can spend time improving. The web is for everyone, and making steps to ensure content is as accessible as possible helps everyone, not just those who need it most.</p>

		<p>This library helps improve accessibility in two primary ways; the first by implementing the components with accessibility in mind, so a developer can be confident out of the box; and the second by using the documentation to help promote the mindset of accessibility. In addition, some components show visible errors if standards are not met—such as form fields requiring labels.</p>

		<p>
			<router-link v-bind="{ to: { name: 'getting-started' } }">
				Get started &rarr;
			</router-link>
		</p>
	</div>

	<div class="grid grid-cols-4 gap-4 mt-12">
		<div class="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-md animate-fade-in delay">
			<img src="/icon/forms.svg" class="size-12 block mx-auto my-6" />

			<h3 class="font-semibold">
				Forms
			</h3>

			<ol class="font-mono">
				<li>
					<router-link v-bind="{ to: 'forms/form-field' }" class="flex justify-between items-center group font-mono text-current no-underline hocus:underline py-1 block">
						form-field

						<icon-arrow-right class="size-3 group-hocus:opacity-100 -translate-x-1 group-hocus:translate-x-0 opacity-0 transition-all" />
					</router-link>
				</li>
			</ol>
		</div>
	</div>

	<!-- /icon/chart.svg
	/icon/content.svg
	/icon/data.svg
	/icon/display.svg
	/icon/forms.svg
	/icon/general.svg
	/icon/icons.svg
	/icon/interaction.svg
	/icon/messaging.svg
	/icon/navigation.svg -->
</template>
