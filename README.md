# Components

A library of beautiful components with a focus on accessibility, as well as ease of use for developers and for users.

## Why accessibility?

Accessibility is one of the most important things we can spend time improving. The web is for everyone, and making steps to ensure content is as accessible as possible helps everyone, not just those who need it most.

This library helps improve accessibility in two primary ways; the first by implementing the components with accessibility in mind, so a developer can be confident out of the box; and the second by using the documentation to help promote the mindset of accessibility. In addition, some components show visible errors if standards are not met—such as form fields requiring labels.

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

## Available components

You can find more information about each component on its relevant docs page.

### Forms

- [form-field](/src/components/form/form-field/form-field.md)
- [form-fieldset](/src/components/form/form-fieldset/form-fieldset.md)
- [form-layout](/src/components/form/form-layout/form-layout.md)
- [form-wrapper](/src/components/form/form-wrapper/form-wrapper.md)
- [form-actions](/src/components/form/form-actions/form-actions.md)

### Interaction

- [copy-content](/src/components/interaction/copy-content/copy-content.md)
- [dropdown-menu](/src/components/interaction/dropdown-menu/dropdown-menu.md)
- [link-tag](/src/components/interaction/link-tag/link-tag.md)
- [loading-indicator](/src/components/interaction/loading-indicator/loading-indicator.md)
- [star-rating](/src/components/interaction/star-rating/star-rating.md)
- [ui-button](/src/components/interaction/ui-button/ui-button.md)

### Content

- [accordion-group](/src/components/content/accordion-group/accordion-group.md)
- [accordion-section](/src/components/content/accordion-section/accordion-section.md)
- [data-table](/src/components/content/data-table/data-table.md)
- [display-date](/src/components/content/display-date/display-date.md)
- [floating-details](/src/components/content/floating-details/floating-details.md)
- [notification-handler](/src/components/content/notification-handler/notification-handler.md)
- [skeleton-loader](/src/components/interaction/skeleton-loader/skeleton-loader.md)
- [summary-details](/src/components/content/summary-details/summary-details.md)
- [tab-group](/src/components/content/tab-group/tab-group.md)

### Icons

- [icons](/src/components/icon/icon.md)

### Navigation

- [breadcrumb-list](/src/components/navigation/breadcrumb-list/breadcrumb-list.md)
- [app-pagination](/src/components/navigation/app-pagination/app-pagination.md)

### Data

- [searchable-list](/src/components/data/searchable-list/searchable-list.md)

### Display

- [image-tag](/src/components/display/image-tag/image-tag.md)
- [user-avatars](/src/components/display/user-avatars/user-avatars.md)

### Messaging

- [alert-message](/src/components/messaging/alert-message/alert-message.md)
- [modal-dialog](/src/components/messaging/modal-dialog/modal-dialog.md)
- [pill-badge](/src/components/messaging/pill-badge/pill-badge.md)

### Chart

- [donut-chart](/src/components/chart/donut-chart/donut-chart.md)
- [progress-bar](/src/components/chart/progress-bar/progress-bar.md)

### General

- [conditional-wrapper](/src/components/general/conditional-wrapper/conditional-wrapper.md)

## Scaffolding

Special scaffold scripts have been created to generate files for a new component (or icon). These can be found at `support/scaffold-component.sh` and `support/scaffold-icon.sh`.

## Roadmap

There are a number of improvements and new components that could be made to improve flexibility.

- Stepper - to show step-by-step information or a multi-page form
  - "Allow progress" setting and method
  - "Allow backtrack"
- Devise a system to allow the definition of a "brand colour" and "dark brand colour" to override any defaults. Perhaps a stylesheet.
- Add notes about default recommended stylesheet.
- Create a new public-facing website to display components and variants
