<template>
	<component-page>
		<template #title>Form field</template>

		<template #introduction>
			<p>
				A general form component that can take the place of a text input, select, textarea, and
				more, providing compatibility with
				<code>form-wrapper</code>
				, allowing a form to be built up quickly and simply.
			</p>

			<p>
				When the parent
				<code>form-wrapper</code>
				has
				<code>readonly</code>
				set to
				<code>true</code>
				, the field automatically passes
				<code>readonly</code>
				through to its underlying control. This lets you build review-mode or read-only forms
				without managing each field individually.
			</p>
		</template>

		<component-props>
			<component-prop id="prop-type">
				<template #name>type</template>

				<template #type>String</template>

				<template #default-value>text</template>

				<p>The type of field. Known types include:</p>

				<ul>
					<li><code>text</code></li>
					<li><code>email</code></li>
					<li><code>password</code></li>
					<li><code>textarea</code></li>
					<li><code>select</code></li>
					<li><code>combo-box</code></li>
					<li><code>checkbox</code></li>
					<li><code>checkbox-group</code></li>
					<li><code>radio-group</code></li>
					<li><code>button-group</code></li>
					<li><code>date</code></li>
					<li><code>file</code></li>
				</ul>

				<p>
					Any unknown type will default to
					<code>text</code>
					.
				</p>
			</component-prop>

			<component-prop id="prop-id">
				<template #name>id</template>

				<template #type>String</template>

				<template #default-value>null</template>

				<p>
					Any ID to apply to this field. If an ID is not provided, one will be generated at random.
					Note that when providing an ID, please make sure that it is unique to avoid any unforeseen
					issues.
				</p>
			</component-prop>

			<component-prop id="prop-name">
				<template #name>name</template>

				<template #type>String</template>

				<template #default-value>null</template>

				<p>
					The name of the field. This is required when used within a
					<code>form-wrapper</code>
					component, where it is used as the key for the form's data collection. As such, its
					uniqueness will be verified by
					<code>form-wrapper</code>
					when used together.
				</p>

				<p>
					Within
					<code>form-wrapper</code>
					, a field is registered while it is mounted. If you rename a mounted field by changing
					<code>name</code>
					, its registration moves to the new name. Unmounting the field unregisters it without
					removing its value or parent-owned errors.
				</p>
			</component-prop>

			<component-prop id="prop-required">
				<template #name>required</template>

				<template #type>Boolean</template>

				<template #default-value>false</template>

				<p>
					Whether this field is required. When
					<code>true</code>
					, the
					<code>required</code>
					attribute is added to the underlying input. This is also set automatically when a
					<code>required</code>
					rule for this field is present in the parent form-wrapper's
					<code>rules</code>
					.
				</p>

				<p>
					Validation rules are not set on
					<code>form-field</code>
					directly. Define them on the parent form-wrapper's
					<code>rules</code>
					prop instead; see the form-wrapper docs for the available rules.
				</p>
			</component-prop>

			<component-prop id="prop-display-label">
				<template #name>displayLabel</template>

				<template #type>Boolean</template>

				<template #default-value>true</template>

				<p>
					Whether to display the label for
					<code>text</code>
					and
					<code>select</code>
					fields. When false, the label remains available to screen readers but is visually hidden.
				</p>
			</component-prop>

			<component-prop id="prop-multiple">
				<template #name>multiple</template>

				<template #type>Boolean</template>

				<template #default-value>false</template>

				<p>
					Whether a
					<code>file</code>
					field allows selecting more than one file. When enabled, the field's
					<code>v-model</code>
					contains an array of
					<code>File</code>
					objects or
					<code>null</code>
					instead of a single
					<code>File</code>
					or
					<code>null</code>
					.
				</p>
			</component-prop>

			<component-prop id="prop-additional">
				<template #name>Additional props</template>

				<p>
					Some field types expose additional props. For example,
					<code>multiple</code>
					applies to
					<code>file</code>
					fields, while option-bearing fields use their documented options configuration.
				</p>
			</component-prop>
		</component-props>

		<component-slots>
			<p>
				Every slot passed to
				<code>form-field</code>
				is forwarded to the selected field, including its scoped props. Shared slots and commonly
				used type-specific slots are listed here; see the selected field's docs for its specific
				slots.
			</p>

			<component-slot id="slot-default">
				<template #name>default</template>

				<p>
					Passed through to the
					<code>default</code>
					slot of the relevant form field, the
					<code>default</code>
					slot generally contains the label for the form element.
				</p>
			</component-slot>

			<component-slot id="slot-optional-indicator">
				<template #name>optional-indicator</template>

				<p>
					Content shown after the label text when the field is not required. Defaults to
					<code>(optional)</code>
					.
				</p>
			</component-slot>

			<component-slot id="slot-introduction">
				<template #name>introduction</template>

				<p>Introductory text shown above the input, beneath the label.</p>
			</component-slot>

			<component-slot id="slot-prefix">
				<template #name>prefix</template>

				<p>Content placed visually before the input, such as a currency symbol or URL scheme.</p>
			</component-slot>

			<component-slot id="slot-suffix">
				<template #name>suffix</template>

				<p>Content placed visually after the input, such as a unit or domain suffix.</p>
			</component-slot>

			<component-slot id="slot-option">
				<template #name>option</template>

				<p>
					Option-bearing controls receive their
					<code>options</code>
					through component props, not a slot. Use the
					<code>option</code>
					slot for custom option content in controls that provide it, including
					<code>radio-group</code>
					,
					<code>checkbox-group</code>
					,
					<code>button-group</code>
					, and
					<code>combo-box</code>
					. Scoped props vary by field. The
					<code>combo-box</code>
					slot receives
					<code>option</code>
					,
					<code>label</code>
					,
					<code>value</code>
					,
					<code>highlighted</code>
					, and
					<code>selected</code>
					.
				</p>
			</component-slot>

			<component-slot id="slot-error">
				<template #name>error</template>

				<p>
					Custom error content. When provided, this replaces the default validation message list
					rendered by
					<code>form-field</code>
					.
				</p>
			</component-slot>

			<component-slot id="slot-answer-summary">
				<template #name>answer-summary</template>

				<p>
					Custom answer content for this field in a
					<code>form-flow</code>
					review. The slot receives
					<code>answer</code>
					,
					<code>fieldName</code>
					, and
					<code>label</code>
					.
				</p>
			</component-slot>

			<component-slot id="slot-help">
				<template #name>help</template>

				<p>Help text shown below the input, providing additional context or guidance.</p>
			</component-slot>
			<component-slot id="slot-remove-button-label">
				<template #name>remove-button-label</template>

				<p>
					Content for a file field's remove button. Receives
					<code>files</code>
					, an array containing the current
					<code>File</code>
					objects.
				</p>
			</component-slot>
		</component-slots>

		<component-events>
			<component-event id="event-v-model">
				<template #name>v-model</template>

				<p>
					The current value of the underlying form field will be available via
					<code>v-model</code>
					.
				</p>
			</component-event>
		</component-events>

		<component-playgrounds>
			<playground-form-field-text />
			<playground-form-field-email />
			<playground-form-field-password />
			<playground-form-field-textarea />
			<playground-form-field-checkbox />
			<playground-form-field-checkbox-group />
			<playground-form-field-radio-group />
			<playground-form-field-form-button-group />
			<playground-form-field-combo-box />
			<playground-form-field-date />
			<playground-form-field-file />
			<playground-form-field-select />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFormFieldFormButtonGroup from "./fragments/playground-form-field-form-button-group.vue";
import PlaygroundFormFieldCheckbox from "./fragments/playground-form-field-checkbox.vue";
import PlaygroundFormFieldCheckboxGroup from "./fragments/playground-form-field-checkbox-group.vue";
import PlaygroundFormFieldComboBox from "./fragments/playground-form-field-combo-box.vue";
import PlaygroundFormFieldDate from "./fragments/playground-form-field-date.vue";
import PlaygroundFormFieldEmail from "./fragments/playground-form-field-email.vue";
import PlaygroundFormFieldFile from "./fragments/playground-form-field-file.vue";
import PlaygroundFormFieldPassword from "./fragments/playground-form-field-password.vue";
import PlaygroundFormFieldRadioGroup from "./fragments/playground-form-field-radio-group.vue";
import PlaygroundFormFieldSelect from "./fragments/playground-form-field-select.vue";
import PlaygroundFormFieldText from "./fragments/playground-form-field-text.vue";
import PlaygroundFormFieldTextarea from "./fragments/playground-form-field-textarea.vue";
</script>
