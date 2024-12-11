# `app-pagination`

Given the number of items being displayed, `app-pagination` builds a list of relevant buttons to allow the user to navigate that list.

`app-pagination` does not control the list of items itself, allowing the parent component control over rendering, but it does provide an `@update:page` event, containing the number of the page to show.

The calculations `app-pagination` makes are live, meaning that if the number of items changes (such as if a filter is applied), this may also change the pagination buttons shown, and will reset the current page back to the first page.

Pagination will automatically be hidden if there are no items, or if the number of items given all fit onto a single page.

## Slots

### `previous-page-label`

- default: `Previous page`

The label for the previous page button.

### `next-page-label`

- default: `Next page`

The label for the previous page button.

## Props

### `count`

- type: `number`
- default: `0`

The number of items in the paginated collection.

### `label`

- type: `string`
- default: `Pagination`

The label for the pagination, intended to explain to screen reader users the purpose of the navigation.

## Events

### `@update:page`

Updated when the user selects a different page to display, containing a `page` parameter with that selected page.

## Methods

### `method`

...

## Examples

### Basic pagination

```html
<app-pagination v-bind="{ count: 100 }" />
```
