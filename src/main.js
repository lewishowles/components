import "@/assets/css/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import components from "./index";
import previews from "./previews";

import IconPreview from "./components/icon/icon-preview.vue";

const app = createApp(App);

app.use(components);
app.component("IconPreview", IconPreview);
app.use(previews);
app.mount("#app");
