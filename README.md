# Components

A library of beautiful components, promoting rapid development, while ensuring that usability and accessibility are at the fore.

## Setup

At the moment, components in the library are registered globally, so there is no need to manually import any of the components. To use the library, set it up in your main file, for example:

```javascript
import { createApp } from "vue";
import App from "./App.vue";
import components from "@lewishowles/components";

const app = createApp(App);

app.use(components);
app.mount("#app");
```

## Components

For now, further descriptions, and the properties for each component can be found in their main files.

### Forms

- [form-input](src/components/form/form-input/form-input.vue)
- [form-layout](src/components/form/form-layout/form-layout.vue)

### Interaction

- [ui-button](src/components/interaction/ui-button/ui-button.vue)
- [link-tag](src/components/interaction/link-tag/link-tag.vue)

### General

- [conditional-wrapper](src/components/general/conditional-wrapper.vue)
