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

## Using a component

Since components are globally registered for now, you can simply use them directly anywhere in your app. For example:

```html
<ui-button @click="doMagic">
	🪄 Bibbidi-Bobbidi-Boo
</ui-button>
```

## Components

You can find more information about each component on its relevant docs page.

### Forms

- [form-input](/src/components/form/form-input/form-input.md)
- [radio-group](/src/components/form/radio-group/radio-group.md)
- [button-group](/src/components/form/button-group/button-group.md)
- [form-layout](/src/components/form/form-layout/form-layout.md)
- [form-actions](/src/components/form/form-actions/form-actions.md)

### Interaction

- [ui-button](/src/components/interaction/ui-button/ui-button.md)
- [link-tag](/src/components/interaction/link-tag/link-tag.md)
- [summary-details](/src/components/interaction/summary-details/summary-details.md)
- [loading-indicator](/src/components/interaction/loading-indicator/loading-indicator.md)

### Messaging

- [pill-badge](/src/components/messaging/pill-badge/pill-badge.md)

### Chart

- [donut-chart](/src/components/chart/donut-chart/donut-chart.md)

### General

- [conditional-wrapper](/src/components/general/conditional-wrapper/conditional-wrapper.md)

### Icons

- [icons](/src/components/icon/icon.md)

## Scaffolding

Special scaffold scripts have been created to generate files for a new component (or icon). These can be found at `support/scaffold-component.sh` and `support/scaffold-icon.sh`.

## Roadmap

Some components that I would like to build soon include, likely in this order.

- Textarea - Replace a standard textarea and offer the conveniences found in other form components.
- Checkbox - Replace checkboxes and offer the simple implementation found in `form-radio`.
- Tabs - Allowing easy, accessible tabbed content.
- Alerts - Consistently display alert messages to user.
- Image tag - Providing automatic broken image handling and optional `object-fit` options.
- Progress bar - Given a current value and a maximum value, show an accessible, simple progress meter.
- Form wrapper - Handling communication between individual form fields and a parent form, collating all responses into one object, providing an accessible error summary based on validation configuration, and more.
- Data table - Providing built-in options for searching, sorting, pagination, filtering, and custom display of any data in a table.
