<template>
	<div class="prose prose-slate dark:prose-invert *:animate-fade-in *:delay">
		<h1>Getting started</h1>

		<p>
			At the moment, components in the library are registered globally, so there's no need to
			manually import any of the components. To use the library, set it up in your main file, for
			example:
		</p>

		<code-block :code="pluginSetupCode" />

		<h2>Stylesheets and Tailwind</h2>

		<p>
			Each component is styled with Tailwind, so your project needs Tailwind (version 4) as well.
			You also need to add the library as a source, so that Tailwind can generate the utility
			classes that the components use. Import this into your Tailwind entry stylesheet (e.g.
			`main.css`):
		</p>

		<code-block :code="sourceExample" />

		<p>
			The
			<router-link v-bind="{ to: '/theming' }"> theming guide </router-link>
			covers the stylesheets to include and how to re-colour the library with your own brand.
		</p>

		<h2>Using a component</h2>

		<p>
			Since components are globally registered for now, you can use them directly anywhere in your
			app. For example:
		</p>

		<pre>
&lt;ui-button @click="doMagic"&gt;
	🪄 Bibbidi-Bobbidi-Boo
&lt;/ui-button&gt;</pre
		>

		<h2>Available components</h2>

		<p>
			You can find more information about each component on its relevant documentation page. For
			example,
			<router-link v-bind="{ to: '/form/form-field' }">
				<code>form-field</code>
			</router-link>
		</p>
	</div>
</template>

<script setup>
import useTitle from "@/docs/composables/use-title/use-title";

const { setTitle } = useTitle();

setTitle("Getting started");

const pluginSetupCode = `import { createApp } from "vue";
import App from "./App.vue";
import components from "@lewishowles/components";

const app = createApp(App);

app.use(components);
app.mount("#app");`;

const sourceExample = `@import "@lewishowles/components/source";`;
</script>
