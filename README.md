# Components

A library of beautiful, heavily-tested components with a focus on accessibility, as well as ease of use for developers and users.

[View documentation](https://components.howles.dev)

## Heavily tested?

The goal is to test the components as thoroughly as possible, from unit tests for more complex computed properties, to Cypress simulating user interactions. The library currently sits at >800 Vitest unit tests and >400 Cypress component tests.

## Why accessibility?

Accessibility is one of the most important things we can spend time improving. The web is for everyone, and making steps to ensure content is as accessible as possible helps everyone, not just those who need it most.

This library helps improve accessibility in two primary ways; the first by implementing the components with accessibility in mind, so a developer can be confident out of the box; and the second by using the documentation to help promote the mindset of accessibility. In addition, some components show visible errors if standards aren't met—such as form fields requiring labels.

## Setup

At the moment, components in the library are registered globally, so there's no need to manually import any of the components. To use the library, set it up in your main file, for example:

```javascript
import { createApp } from "vue";
import App from "./App.vue";
import components from "@lewishowles/components";

const app = createApp(App);

app.use(components);
app.mount("#app");
```

## Using a component

Since components are globally registered for now, you can use them directly anywhere in your app. For example:

```html
<ui-button @click="doMagic"> 🪄 Bibbidi-Bobbidi-Boo </ui-button>
```

## Available components

Every component is documented, with live examples, on the [documentation site](https://components.howles.dev).

## Roadmap

There are a number of improvements and new components that could be made to improve flexibility.

- Stepper - to show step-by-step information or a multi-page form
  - "Allow progress" setting and method
  - "Allow backtrack"
- Devise a system to allow the definition of a "brand colour" and "dark brand colour" to override any defaults. Perhaps a stylesheet.
- Add notes about default recommended stylesheet.
- Create a new public-facing website to display components and variants
