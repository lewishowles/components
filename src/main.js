import "@/assets/css/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import components from "./index";
import router from "@/router";

import CodeBlock from "@/views/components/fragments/code-block.vue";
import ComponentPlayground from "@/views/components/fragments/component-playground.vue";
import PropTitle from "@/views/components/fragments/prop-title.vue";

const app = createApp(App);

// Install our global components for our documentation
app.component("CodeBlock", CodeBlock);
app.component("ComponentPlayground", ComponentPlayground);
app.component("PropTitle", PropTitle);

app.use(components);
app.use(router);
app.mount("#app");
