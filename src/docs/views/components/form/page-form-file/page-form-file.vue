<template>
	<component-page>
		<template #title>Form file</template>

		<template #introduction>
			<p>
				<code>form-file</code>
				is a file upload field. By default, it accepts one file; set
				<code>multiple</code>
				to
				<em>true</em>
				to accept more than one file.
			</p>
			<p>
				There's no
				<code>accept</code>
				prop. Restricting file types via
				<code>accept</code>
				can hide non-matching files in some OS file pickers, confusing users who can't find the file
				they want to upload. Instead, validate type, size, and other constraints as
				<code>rules</code>
				on the parent
				<code>form-wrapper</code>
				.
			</p>
		</template>

		<component-props>
			<component-prop id="prop-id">
				<template #name>id</template>

				<template #type>String</template>

				<template #default-value>null</template>

				<p>The input ID. A unique ID is generated when omitted.</p>
			</component-prop>

			<component-prop id="prop-multiple">
				<template #name>multiple</template>

				<template #type>Boolean</template>

				<template #default-value>false</template>

				<p>
					Whether to allow selecting more than one file. When
					<code>false</code>
					,
					<code>v-model</code>
					contains a
					<code>File</code>
					or
					<code>null</code>
					. When
					<code>true</code>
					, it contains an array of
					<code>File</code>
					objects or
					<code>null</code>
					. The remove button clears the complete current selection.
				</p>
			</component-prop>

			<component-prop id="prop-input-attributes">
				<template #name>inputAttributes</template>

				<template #type>Object</template>

				<template #default-value>null</template>

				<p>
					Any additional attributes to pass to the input itself. The component manages
					<code>id</code>
					,
					<code>type</code>
					,
					<code>multiple</code>
					,
					<code>required</code>
					, and generated ARIA attributes. Custom
					<code>aria-describedby</code>
					values are added to the component's own description IDs.
				</p>
			</component-prop>

			<component-prop id="prop-required">
				<template #name>required</template>

				<template #type>Boolean</template>

				<template #default-value>false</template>

				<p>Whether this field is required.</p>
			</component-prop>

			<component-prop id="prop-show-optional-indicator">
				<template #name>showOptionalIndicator</template>

				<template #type>Boolean</template>

				<template #default-value>true</template>

				<p>Whether to show optional text when the field is not required.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>default</template>

				<p>The default slot contains the label of the field.</p>
				<p>
					<em>
						A label is required for screen reader users. The component shows an error when no label
						is provided.
					</em>
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

				<p>
					Any additional text to introduce this input, which appears between the label and the
					input.
				</p>
			</component-slot>
			<component-slot id="slot-error">
				<template #name>error</template>

				<p>Any error text to display below the field.</p>
			</component-slot>
			<component-slot id="slot-help">
				<template #name>help</template>

				<p>Any help text to display below the field.</p>
			</component-slot>
			<component-slot id="slot-remove-button-label">
				<template #name>remove-button-label</template>

				<p>
					Content for the button that clears the current selection. Receives
					<code>files</code>
					, an array containing the current
					<code>File</code>
					objects. The default is
					<code>Remove filename</code>
					for a single file, or
					<code>Remove N files</code>
					for multiple selections with more than one file.
				</p>
			</component-slot>
		</component-slots>

		<component-events>
			<component-event id="event-v-model">
				<template #name>v-model</template>

				<p>
					The current selection, or
					<code>null</code>
					when no file is selected, is available via
					<code>v-model</code>
					.
				</p>
				<p>
					When
					<code>multiple</code>
					is
					<code>true</code>
					, the model contains an array of selected files instead. Browsers do not allow a native
					file input to be populated programmatically, so initial model files do not populate the
					browser's input. The user must select them again before the native input contains them.
					Previewing existing files is not part of this API.
				</p>
			</component-event>
		</component-events>

		<component-methods>
			<component-method id="method-trigger-focus">
				<template #name>
					<code>triggerFocus</code>
				</template>

				<p>Focus this input.</p>
			</component-method>
		</component-methods>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="form-file"</template>
				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-invalid">
				<template #attribute>data-invalid</template>
				<p>Present on the root element when the field has an error.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-controls">
				<template #attribute>data-part="controls"</template>
				<p>Present on the container that wraps the input and remove button.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-remove">
				<template #attribute>data-part="remove"</template>
				<p>Present on the remove button once a file is selected.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-form-file />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFormFile from "./fragments/playground-form-file.vue";
</script>
