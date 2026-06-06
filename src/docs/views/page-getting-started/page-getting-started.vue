<template>
	<div class="prose prose-slate dark:prose-invert *:animate-fade-in *:delay">
		<h1>Getting started</h1>

		<h2>Importing components</h2>

		<h3>Automatic imports (recommended)</h3>

		<p>
			Using
			<link-tag
				v-bind="{ href: 'https://github.com/unplugin/unplugin-vue-components', external: true }"
			>
				unplugin-vue-components
			</link-tag>
			and the library's resolver, components are automatically imported only when used.
		</p>

		<code-block :code="resolverConfigExample" />

		<h3>Named imports (optional)</h3>

		<p>
			If you'd rather import components explicitly, or you aren't using
			<code>unplugin-vue-components</code>
			, you can import components individually.
		</p>

		<code-block :code="namedImportExample" />

		<h3>Global plugin (fallback)</h3>

		<p>
			The simplest option is with the Vue plugin, which will register every component globally in
			your main file. There's nothing to import in your templates, but the whole library is bundled
			whether you use it or not. Best for prototyping, or apps that use most of the components.
		</p>

		<code-block :code="pluginSetupCode" />

		<h3>Overriding a component</h3>

		<p>
			The simplest way to use an override component that shares the name of the component it
			overrides is to register it globally. When doing so, make sure to exclude the original
			component from automatic imports.
		</p>

		<code-block :code="overrideExample" />

		<h2>Stylesheets and Tailwind</h2>

		<p>
			Each component is styled with Tailwind, so each project needs Tailwind (version 4) as well.
			You also need to add the library as a source, so that Tailwind can generate the utility
			classes that the components use. Import this into your Tailwind entry stylesheet (e.g.
			`main.css`):
		</p>

		<code-block :code="sourceExample" />

		<p>
			The
			<router-link v-bind="{ to: '/theming' }">theming guide</router-link>
			covers the stylesheets to include and how to re-colour the library with your own brand.
		</p>

		<h2>Using a component</h2>

		<p>
			Once the library is set up, you can use any component by tag anywhere in your app. For
			example:
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

const scriptTag = "script";

const namedImportExample = `<${scriptTag} setup>
import { UiButton } from "@lewishowles/components";
</${scriptTag}>

<template>
	<ui-button @click="doMagic">
		🪄 Bibbidi-Bobbidi-Boo
	</ui-button>
</template>`;

const resolverConfigExample = `// vite.config.js
import { componentsResolver } from "@lewishowles/components/resolver";
import Components from "unplugin-vue-components/vite";

export default defineConfig({
	plugins: [
		Components({ resolvers: [componentsResolver()] }),
	],
});`;

const overrideExample = `// overrides.js
import UiButton from "./translations/ui-button.vue";

export const overrides = { "ui-button": UiButton };

// main.js: register overrides globally
import { overrides } from "./overrides";

Object.entries(overrides).forEach(([name, component]) => {
	app.component(name, component);
});

// vite.config.js: exclude the same tags from auto-import
import { overrides } from "./overrides";

Components({
	resolvers: [componentsResolver({ exclude: Object.keys(overrides) })],
});`;
</script>
