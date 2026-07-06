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
					<li><code>checkbox</code></li>
					<li><code>checkbox-group</code></li>
					<li><code>radio-group</code></li>
					<li><code>form-button-group</code></li>
					<li><code>date</code></li>
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

			<component-prop id="prop-additional">
				<template #name>Additional props</template>

				<p>
					Additional props are passed through to the underlying form field. Additional props may be
					required depending on that field, such as
					<code>options</code>
					for
					<code>radio-group</code>
					.
				</p>
			</component-prop>
		</component-props>

		<component-slots>
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

			<component-slot id="slot-options">
				<template #name>options</template>

				<p>
					Options passed through to option-bearing controls:
					<code>select</code>
					,
					<code>radio-group</code>
					,
					<code>checkbox-group</code>
					, and
					<code>form-button-group</code>
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

			<component-slot id="slot-help">
				<template #name>help</template>

				<p>Help text shown below the input, providing additional context or guidance.</p>
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
			<playground-form-field-date />
			<playground-form-field-select />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFormFieldFormButtonGroup from "./fragments/playground-form-field-form-button-group.vue";
import PlaygroundFormFieldCheckbox from "./fragments/playground-form-field-checkbox.vue";
import PlaygroundFormFieldCheckboxGroup from "./fragments/playground-form-field-checkbox-group.vue";
import PlaygroundFormFieldDate from "./fragments/playground-form-field-date.vue";
import PlaygroundFormFieldEmail from "./fragments/playground-form-field-email.vue";
import PlaygroundFormFieldPassword from "./fragments/playground-form-field-password.vue";
import PlaygroundFormFieldRadioGroup from "./fragments/playground-form-field-radio-group.vue";
import PlaygroundFormFieldSelect from "./fragments/playground-form-field-select.vue";
import PlaygroundFormFieldText from "./fragments/playground-form-field-text.vue";
import PlaygroundFormFieldTextarea from "./fragments/playground-form-field-textarea.vue";
</script>
