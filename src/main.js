import "@/assets/css/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import components from "./index";
import router from "@/router";

const app = createApp(App);

app.use(components);
app.use(router);
app.mount("#app");
