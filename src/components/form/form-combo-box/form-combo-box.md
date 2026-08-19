# `form-combo-box`

`form-combo-box` is a single-choice form field that filters known options by their labels. The input shows the selected label, while `v-model` contains the selected option's value.

## Model

The model contains the selected option's value, or `null` when no option is selected. It does not contain the input text. For example, the input can display `Quarterly review` while the model contains `record-42`.

Typing clears an existing selection on the first edit. Leaving the field without selecting a new option clears the unfinished input. Selecting with the pointer or keyboard stores the option value, displays its label, and closes the results.

Readonly fields inherit their state from `form-field`, not from a `form-combo-box` prop. A readonly field shows its selected label and does not open the results, filter options, select an option, or clear its value in response to user interaction.

## Slots

### `default`

The default slot contains the field label.

_A label is always required, even when it is visually hidden, so that the input has an accessible name._

### `optional-indicator`

Content shown after the label when the field is not required. Defaults to `(optional)`.

### `introduction`

Supporting text shown between the label and the input.

### `help`

Help text shown below the input.

### `error`

Custom validation error content shown below the input.

### `option`

Custom content for each result. The slot receives the original option, its normalised label and value, and `highlighted` and `selected` booleans.

| Slot prop     | Type                     | Description                                             |
| ------------- | ------------------------ | ------------------------------------------------------- |
| `option`      | `object\|string\|number` | The original option object, string, or number.          |
| `label`       | `string`                 | The normalised plain-text label used to filter options. |
| `value`       | `string \| number`       | The normalised value stored in the model.               |
| `highlighted` | `boolean`                | Whether keyboard navigation highlights the row.         |
| `selected`    | `boolean`                | Whether the row's value is in the model.                |

Keep option content non-interactive. Nested buttons, links, and other controls conflict with the option row's keyboard and pointer behaviour.

### `loading`

Content shown while `loading` is true. Loading takes priority over the empty and no-results states.

### `empty`

Content shown when no options were supplied.

### `no-results`

Content shown when options exist but none match the current query.

| Slot prop | Type     | Description        |
| --------- | -------- | ------------------ |
| `query`   | `string` | The current query. |

## Props

### `options`

- type: `array|object`
- default: `[]`

Options can be provided as an array of strings, numbers, or objects. Strings and numbers are used as both the label and value. Objects can provide `label` and `value` properties, or use the properties named by `labelKey` and `valueKey`. An object map such as `{ "record-42": "Quarterly review" }` uses each key as the option value and each value as its label.

### `labelKey`

- type: `string`
- default: `label`

For object options, the property named by this prop supplies the plain-text label used in the input and filtering. It is ignored for string and number options.

### `valueKey`

- type: `string`
- default: `value`

For object options, the property named by this prop supplies the value written to the model. It is ignored for string and number options. Values must be unique.

Duplicate values trigger a development warning that names the duplicate, and only the first option with that value is kept.

### `loading`

- type: `boolean`
- default: `false`

Set this while the options are being prepared. The selected value stays in the model, and the `loading` slot replaces the results.

### `id`

- type: `string`
- default: `null`

The ID applied to the text input. An ID is generated when this prop is omitted. Supplied IDs must be unique.

### `placeholder`

- type: `string`
- default: `null`

Placeholder text for the input.

### `inputAttributes`

- type: `object`
- default: `null`

Additional attributes forwarded to the input, such as `autocomplete`.

### `required`

- type: `boolean`
- default: `false`

Marks the field as required. Validation uses the selected model value, so entering text without selecting an option still fails the form's required rule.

### `displayLabel`

- type: `boolean`
- default: `true`

Whether to display the field label. When `false`, the label remains available to screen readers.

### `placement`

- type: `string`
- default: `"below"`

Preferred placement of the results list. The list flips above or below the input when it would clip the viewport edge.

### `align`

- type: `string`
- default: `"start"`

Whether to align the results list to the start or end of the input. The alignment also flips when the list would clip the viewport edge.

### `dropdownClasses`

- type: `string|array|object`
- default: `null`

Additional classes for the results list. Classes that conflict with the base styles override them.

## Methods

### `triggerFocus`

Move focus to the text input.

## Keyboard interaction

| Key         | Action                                                                          |
| ----------- | ------------------------------------------------------------------------------- |
| `ArrowDown` | Open the results and highlight the first result, or move to the next result.    |
| `ArrowUp`   | Open the results and highlight the last result, or move to the previous result. |
| `Enter`     | Select the highlighted result, or close the results when none is highlighted.   |
| `Escape`    | Close the results without selecting an option.                                  |
| `Tab`       | Close the results and clear uncommitted query text.                             |

## Styling hooks

| Attribute                         | Element        | Notes                                                 |
| --------------------------------- | -------------- | ----------------------------------------------------- |
| `data-component="form-combo-box"` | Root           | Scope styles to this component.                       |
| `data-invalid`                    | Root           | Present when error content is supplied.               |
| `data-state="open \| closed"`     | Root           | Current results-panel state.                          |
| `data-part="text-control"`        | Input wrapper  | Wraps the text input and form fragments.              |
| `data-part="dropdown"`            | Results panel  | Positioned panel containing the current result state. |
| `data-part="listbox"`             | Listbox        | Ordered, filtered options.                            |
| `data-part="option"`              | Option row     | Individual result row.                                |
| `data-part="status"`              | Status content | Loading, empty, or no-results message.                |

## Examples

### Basic usage

```html
<form-combo-box v-model="selectedRecordId" v-bind="{ options: records }">Record</form-combo-box>
```

### Object options with matching labels

```js
const records = [
	{ id: "record-42", name: "Quarterly review", updated: "2 July 2024" },
	{ id: "record-57", name: "Quarterly review", updated: "21 May 2024" },
];
```

```html
<form-combo-box
	v-model="selectedRecordId"
	v-bind="{ options: records, labelKey: 'name', valueKey: 'id' }"
>
	Record

	<template #option="{ option, highlighted, selected }">
		<div :class="{ 'font-semibold': highlighted }">
			{{ option.name }}
			<span class="text-content-muted">Updated {{ option.updated }}</span>
			<span v-if="selected" class="sr-only">Selected</span>
		</div>
	</template>
</form-combo-box>
```
