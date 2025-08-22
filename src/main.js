import "@/assets/css/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import components from "./index";
import router from "@/router";
import registerDocumentationComponents from "@/docs/helpers/register-documentation-components";

const app = createApp(App);

registerDocumentationComponents(app);

app.use(components);
app.use(router);
app.mount("#app");
