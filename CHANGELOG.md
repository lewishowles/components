# Changelog

# 0.21.0

### New components

- [`user-avatars`](/src/components/display/user-avatars/user-avatars.md)
- [`form-date`](/src/components/form/form-date/form-date.md)

### Updates

- `image-tag`: Now emits an `error` event when an image fails to load.
- `field-wrapper`: Now has a new `tag` prop, which enables the primary tag to be changed.

# 0.20.1 - 2025-02-04

### Fixes

- `form-textarea` - Fix an issue where `inputAttributes` expected a string, not an object.

# 0.20.0 - 2025-02-04

### Updates

- [Internal] - Update Tailwind to v4. This won't affect projects that use this package, as CSS is only used internally for testing.

### Fixes

- Better handle scenarios where a form-field is used without a form-wrapper, especially in testing.
- Remove a warning that could be triggered when using `form-checkbox` in a loop.

# 0.19.0 - 2025-01-29

### New components

- [`form-fieldset`](/src/components/form/form-fieldset/form-fieldset.md)
- [`data-table`](/src/components/content/data-table/data-table.md)
- Added a new `dropdown-menu-title` component for [`dropdown-menu`](/src/components/interaction/dropdown-menu/dropdown-menu.md).

### Updates

- `ui-button`: The new property `iconOnly` creates a button with only an icon.
- `app-pagination`: Now shows the current items being displayed (e.g. 1-10 of 20).

### New icons

- `icon-eye`

# 0.18.0 - 2024-12-19

### New components

- [`accordion-group`](/src/components/content/accordion-group/accordion-group.md)

# 0.17.0 - 2024-12-13

### New components

- [`breadcrumb-list`](/src/components/navigation/breadcrumb-list/breadcrumb-list.md)
- [`app-pagination`](/src/components/navigation/app-pagination/app-pagination.md)
- [`modal-dialog`](/src/components/messaging/modal-dialog/modal-dialog.md)

# 0.16.1 - 2024-11-15

### Updates

- `form-label`: No longer automatically adds "(optional)" text, as it applied in too many circumstances by default.

# 0.16.0 - 2024-11-15

### New components

- [`dropdown-menu`](/src/components/interaction/dropdown-menu/dropdown-menu.md):

### Updates

- `summary-details`: Now provides `open` and `closed` events when its status updates.
- `summary-details`: Now provides `openDetails` and `closeDetails` methods to programmatically control the details display.

# 0.15.0 - 2024-11-13

### New components

- [`form-wrapper`](/src/components/form/form-wrapper/form-wrapper.md): Create an accessible form with validation.
- [`form-field`](/src/components/form/form-field/form-field.md): Display a form field for a form, with built-in communication with `form-wrapper`.

# 0.14.0 - 2024-11-02

### New components

- [`tab-group`](/src/components/interaction/tab-group/tab-group.md): Displays accessible tabbed content.

## 0.13.0 - 2024-10-28

### New components

- [`searchable-list`](/src/components/data/searchable-list/searchable-list.md): Allows the properties of a list of objects to be searched, with a display template for the results.
- [`form-checkbox`](/src/components/form/form-checkbox/form-checkbox.md): A checkbox with extra options.

## 0.12.1 - 2024-10-23

### Fixes

- `skeleton-loader`: Better support non-grey background colours in dark mode.
- `progress-bar`: Better support non-grey background colours in dark mode.
- `pill-badge`: Better support non-grey background colours in dark mode.

## 0.12.0 - 2024-10-21

### New components

- [`skeleton-loader`](/src/components/interaction/skeleton-loader/skeleton-loader.md): Build a skeleton loading indicator.

## 0.11.0 - 2024-10-19

### New components

- [`alert-message`](/src/components/messaging/alert-message/alert-message.md): Display an alert message to the user.

## 0.10.0 - 2024-10-18

### New components

- [`progress-bar`](/src/components/chart/progress-bar/progress-bar.md) Display an accessible progress bar based on a given `min`, `max`, and `value`, with options to show a label or the current value.

## 0.9.2 - 2024-10-06

- `link-tag`: Fix an issue where icon spacing would become disproportionate based on font size
- `form-error`: Fix styling issues present in dark mode

## 0.9.1 - 2024-09-11

### Fixes

- `radio-group`: `inline` now only takes effect within containers that are at least 320px wide.

