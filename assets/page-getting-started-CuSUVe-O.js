import{M as e,O as t,V as n,h as r,m as i,s as a,u as o,v as s,xt as c}from"./runtime-core.esm-bundler-CyDMPmLI.js";import{jt as l}from"./index-Dq2l2Sk3.js";var u={class:`prose prose-slate dark:prose-invert *:animate-fade-in *:delay`},d=`import { createApp } from "vue";
import App from "./App.vue";
import components from "@lewishowles/components";

const app = createApp(App);

app.use(components);
app.mount("#app");`,f=`@import "@lewishowles/components/source";`,p=`script`,m=`// vite.config.js
import { componentsResolver } from "@lewishowles/components/resolver";
import Components from "unplugin-vue-components/vite";

export default defineConfig({
	plugins: [
		Components({ resolvers: [componentsResolver()] }),
	],
});`,h=`// overrides.js
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
});`,g={__name:`page-getting-started`,setup(g){let{setTitle:_}=l();_(`Getting started`);let v=`<${p} setup>
import { UiButton } from "@lewishowles/components";
</${p}>

<template>
	<ui-button @click="doMagic">
		🪄 Bibbidi-Bobbidi-Boo
	</ui-button>
</template>`;return(l,p)=>{let g=e(`link-tag`),_=e(`code-block`),y=e(`router-link`);return t(),o(`div`,u,[p[8]||=a(`h1`,null,`Getting started`,-1),p[9]||=a(`h2`,null,`Importing components`,-1),p[10]||=a(`h3`,null,`Automatic imports (recommended)`,-1),a(`p`,null,[p[1]||=i(` Using `,-1),r(g,c(s({href:`https://github.com/unplugin/unplugin-vue-components`,external:!0})),{default:n(()=>[...p[0]||=[i(` unplugin-vue-components `,-1)]]),_:1},16),p[2]||=i(` and the library's resolver, components are automatically imported only when used. `,-1)]),r(_,{code:m}),p[11]||=a(`h3`,null,`Named imports (optional)`,-1),p[12]||=a(`p`,null,[i(` If you'd rather import components explicitly, or you aren't using `),a(`code`,null,`unplugin-vue-components`),i(` , you can import components individually. `)],-1),r(_,{code:v}),p[13]||=a(`h3`,null,`Global plugin (fallback)`,-1),p[14]||=a(`p`,null,` The simplest option is with the Vue plugin, which will register every component globally in your main file. There's nothing to import in your templates, but the whole library is bundled whether you use it or not. Best for prototyping, or apps that use most of the components. `,-1),r(_,{code:d}),p[15]||=a(`h3`,null,`Overriding a component`,-1),p[16]||=a(`p`,null,` The simplest way to use an override component that shares the name of the component it overrides is to register it globally. When doing so, make sure to exclude the original component from automatic imports. `,-1),r(_,{code:h}),p[17]||=a(`h2`,null,`Stylesheets and Tailwind`,-1),p[18]||=a(`p`,null," Each component is styled with Tailwind, so each project needs Tailwind (version 4) as well. You also need to add the library as a source, so that Tailwind can generate the utility classes that the components use. Import this into your Tailwind entry stylesheet (e.g. `main.css`): ",-1),r(_,{code:f}),a(`p`,null,[p[4]||=i(` The `,-1),r(y,c(s({to:`/theming`})),{default:n(()=>[...p[3]||=[i(`theming guide`,-1)]]),_:1},16),p[5]||=i(` covers the stylesheets to include and how to re-colour the library with your own brand. `,-1)]),p[19]||=a(`h2`,null,`Using a component`,-1),p[20]||=a(`p`,null,` Once the library is set up, you can use any component by tag anywhere in your app. For example: `,-1),p[21]||=a(`pre`,null,`<ui-button @click="doMagic">
	🪄 Bibbidi-Bobbidi-Boo
</ui-button>`,-1),p[22]||=a(`h2`,null,`Available components`,-1),a(`p`,null,[p[7]||=i(` You can find more information about each component on its relevant documentation page. For example, `,-1),r(y,c(s({to:`/form/form-field`})),{default:n(()=>[...p[6]||=[a(`code`,null,`form-field`,-1)]]),_:1},16)])])}}};export{g as default};