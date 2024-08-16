# `ui-button`

`ui-button` is an extension of the standard `button` element.

## Slots

### `default`

The default slot contains the content to display in the button.

## Props

### `iconStart` and `iconEnd`

- type: `string`
- default: `null`

An icon to display at the start or end of a button.

The icon is implemented using `<component :is="...">`, allowing the button to use icons it doesn't explicitly import. To be used in this way, the icon must be globally registered. You can find [the list of available icons in this project](/src/components/icon/icon.md), or you can use one that is globally registered in your project.

_Note that `start` and `end` depend on the current document direction._

### `reactive`

- type: `boolean`
- default: `false`

When a button is `reactive`, it will show a loading indicator when activated. This can be deactivated via the exposed `reset` method.

## Events

### `@click`

Emitted when the button is clicked.

## Methods

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

### Reactive

```html
<ui-button ref="saveButtonRef" v-bind="{ reactive: true }" @click="save">
	Save user details
</ui-button>
```

```javascript
const saveButtonRef = ref(null);

// ...

function save() {
	// ...

	saveButtonRef.value.reset();
}
```