## 0.9.0 - 2024-09-07

### Dark mode

The following components now support dark mode.

- `pill-badge`
- `loading-indicator`
- `donut-chart`

### New features

- `form-input`: A new `triggerFocus` method is exposed to allow focusing the underlying input.
- `donut-chart`: A new `colourful` mode uses the brighter set of chart colours. Use with caution.
- `loading-indicator`: A new `large` prop allows for showing a larger indicator.

### Changes

- `form-input`: Styling is now controlled by `form-input` and `form-input--error` classes.
- `radio-group`: Styling of radio buttons is now controlled by a `form-radio` class.

### Fixes

- `ui-button`: Icons are now correctly made invisible when a button is "reacting".
- `icon-clock`: Removed inadvertent built-in colour.

## 0.8.0 - 2024-08-30

### New components

- [`loading-indicator`](/src/components/interaction/loading-indicator/loading-indicator.md) - A simple indicator to represent loading data.

## 0.7.0 - 2024-08-28

### New features

- `summary-details`: A new `detailsClasses` prop has been added to allow greater control of the appearance of the details content.

## 0.6.0 - 2024-08-27

### New features

- `summary-details`: Pressing escape while details are open now closes those details and, if focus is within the component, moves focus to the summary. This can be controlled by the new prop `closeWithEscape` (default: true).
- `summary-details`: Clicking outside of the component can now close the details. This can be controlled by the new prop `closeWithClickOutside` (default: false).

### Changes

- `ui-button`: No longer automatically justifies content, which makes it easier to use buttons in a wider variety of scenarios. Buttons that are designed to be full width can still be centred by adding the `justify-center` class.

### Fixes

- `ui-button`: A new `iconClasses` prop has been added to supply classes directly to the icon(s). If a `size-` class is provided, the conflicting default size class is not added.
- `summary-details`: When applying `absolute` as a class to a floating `summary-details`, it no longer adds a conflicting `relative` class.

## 0.5.0 - 2024-08-24

### New components

- [`summary-details`](/src/components/interaction/summary-details/summary-details.md) - A simple way to have toggled content.

## 0.4.0 - 2024-08-18

### New icons

- `icon-check`
- `icon-clock`
- `icon-cross`
- `icon-danger`
- `icon-lightbulb`

## 0.3.0 - 2024-08-18

### New icons

- `icon-check-circled`
- `icon-download`
- `icon-external`
- `icon-film`
- `icon-laptop`
- `icon-moon`
- `icon-reload`
- `icon-sun`

## 0.2.1 - 2024-08-18

Fix an issue with mismatching export names.

## 0.2.0 - 2024-08-18

### New components

- [`link-tag`](/src/components/interaction/link-tag/link-tag.md) - A link tag for internal or external links.
- [`form-input`](/src/components/form/form-input/form-input.md) - A text input with extra options.
- [`radio-group`](/src/components/form/radio-group/radio-group.md) - A group of radio buttons generated from a list of options.
- [`button-group`](/src/components/form/button-group/button-group.md) - A group of buttons generated from a list of options. An extension of `radio-group` with different styling.
- [`conditional-wrapper`](/src/components/general/conditional-wrapper/conditional-wrapper.md) - A convenience component to conditionally wrap (or not) content with an element.
- [`form-layout`](/src/components/form/form-layout/form-layout.md) - A convenience component to help with basic arrangement of form fields.
- [`form-actions`](/src/components/form/form-actions/form-actions.md) - A convenience component to help with basic arrangement of form actions.
- [`donut-chart`](/src/components/chart/donut-chart/donut-chart.md) - Generate a donut chart from a list of values.
- [`pill-badge`](/src/components/messaging/pill-badge/pill-badge.md) - Show information in a small pill, great for statuses.

### New icons

- `icon-arrow-down`
- `icon-arrow-left`
- `icon-arrow-right`
- `icon-arrow-up`
- `icon-danger`
- `icon-email`
- `icon-external`
- `icon-plus`
- `icon-user`

## 0.1.0 - 2024-08-13

### New components

- [`ui-button`](/src/components/interaction/ui-button/ui-button.md)` - create buttons with optional icons, and optional `reactive` mode.

### New icons

- `icon-loading`
- `icon-chevron-up`
- `icon-chevron-right`
- `icon-chevron-down`
- `icon-chevron-left`
