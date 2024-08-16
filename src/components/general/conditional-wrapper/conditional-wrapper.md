# `conditional-wrapper`

`conditional-wrapper` is a helper component that makes it easy to optionally wrap one or more elements in a tag. This might be useful, for example, to group items together when there are more than one, but keep a template simple otherwise.

## Slots

### `default`

The default slot contains the content to be wrapped.

## Props

### `wrap`

- type: `boolean`
- default: `true`

Whether to apply the wrapper. If  `false`, the contents are unwrapped and display as if `conditional-wrapper` was not used.

_Note that this component does not inherit attributes when `wrap` is set to false, as there may be multiple root nodes._

### `tag`

- type: `string`
- default: `div`

The tag to use when wrapping content.

## Examples

### Basic usage

```html
<conditional-wrapper v-bind="{ wrap: haveIcon }" class="flex items-center">
	<icon-user v-if="haveIcon" />

	Username
</conditional-wrapper>
```
