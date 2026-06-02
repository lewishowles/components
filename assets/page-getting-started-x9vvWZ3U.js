import{M as e,O as t,V as n,h as r,m as i,s as a,u as o,v as s,xt as c}from"./runtime-core.esm-bundler-BI-ka0hg.js";import{a as l}from"./index-ysAmWhLi.js";var u={class:`prose prose-slate dark:prose-invert *:animate-fade-in *:delay`},d=`import { createApp } from "vue";
import App from "./App.vue";
import components from "@lewishowles/components";

const app = createApp(App);

app.use(components);
app.mount("#app");`,f={__name:`page-getting-started`,setup(f){let{setTitle:p}=l();return p(`Getting started`),(l,f)=>{let p=e(`code-block`),m=e(`router-link`);return t(),o(`div`,u,[f[2]||=a(`h1`,null,`Getting started`,-1),f[3]||=a(`p`,null,` At the moment, components in the library are registered globally, so there is no need to manually import any of the components. To use the library, set it up in your main file, for example: `,-1),r(p,{code:d}),f[4]||=a(`h2`,null,`Using a component`,-1),f[5]||=a(`p`,null,` Since components are globally registered for now, you can simply use them directly anywhere in your app. For example: `,-1),f[6]||=a(`pre`,null,`<ui-button @click="doMagic">
	🪄 Bibbidi-Bobbidi-Boo
</ui-button>`,-1),f[7]||=a(`h2`,null,`Available components`,-1),a(`p`,null,[f[1]||=i(` You can find more information about each component on its relevant documentation page. For example, `,-1),r(m,c(s({to:`forms/form-field`})),{default:n(()=>[...f[0]||=[a(`code`,null,`form-field`,-1)]]),_:1},16)])])}}};export{f as default};