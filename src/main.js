import "@/assets/css/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import components from "./index";
import previews from "./previews";

const app = createApp(App);

app.use(components);
app.use(previews);
app.mount("#app");
