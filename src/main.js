import "@/assets/css/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import components from "./index";
import router from "@/router";

import CodeBlock from "@/views/components/fragments/code-block/code-block.vue";
import ComponentPage from "@/views/components/fragments/component-page/component-page.vue";
import ComponentProps from "@/views/components/fragments/component-page/fragments/component-props/component-props.vue";
import ComponentProp from "@/views/components/fragments/component-page/fragments/component-prop/component-prop.vue";
import ComponentSlots from "@/views/components/fragments/component-page/fragments/component-slots/component-slots.vue";
import ComponentSlot from "@/views/components/fragments/component-page/fragments/component-slot/component-slot.vue";
import ComponentEvents from "@/views/components/fragments/component-page/fragments/component-events/component-events.vue";
import ComponentEvent from "@/views/components/fragments/component-page/fragments/component-event/component-event.vue";
import ComponentMethods from "@/views/components/fragments/component-page/fragments/component-methods/component-methods.vue";
import ComponentMethod from "@/views/components/fragments/component-page/fragments/component-method/component-method.vue";
import ComponentProvides from "@/views/components/fragments/component-page/fragments/component-provides/component-provides.vue";
import ComponentProvide from "@/views/components/fragments/component-page/fragments/component-provide/component-provide.vue";
import ComponentPlaygrounds from "@/views/components/fragments/component-page/fragments/component-playgrounds/component-playgrounds.vue";
import ComponentPlayground from "@/views/components/fragments/component-page/fragments/component-playground/component-playground.vue";

const app = createApp(App);

// Install our global components for our documentation
app.component("CodeBlock", CodeBlock);
app.component("ComponentPage", ComponentPage);
app.component("ComponentProps", ComponentProps);
app.component("ComponentProp", ComponentProp);
app.component("ComponentSlots", ComponentSlots);
app.component("ComponentSlot", ComponentSlot);
app.component("ComponentEvents", ComponentEvents);
app.component("ComponentEvent", ComponentEvent);
app.component("ComponentMethods", ComponentMethods);
app.component("ComponentMethod", ComponentMethod);
app.component("ComponentProvides", ComponentProvides);
app.component("ComponentProvide", ComponentProvide);
app.component("ComponentPlaygrounds", ComponentPlaygrounds);
app.component("ComponentPlayground", ComponentPlayground);

app.use(components);
app.use(router);
app.mount("#app");
