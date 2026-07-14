import{Ct as e,M as t,O as n,V as r,h as i,m as a,s as o,u as s,v as c}from"./runtime-core.esm-bundler-BaKzqvAT.js";import{Lt as l}from"./index-BK6arjTw.js";var u={class:`prose prose-slate dark:prose-invert *:animate-fade-in *:delay`},d=`import { createApp } from "vue";
import App from "./App.vue";
import components from "@lewishowles/components";

const app = createApp(App);

app.use(components);
app.mount("#app");`,f=`@import "@lewishowles/components/styles";`,p=`script`,m=`// vite.config.js
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
</template>`;return(l,p)=>{let g=t(`link-tag`),_=t(`code-block`),y=t(`router-link`);return n(),s(`div`,u,[p[8]||=o(`h1`,null,`Getting started`,-1),p[9]||=o(`h2`,null,`Importing components`,-1),p[10]||=o(`h3`,null,`Automatic imports (recommended)`,-1),o(`p`,null,[p[1]||=a(` Using `,-1),i(g,e(c({href:`https://github.com/unplugin/unplugin-vue-components`,external:!0})),{default:r(()=>[...p[0]||=[a(` unplugin-vue-components `,-1)]]),_:1},16),p[2]||=a(` and the library's resolver, components are automatically imported only when used. `,-1)]),i(_,{code:m}),p[11]||=o(`h3`,null,`Named imports (optional)`,-1),p[12]||=o(`p`,null,[a(` If you'd rather import components explicitly, or you aren't using `),o(`code`,null,`unplugin-vue-components`),a(` , you can import components individually. `)],-1),i(_,{code:v}),p[13]||=o(`h3`,null,`Global plugin (fallback)`,-1),p[14]||=o(`p`,null,` The simplest option is with the Vue plugin, which will register every component globally in your main file. There's nothing to import in your templates, but the whole library is bundled whether you use it or not. Best for prototyping, or apps that use most of the components. `,-1),i(_,{code:d}),p[15]||=o(`h3`,null,`Overriding a component`,-1),p[16]||=o(`p`,null,` The simplest way to use an override component that shares the name of the component it overrides is to register it globally. When doing so, make sure to exclude the original component from automatic imports. `,-1),i(_,{code:h}),p[17]||=o(`h2`,null,`Stylesheets and Tailwind`,-1),p[18]||=o(`p`,null," Each component is styled with Tailwind, so each project needs Tailwind (version 4) as well. You also need to import the library styles so component CSS and generated utility classes are available. Import this into your Tailwind entry stylesheet (e.g. `main.css`): ",-1),i(_,{code:f}),o(`p`,null,[p[4]||=a(` The `,-1),i(y,e(c({to:`/theming`})),{default:r(()=>[...p[3]||=[a(`theming guide`,-1)]]),_:1},16),p[5]||=a(` covers the stylesheets to include and how to re-colour the library with your own brand. `,-1)]),p[19]||=o(`h2`,null,`Using a component`,-1),p[20]||=o(`p`,null,` Once the library is set up, you can use any component by tag anywhere in your app. For example: `,-1),p[21]||=o(`pre`,null,`<ui-button @click="doMagic">
	🪄 Bibbidi-Bobbidi-Boo
</ui-button>`,-1),p[22]||=o(`h2`,null,`Available components`,-1),o(`p`,null,[p[7]||=a(` You can find more information about each component on its relevant documentation page. For example, `,-1),i(y,e(c({to:`/form/form-field`})),{default:r(()=>[...p[6]||=[o(`code`,null,`form-field`,-1)]]),_:1},16)])])}}};export{g as default};