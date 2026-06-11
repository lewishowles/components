<template>
	<component-page>
		<template #title>Form wrapper</template>

		<template #introduction>
			<p>
				<code>form-wrapper</code>
				is intended as a complete form, wrapped around individual fields. The wrapper automatically
				adds actions and, when fields are provided validation information, handles field validation
				and the generation of an error summary to maximise the accessibility of the form.
			</p>

			<p>
				We recommend a
				<link-tag
					href="https://adamsilver.io/blog/how-to-highlight-required-and-optional-form-fields/"
					v-bind="{ external: true }"
				>
					required by default, marked if optional technique
				</link-tag>
				for form fields, meaning that optional fields should be marked as such.
			</p>

			<p>
				<code>form-wrapper</code>
				automatically includes
				<code>form-layout</code>
				around its
				<code>default</code>
				content.
			</p>
		</template>

		<component-props>
			<component-prop id="prop-field-errors">
				<template #name>fieldErrors</template>

				<template #type>Object</template>

				<template #default-value>{}</template>

				<p>
					Field-level errors managed by the parent, usually from an API response. Keys should match
					registered
					<code>form-field</code>
					names. Values can be either a single message or a list of messages.
				</p>

				<p>
					These errors are shown in the error summary and passed to the relevant field so they use
					the same error display as validation messages. They are controlled by the parent and are
					not cleared automatically when field values change.
				</p>

				<code-block>
					const fieldErrors = { date: "The date must be in the future", email: ["The email address
					provided already exists"], };
				</code-block>
			</component-prop>

			<component-prop id="prop-submit-errors-callback">
				<template #name>submitErrorsCallback</template>

				<template #type>Function</template>

				<template #default-value>null</template>

				<p>
					An optional callback that maps a rejected submit Promise into an errors object. The
					callback only runs when the submit handler returns a rejecting Promise. If the handler
					catches the error itself, the callback will not run.
				</p>

				<p>
					Keys matching registered
					<code>form-field</code>
					names are shown in the error summary and passed to the field, exactly like
					<code>fieldErrors</code>
					. Keys that don't match a registered field are treated as general submit errors and
					rendered near the submit button using the
					<code>submit-errors</code>
					slot. Return an empty value for errors the form should not handle.
				</p>
			</component-prop>

			<component-prop id="prop-layout-classes">
				<template #name>layoutClasses</template>

				<template #type>String</template>

				<template #default-value>""</template>

				<p>
					Additional classes passed to the inner
					<code>form-layout</code>
					.
				</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-pre-form">
				<template #name>pre-form</template>

				<p>
					Any elements to place before the form elements, and outside of the
					<code>form-layout</code>
					wrapper. For example, navigational items such as &quot;Back to …&quot; or &quot;Forgot
					password&quot;.
				</p>
			</component-slot>
			<component-slot id="slot-default">
				<template #name>default</template>

				<p>
					The
					<code>default</code>
					slot contains the content of the form itself, including any fields, layout elements, or
					information as necessary.
				</p>

				<table>
					<thead>
						<tr>
							<th>Slot prop</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>isSubmitting</code></td>
							<td><code>boolean</code></td>
							<td>Whether a form submission is currently in progress.</td>
						</tr>
						<tr>
							<td><code>hasErrors</code></td>
							<td><code>boolean</code></td>
							<td>Whether the form currently has validation errors.</td>
						</tr>
					</tbody>
				</table>
			</component-slot>
			<component-slot id="slot-submit-button-label">
				<template #name>submit-button-label</template>

				<p>
					The label to use on the submit button. This should be representative of what is about to
					happen—such as &quot;Create account&quot; or &quot;Update settings&quot;, not something
					generic, and as such
					<strong>no default label is provided</strong>
					.
				</p>
			</component-slot>
			<component-slot id="slot-secondary-actions">
				<template #name>secondary-actions</template>

				<p>
					Additional actions to appear beside the submit button—such as &quot;Save and exit&quot; to
					come back to the form later. Any actions that relate to a particular field—such as
					&quot;Add another&quot;—should appear with that field or group of fields, not in the
					actions of the form.
				</p>
			</component-slot>
			<component-slot id="slot-tertiary-actions">
				<template #name>tertiary-actions</template>

				<p>
					Additional actions to appear below the primary and secondary actions, such as
					&quot;Cancel&quot;. Navigational actions, such as &quot;Back to …&quot; or &quot;Forgot
					password&quot; should appear above the form fields, such as in the
					<code>pre-form</code>
					slot.
				</p>
			</component-slot>
			<component-slot id="slot-submit-errors">
				<template #name>submit-errors</template>

				<p>
					Overrides the default general error display near the form's actions. If not provided, a
					single error is rendered as a
					<code>&lt;p&gt;</code>
					and multiple errors as a
					<code>&lt;ul&gt;</code>
					.
				</p>

				<table>
					<thead>
						<tr>
							<th>Slot prop</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>errors</code></td>
							<td><code>string[]</code></td>
							<td>
								General errors produced by
								<code>submitErrorsCallback</code>
								whose keys don't match a registered field.
							</td>
						</tr>
					</tbody>
				</table>
			</component-slot>

			<component-slot id="slot-messages">
				<template #name>messages</template>

				<p>
					A placement slot for general form feedback, such as success messages, flash messages, or
					anything that belongs near the submit button but isn't tied to a specific error state.
				</p>
			</component-slot>

			<component-slot id="slot-error-summary-title">
				<template #name>error-summary-title</template>

				<template #default-value>There is a problem</template>

				<p>The title of the error summary that appears if any errors are found in the form.</p>
			</component-slot>

			<component-slot id="slot-actions-label">
				<template #name>actions-label</template>

				<p>
					An optional visually hidden label for the action group, used by screen readers to identify
					the group's purpose.
				</p>

				<p>
					Provide a label when the form has multiple action groups that need to be distinguished
					(e.g. primary actions and a "danger zone"), or when actions appear far from the form
					fields.
				</p>
			</component-slot>
		</component-slots>

		<component-events>
			<component-event id="event-submit">
				<template #name>submit</template>

				<p>
					Fired when the user submits the form and validation succeeds, containing the current
					values of each of the
					<code>form-field</code>
					elements contained within the form.
				</p>
			</component-event>

			<component-event id="event-v-model">
				<template #name>v-model</template>

				<p>
					The current value of the included form fields, in a flat objected, keyed by the
					<code>name</code>
					value for each field.
				</p>
			</component-event>
		</component-events>

		<component-provides>
			<template #introduction>
				<p>
					Two methods are provided by
					<code>form-wrapper</code>
					under the
					<code>form-wrapper</code>
					namespace to allow a field to communicate and update its value.
				</p>
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
							<td><code>field.triggerFocus</code></td>
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

		<component-methods>
			<component-method id="method-reset-submit-button">
				<template #name>
					<code>resetSubmitButton</code>
				</template>

				<p>
					Resets the submit button's loading state. Call this after your
					<code>@submit</code>
					handler completes if it does not return a Promise — for example, when the async work is
					deferred or the result comes back via a separate channel.
				</p>
			</component-method>

			<component-method id="expose-is-submitting">
				<template #name>
					<code>isSubmitting</code>
				</template>

				<p>
					A reactive boolean reflecting whether a form submission is currently in progress.
					Accessible via a
					<code>ref</code>
					on the component.
				</p>
			</component-method>
		</component-methods>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="form-wrapper"</template>
				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-form-wrapper />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFormWrapper from "./fragments/playground-form-wrapper.vue";
</script>
