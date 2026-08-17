# `form-combo-box`

`form-combo-box` pairs a search input with a list of results, handling the keyboard, ARIA, and open/close behaviour of the combobox interaction pattern on top of the [`useCombobox`](/composables/use-combobox) composable.

Only when a result is selected does `form-combo-box` take its value, meaning an arbitrary value does not count as a value for the field.
