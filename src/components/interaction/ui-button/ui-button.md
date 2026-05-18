# `ui-button`

`ui-button` is an extension of the standard `button` element.

## Slots

### `default`

The default slot contains the content to display in the button.

### `loading-label`

- default: "Loading"

The text to show to screen-reader users when this button is in its `reactive` state.

## Props

### `iconStart` and `iconEnd`

- type: `string`
- default: `null`

An icon to display at the start or end of a button.

The icon is implemented using `<component :is="...">`, allowing the button to use icons it doesn't explicitly import. To be used in this way, the icon must be globally registered. You can find [the list of available icons in this project](/src/components/icon/icon.md), or you can use one that is globally registered in your project.

_Note that `start` and `end` depend on the current document direction._

### `iconOnly`

- type: `boolean`
- default: `false`

Whether to only show an icon (and not the associated text). If true, the text is hidden via an `sr-only` class, so is still accessible to screen readers and therefore important. The displayed icon is also shown at `1em` size when alone, to better fill the button.

### `reactive`

- type: `boolean`
- default: `false`

When a button is `reactive`, it will show a loading indicator when activated. This can be deactivated via the exposed `reset` method.

### `iconClasses`

- type: `Vue class binding`
- default: `null`

Any classes to add to the icon itself. If a size class is added (`size-`), the default size class will not be included.

### `pressed`

- type: `boolean | null`
- default: `null`

The pressed state of this button, for toggle buttons. When `true` or `false`, `aria-pressed` is set accordingly. When `null` (default), `aria-pressed` is not set and the button behaves as a normal action button.

This is a controlled prop — the consumer owns the state and passes it in. That matters because toggle actions are often async (a mute request might fail), and `aria-pressed` must reflect actual truth, not an optimistic flip.

The visible label must remain stable across pressed and unpressed states; `aria-pressed` alone conveys the state change to screen reader users.

### `disabled`

- type: `boolean`
- default: `false`

Whether this button is disabled. Rather than using the native `disabled` attribute, which removes the button from the tab order entirely, this prop sets `aria-disabled="true"` and swallows click events. The button remains focusable so keyboard and screen reader users can still encounter it and understand the action is currently unavailable.

## Events

### `click`

Emitted when the button is clicked or activated via keyboard.

## Methods

### `react`

Show the "reacting" state, as though someone had clicked the button. This is helpful if another element performs the same action as the button might, but you still want to show feedback to the user.

### `reset`

Reset the reactive state of a reactive button.

## Examples

### Basic button

```html
<ui-button @click="doMagic">
	🪄 Bibbidi-Bobbidi-Boo
</ui-button>
```

### With an icon

```html
<ui-button v-bind="{ iconStart: 'icon-reload' }" @click="reload">
	Reload
</ui-button>

<ui-button v-bind="{ iconEnd: 'icon-arrow-right' }" @click="toInfinityAndBeyond">
	Next step
</ui-button>
```

### Toggle button

```html
<ui-button v-bind="{ pressed: isMuted }" @click="toggleMute">
	Mute
</ui-button>
```

### Reactive

```html
<ui-button ref="saveButton" v-bind="{ reactive: true }" @click="save">
	Save user details
</ui-button>
```

```javascript
const saveButton = ref("saveButton");

// ...

function save() {
	// ...

	saveButton.value.reset();
}
```
