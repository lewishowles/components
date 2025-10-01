import{u as l,r as t,b as i,o as a,d as o,e as n,f as m,w as u,g as d,h as f}from"./index-oYmCEX-m.js";const b={class:"prose prose-slate dark:prose-invert *:animate-fade-in *:delay"},c=`import { createApp } from "vue";
import App from "./App.vue";
import components from "@lewishowles/components";

const app = createApp(App);

app.use(components);
app.mount("#app");`,v={__name:"page-getting-started",setup(g){const{setTitle:r}=l();return r("Getting started"),(y,e)=>{const p=t("code-block"),s=t("router-link");return a(),i("div",b,[e[2]||(e[2]=o("h1",null,"Getting started",-1)),e[3]||(e[3]=o("p",null,"At the moment, components in the library are registered globally, so there is no need to manually import any of the components. To use the library, set it up in your main file, for example:",-1)),n(p,{code:c}),e[4]||(e[4]=o("h2",null,"Using a component",-1)),e[5]||(e[5]=o("p",null,"Since components are globally registered for now, you can simply use them directly anywhere in your app. For example:",-1)),e[6]||(e[6]=o("pre",null,`<ui-button @click="doMagic">
	🪄 Bibbidi-Bobbidi-Boo
</ui-button>`,-1)),e[7]||(e[7]=o("h2",null,"Available components",-1)),o("p",null,[e[1]||(e[1]=m(" You can find more information about each component on its relevant documentation page. For example, ",-1)),n(s,d(f({to:"forms/form-field"})),{default:u(()=>e[0]||(e[0]=[o("code",null,"form-field",-1)])),_:1,__:[0]},16)])])}}};export{v as default};
