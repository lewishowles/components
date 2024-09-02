# Changelog

## 0.9.0 - #

### Dark mode

The following components now support dark mode.

- `pill-badge`

### New features

- `form-input`: A new `triggerFocus` method is exposed to allow focusing the underlying input.

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
