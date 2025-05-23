<template>
	<component-page>
		<template #title>
			Form wrapper
		</template>

		<template #introduction>
			<p><code>form-wrapper</code> is intended as a complete form, wrapped around individual fields. The wrapper automatically adds actions and, when fields are provided validation information, handles field validation and the generation of an error summary to maximise the accessibility of the form.</p>
			<p>
				We recommend a
				<link-tag href="https://adamsilver.io/blog/how-to-highlight-required-and-optional-form-fields/" v-bind="{ external: true }">
					required by default, marked if optional technique
				</link-tag>
				for form fields, meaning that optional fields should be marked as such.
			</p>
		</template>

		<component-slots>
			<component-slot id="slot-pre-form">
				<template #name>
					pre-form
				</template>

				<p>Any elements to place before the form elements, and outside of the <code>form-layout</code> wrapper. For example, navigational items such as &quot;Back to …&quot; or &quot;Forgot password&quot;.</p>
			</component-slot>
			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The <code>default</code> slot contains the content of the form itself, including any fields, layout elements, or information as necessary.</p>
			</component-slot>
			<component-slot id="slot-submit-button-label">
				<template #name>
					submit-button-label
				</template>

				<p>The label to use on the submit button. This should be representative of what is about to happen—such as &quot;Create account&quot; or &quot;Update settings&quot;, not something generic, and as such <strong>no default label is provided</strong>.</p>
			</component-slot>
			<component-slot id="slot-secondary-actions">
				<template #name>
					secondary-actions
				</template>

				<p>Additional actions to appear beside the submit button—such as &quot;Save and exit&quot; to come back to the form later. Any actions that relate to a particular field—such as &quot;Add another&quot;—should appear with that field or group of fields, not in the actions of the form.</p>
			</component-slot>
			<component-slot id="slot-tertiary-actions">
				<template #name>
					tertiary-actions
				</template>

				<p>Additional actions to appear below the primary and secondary actions, such as &quot;Cancel&quot;. Navigational actions, such as &quot;Back to …&quot; or &quot;Forgot password&quot; should appear above the form fields, such as in the <code>pre-form</code> slot.</p>
			</component-slot>
			<component-slot id="slot-error-summary-title">
				<template #name>
					error-summary-title
				</template>

				<template #default-value>
					There is a problem
				</template>

				<p>The title of the error summary that appears if any errors are found in the form.</p>
			</component-slot>
		</component-slots>

		<component-events>
			<component-event id="event-v-model">
				<template #name>
					v-model
				</template>

				<p>The current value of the included form fields, in a flat objected, keyed by the <code>name</code> value for each field.</p>
			</component-event>
		</component-events>

		<component-provides>
			<template #introduction>
				<p>Two methods are provided by <code>form-wrapper</code> under the &quot;form-wrapper&quot; namespace to allow a field to communicate and update its value.</p>
			</template>

			<component-provide id="provide-register-field">
				<template #name>
					<code>registerField(field)</code>
				</template>

				<p>Allow a field to register itself with the form.</p>

				<table>
					<thead>
						<tr>
							<th>Parameter</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>field.name</code></td>
							<td><code>string</code></td>
							<td>Name of the field to register.</td>
						</tr>
						<tr>
							<td><code>field.id</code></td>
							<td><code>string</code></td>
							<td>The ID of the field, helpful for linking errors to fields.</td>
						</tr>
						<tr>
							<td><code>field.validateField</code></td>
							<td><code>function</code></td>
							<td>Validation function, run when the form is submitted.</td>
						</tr>
						<tr>
							<td><code>field.focusField</code></td>
							<td><code>function</code></td>
							<td>Method to focus on this field, used by the error summary.</td>
						</tr>
					</tbody>
				</table>
			</component-provide>

			<component-provide id="provide-update-field-value">
				<template #name>
					<code>updateFieldValue(name, value)</code>
				</template>

				<p>Allow a field to update its value in the form.</p>

				<table>
					<thead>
						<tr>
							<th>Parameter</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>name</code></td>
							<td><code>string</code></td>
							<td>The name of the field to update.</td>
						</tr>
						<tr>
							<td><code>value</code></td>
							<td><code>unknown</code></td>
							<td>The value to set.</td>
						</tr>
					</tbody>
				</table>
			</component-provide>
		</component-provides>

		<component-playgrounds>
			<playground-form-wrapper />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFormWrapper from "./fragments/playground-form-wrapper.vue";
</script>
