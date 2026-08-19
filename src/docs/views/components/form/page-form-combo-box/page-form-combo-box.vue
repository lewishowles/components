<template>
	<component-page>
		<template #title>Form combo box</template>

		<template #introduction>
			<p>
				<code>form-combo-box</code>
				filters known options by their labels and stores the selected option's value. The visible
				input can show a record's name while the form model stores the record's ID.
			</p>
			<p>
				Typed text is only a temporary query. A value is stored after an option is selected, and
				rich option content must not contain nested interactive controls.
			</p>
		</template>

		<component-props>
			<component-prop id="prop-options">
				<template #name>options</template>
				<template #type>Array | Object</template>
				<template #default-value>[]</template>

				<p>Options can be strings, numbers, label/value objects, or objects using custom keys.</p>
				<p>
					Filtering is case-insensitive and keeps the order supplied by the caller. Option values
					must be unique, but labels may repeat.
				</p>
			</component-prop>

			<component-prop id="prop-label-key">
				<template #name>labelKey</template>
				<template #type>String</template>
				<template #default-value>label</template>

				The object key used for an option's plain-text label. It is ignored for string and number
				options.
			</component-prop>

			<component-prop id="prop-value-key">
				<template #name>valueKey</template>
				<template #type>String</template>
				<template #default-value>value</template>

				The object key used for an option's model value. It is ignored for string and number
				options.
			</component-prop>

			<component-prop id="prop-loading">
				<template #name>loading</template>
				<template #type>Boolean</template>
				<template #default-value>false</template>

				<p>
					Shows loading content instead of the results. Loading takes precedence over the empty and
					no-results states, and preserves the current selection.
				</p>
			</component-prop>

			<component-prop id="prop-id">
				<template #name>id</template>
				<template #type>String</template>
				<template #default-value>null</template>

				<p>
					ID applied to the text input. An ID is generated when omitted. Supplied IDs must be
					unique.
				</p>
			</component-prop>

			<component-prop id="prop-placeholder">
				<template #name>placeholder</template>
				<template #type>String</template>
				<template #default-value>null</template>

				Placeholder text for the input.
			</component-prop>

			<component-prop id="prop-input-attributes">
				<template #name>inputAttributes</template>
				<template #type>Object</template>
				<template #default-value>null</template>

				Additional attributes forwarded to the text input, such as `autocomplete`.
			</component-prop>

			<component-prop id="prop-required">
				<template #name>required</template>
				<template #type>Boolean</template>
				<template #default-value>false</template>

				<p>
					Marks the field as required. Validation follows the selected model value, so typed but
					unselected text does not satisfy a required form field.
				</p>
			</component-prop>

			<component-prop id="prop-display-label">
				<template #name>displayLabel</template>
				<template #type>Boolean</template>
				<template #default-value>true</template>

				Whether to display the field label. When false, the label remains available to screen
				readers.
			</component-prop>

			<component-prop id="prop-placement">
				<template #name>placement</template>
				<template #type>String</template>
				<template #default-value>below</template>

				Preferred placement of the results list. The list flips when it would clip the viewport
				edge.
			</component-prop>

			<component-prop id="prop-align">
				<template #name>align</template>
				<template #type>String</template>
				<template #default-value>start</template>

				Whether to align the results list to the start or end of the input. The alignment also flips
				when the list would clip the viewport edge.
			</component-prop>

			<component-prop id="prop-dropdown-classes">
				<template #name>dropdownClasses</template>
				<template #type>String | Array | Object</template>
				<template #default-value>null</template>

				Additional classes for the results list.
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>default</template>

				<p>The default slot contains the field label.</p>
				<p>
					<em>
						A label is always required, even when it is visually hidden, so the input has an
						accessible name.
					</em>
				</p>
			</component-slot>

			<component-slot id="slot-optional-indicator">
				<template #name>optional-indicator</template>

				Content shown after the label when the field is not required. Defaults to `(optional)`.
			</component-slot>

			<component-slot id="slot-introduction">
				<template #name>introduction</template>

				Supporting text shown between the label and the input.
			</component-slot>

			<component-slot id="slot-help">
				<template #name>help</template>

				Help text shown below the input.
			</component-slot>

			<component-slot id="slot-error">
				<template #name>error</template>

				Custom validation error content shown below the input.
			</component-slot>

			<component-slot id="slot-option">
				<template #name>option</template>

				<p>
					Custom content for each option. It receives the original `option`, normalised `label` and
					`value`, and `highlighted` and `selected` booleans.
				</p>
				<p>
					Keep this content non-interactive. Nested buttons and links conflict with option
					selection.
				</p>
			</component-slot>

			<component-slot id="slot-loading">
				<template #name>loading</template>

				Content shown while options are loading.
			</component-slot>

			<component-slot id="slot-empty">
				<template #name>empty</template>

				Content shown when no options were supplied.
			</component-slot>

			<component-slot id="slot-no-results">
				<template #name>no-results</template>

				<p>Content shown when options exist but none match the query.</p>
				<p>The slot receives the current `query`.</p>
			</component-slot>
		</component-slots>

		<component-events>
			<component-event id="event-v-model">
				<template #name>v-model</template>

				<p>
					The selected option's value is available through `v-model`. Query text is never stored as
					the model value.
				</p>
			</component-event>
		</component-events>

		<component-methods>
			<component-method id="method-trigger-focus">
				<template #name>
					<code>triggerFocus</code>
				</template>

				Move focus to the text input.
			</component-method>
		</component-methods>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="form-combo-box"</template>
				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-invalid">
				<template #attribute>data-invalid</template>
				<p>Present on the root element when the field has an error.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-state">
				<template #attribute>data-state="open|closed"</template>
				<p>Present on the root element with the current results-panel state.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-text-control">
				<template #attribute>data-part="text-control"</template>
				<p>Wraps the text input and its form fragments.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-dropdown">
				<template #attribute>data-part="dropdown"</template>
				<p>Targets the positioned results panel.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-listbox">
				<template #attribute>data-part="listbox"</template>
				<p>Targets the filtered option list.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-option">
				<template #attribute>data-part="option"</template>
				<p>Targets each option row.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-status">
				<template #attribute>data-part="status"</template>
				<p>Targets loading, empty, and no-results content.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-form-combo-box />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFormComboBox from "./fragments/playground-form-combo-box.vue";
</script>
