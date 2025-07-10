import{_ as r,c as p,a as o,d as n,b as i,w as l,n as s,g as a,r as m,o as u}from"./index-C-9BdKQx.js";const d={},f={class:"prose prose-slate dark:prose-invert *:animate-fade-in *:delay"};function b(y,e){const t=m("router-link");return u(),p("div",f,[e[2]||(e[2]=o("h1",null,"Getting started",-1)),e[3]||(e[3]=o("p",null,"At the moment, components in the library are registered globally, so there is no need to manually import any of the components. To use the library, set it up in your main file, for example:",-1)),e[4]||(e[4]=o("pre",null,`import { createApp } from "vue";
import App from "./App.vue";
import components from "@lewishowles/components";

const app = createApp(App);

app.use(components);
app.mount("#app");`,-1)),e[5]||(e[5]=o("h2",null,"Using a component",-1)),e[6]||(e[6]=o("p",null,"Since components are globally registered for now, you can simply use them directly anywhere in your app. For example:",-1)),e[7]||(e[7]=o("pre",null,`<ui-button @click="doMagic">
	🪄 Bibbidi-Bobbidi-Boo
</ui-button>`,-1)),e[8]||(e[8]=o("h2",null,"Available components",-1)),o("p",null,[e[1]||(e[1]=n(" You can find more information about each component on its relevant documentation page. For example, ")),i(t,s(a({to:"forms/form-field"})),{default:l(()=>e[0]||(e[0]=[n(" form-field → ")])),_:1,__:[0]},16)])])}const v=r(d,[["render",b]]);export{v as default};
