# Components

A library of beautiful, heavily-tested components with a focus on accessibility, as well as ease of use for developers and users.

[View documentation](https://components.howles.dev)

## Heavily tested?

The goal is to test the components as thoroughly as possible, from unit tests for more complex computed properties, to Cypress simulating user interactions. The library currently sits at >800 Vitest unit tests and >400 Cypress component tests.

## Why accessibility?

Accessibility is one of the most important things we can spend time improving. The web is for everyone, and making steps to ensure content is as accessible as possible helps everyone, not just those who need it most.

This library helps improve accessibility in two primary ways; the first by implementing the components with accessibility in mind, so a developer can be confident out of the box; and the second by using the documentation to help promote the mindset of accessibility. In addition, some components show visible errors if standards aren't met—such as form fields requiring labels.

## Setup

Automatic imports are recommended. Using [`unplugin-vue-components`](https://github.com/unplugin/unplugin-vue-components) and the library's resolver, components are automatically imported only when used:

```javascript
// vite.config.js
import { componentsResolver } from "@lewishowles/components/resolver";
import Components from "unplugin-vue-components/vite";

export default defineConfig({
	plugins: [Components({ resolvers: [componentsResolver()] })],
});
```

Named imports and a global Vue plugin are also available. The [getting-started guide](https://components.howles.dev/getting-started) covers all three, along with overriding components.

### Stylesheets

Each component is styled with Tailwind, so each project needs Tailwind (version 4) as well. You also need to add the library as a source, so that Tailwind can generate the utility classes that the components use. Import this into your Tailwind entry stylesheet (e.g. `main.css`):

```css
@import "@lewishowles/components/source";
```

The [theming guide](https://components.howles.dev) covers re-colouring the library with your own brand.

## Using a component

Once the library is set up, you can use any component by tag anywhere in your app. For example:

```html
<ui-button @click="doMagic">🪄 Bibbidi-Bobbidi-Boo</ui-button>
```

## Available components

Every component is documented, with live examples, on the [documentation site](https://components.howles.dev).

## Roadmap

There are a number of improvements and new components that could be made to improve flexibility.

- Stepper - to show step-by-step information or a multi-page form
  - "Allow progress" setting and method
  - "Allow backtrack"
- Create a new public-facing website to display components and variants
