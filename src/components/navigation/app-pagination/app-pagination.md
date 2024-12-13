# `app-pagination`

Given the number of items being displayed, `app-pagination` builds a list of relevant buttons to allow the user to navigate that list.

`app-pagination` does not control the list of items itself, allowing the parent component control over rendering, but it does provide an `@update:page` event, containing the number of the page to show.

The calculations `app-pagination` makes are live, meaning that if the number of items changes (such as if a filter is applied), this may also change the pagination buttons shown, and will reset the current page back to the first page.

Pagination will automatically be hidden if there are no items, or if the number of items given all fit onto a single page.

**Please note:** Currently, pagination uses buttons. Ideally, it will be updated to use anchors, updating the URL when the page changes, and be able to read the current page from the URL on load.

## Slots

### `previous-page-label`

- default: `Previous page`

The label for the previous page button.

### `next-page-label`

- default: `Next page`

The label for the previous page button.

### `page-number-label`

- default: `Page {n}`
- params:
  - `page`
    - type: `number`
    - The number of the page.

The accessible label for each page. This slot is provided a `page` parameter containing the current page number.

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

## Examples

### Basic pagination

```html
<app-pagination v-bind="{ count: 100 }" />
```
