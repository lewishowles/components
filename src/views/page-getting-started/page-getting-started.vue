<template>
	<div class="prose prose-slate dark:prose-invert *:animate-fade-in *:delay">
		<h1>Getting started</h1>

		<p>At the moment, components in the library are registered globally, so there is no need to manually import any of the components. To use the library, set it up in your main file, for example:</p>

		<pre>
import { createApp } from "vue";
import App from "./App.vue";
import components from "@lewishowles/components";

const app = createApp(App);

app.use(components);
app.mount("#app");</pre>

		<h2>Using a component</h2>

		<p>Since components are globally registered for now, you can simply use them directly anywhere in your app. For example:</p>

		<pre>
&lt;ui-button @click="doMagic"&gt;
	🪄 Bibbidi-Bobbidi-Boo
&lt;/ui-button&gt;</pre>

		<h2>Available components</h2>

		<p>
			You can find more information about each component on its relevant documentation page. For example,
			<router-link v-bind="{ to: 'forms/form-field' }">
				<code>form-field</code>
			</router-link>
		</p>
	</div>
</template>

<script setup>
import useTitle from "@/composables/use-title/use-title";

const { setTitle } = useTitle();

setTitle("Getting started");
</script>
