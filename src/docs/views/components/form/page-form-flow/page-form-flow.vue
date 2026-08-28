<template>
	<component-page>
		<template #title>Form flow</template>

		<template #introduction>
			<p>
				<code>form-flow</code>
				joins a number of
				<code>form-screen</code>
				components into one multi-page form, showing one screen's content at a time.
			</p>

			<p>
				Continue validates the visible screen before moving forward. Back keeps entered values and
				does not validate the screen being left. Rules and schemas still receive the complete form
				data.
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
			</component-prop>

			<component-prop id="prop-submit-errors-callback">
				<template #name>submitErrorsCallback</template>
				<template #type>Function</template>
				<template #default-value>null</template>
				<p>
					An optional callback with the shape
					<code>(error) =&gt; errors</code>
					that maps a rejected submit Promise into an errors object. The callback only runs when the
					submit handler returns a rejecting Promise. If the handler catches the error itself, the
					callback will not run.
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

			<component-prop id="prop-status">
				<template #name>status</template>
				<template #type>Object</template>
				<template #default-value>null</template>
				<p>
					Form-wide status feedback shown in the form actions region beside the flow buttons. It
					defaults to
					<code>useForm</code>
					's own submit-lifecycle status, so failed submits show an inline error automatically with
					no setup. Pass a value to override it with app-driven state such as a permission error or
					session expiry, which takes precedence until cleared. For specific submission failures,
					use
					<code>submitErrorsCallback</code>
					.
				</p>

				<p>
					Shape:
					<code>{ type: 'success' | 'error' | 'info', message?: string | string[] }</code>
				</p>

				<p>
					<code>message</code>
					is optional. A bare successful submit has no message and shows no visible alert here by
					design. Success feedback usually belongs in the app's own flash or toast system, wired up
					via
					<code>onSuccess</code>
					, rather than a second inline banner.
				</p>

				<p>
					A message can be a single string or an array of strings. Success and info use
					<code>aria-live="polite"</code>
					; error uses
					<code>role="alert"</code>
					for assertive announcement.
				</p>
			</component-prop>

			<component-prop id="prop-on-success">
				<template #name>onSuccess</template>
				<template #type>Function</template>
				<template #default-value>null</template>
				<p>
					Called with
					<code>(result, formData)</code>
					once the submit handler resolves. Lifecycle hooks receive submit-ready data from
					<code>useForm</code>
					, so the payload contains only currently registered fields. A field's value remains in
					<code>v-model</code>
					when it is unregistered, but it is excluded from submit until a field with the same name
					is registered again.
				</p>

				<p>
					Use this hook for app-level side effects, such as a flash message, closing a modal, or
					navigating away outside the inline
					<code>status</code>
					alert.
				</p>
			</component-prop>

			<component-prop id="prop-on-error">
				<template #name>onError</template>
				<template #type>Function</template>
				<template #default-value>null</template>
				<p>
					Called with
					<code>(error, formData)</code>
					when the submit handler rejects, before
					<code>submitErrorsCallback</code>
					decides whether to swallow the error. The
					<code>formData</code>
					argument contains submit-ready data with currently registered fields only.
				</p>
			</component-prop>

			<component-prop id="prop-on-settled">
				<template #name>onSettled</template>
				<template #type>Function</template>
				<template #default-value>null</template>
				<p>
					Called with
					<code>(result, error, formData)</code>
					after every submit attempt, whichever of
					<code>result</code>
					or
					<code>error</code>
					didn't occur is
					<code>undefined</code>
					. The
					<code>formData</code>
					argument contains submit-ready data with currently registered fields only.
				</p>
			</component-prop>

			<component-prop id="prop-update-page-title-on-error">
				<template #name>updatePageTitleOnError</template>
				<template #type>Boolean</template>
				<template #default-value>true</template>
				<p>
					Whether to update the page title when validation fails. When enabled,
					<code>pageTitleErrorPrefix</code>
					is added to the start of
					<code>document.title</code>
					. Disable this when using router-managed or app-level title handling.
				</p>
			</component-prop>

			<component-prop id="prop-page-title-error-prefix">
				<template #name>pageTitleErrorPrefix</template>
				<template #type>String</template>
				<template #default-value>&quot;Error:&quot;</template>
				<p>
					A prefix added to
					<code>document.title</code>
					after failed validation. The prefix is removed automatically after a successful submit.
				</p>
			</component-prop>

			<component-prop id="prop-readonly">
				<template #name>readonly</template>
				<template #type>Boolean</template>
				<template #default-value>false</template>
				<p>
					When
					<code>true</code>
					, all child
					<code>form-field</code>
					components become readonly. Use for review-mode or read-only forms where the user should
					not edit values. The
					<code>readonly</code>
					attribute is passed through to each field's underlying control.
				</p>
			</component-prop>

			<component-prop id="prop-unsaved-changes-guard">
				<template #name>unsavedChangesGuard</template>
				<template #type>Boolean</template>
				<template #default-value>true</template>
				<p>
					Whether this form guards against losing unsaved changes: it warns on tab close or refresh
					while dirty and contributes to the shared dirty-form count that
					<code>installUnsavedChangesGuard</code>
					's router guard checks. See the
					<code>useForm</code>
					docs for the shared guard. Set to
					<code>false</code>
					for trivial forms, such as a live search filter, where the guard would be unwanted noise.
				</p>
			</component-prop>

			<component-prop id="prop-compact">
				<template #name>compact</template>
				<template #type>Boolean</template>
				<template #default-value>false</template>
				<p>
					When
					<code>true</code>
					, reduces vertical spacing in the form. The change cascades automatically to
					<code>form-layout</code>
					and
					<code>form-fieldset</code>
					.
				</p>
			</component-prop>

			<component-prop id="prop-enable-review">
				<template #name>enableReview</template>
				<template #type>Boolean</template>
				<template #default-value>false</template>
				<p>Whether to show an optional answer review destination before final submission.</p>
			</component-prop>

			<component-prop id="prop-field-types">
				<template #name>fieldTypes</template>
				<template #type>Object</template>
				<template #default-value>{}</template>
				<p>
					Field type transformations applied to initial and submitted form data, keyed by field
					name. Each value is one of
					<code>nullable-number</code>
					or
					<code>nullable-string</code>
					.
				</p>

				<ul>
					<li>
						<code>nullable-number</code>
						converts
						<code>""</code>
						,
						<code>null</code>
						, and
						<code>undefined</code>
						to
						<code>null</code>
						; other values use
						<code>Number(value)</code>
						and
						<code>NaN</code>
						becomes
						<code>null</code>
						.
					</li>
					<li>
						<code>nullable-string</code>
						converts only
						<code>""</code>
						to
						<code>null</code>
						and keeps other values as-is.
					</li>
				</ul>
			</component-prop>

			<component-prop id="prop-initial-data">
				<template #name>initialData</template>
				<template #type>Object | Function</template>
				<template #default-value>null</template>
				<p>
					An object, ref, computed value, or getter used to seed the form once it resolves truthy.
					The value is resolved when it is read. When this prop is omitted, the form continues to
					seed from
					<code>modelValue</code>
					as before. A
					<code>recordId</code>
					is not needed unless the form must later reseed for a different record.
				</p>
			</component-prop>

			<component-prop id="prop-record-id">
				<template #name>recordId</template>
				<template #type>String | Number</template>
				<template #default-value>null</template>
				<p>
					The stable identifier for the record that identifies the contents of this form. When the
					record ID changes to a new truthy value, a clean form waits for
					<code>initialData</code>
					to resolve and reseeds. A dirty form keeps its edits until they are saved or discarded.
				</p>

				<p>
					Only needed when the same form later loads a different record. Pair it with a source that
					refetches when the ID changes.
				</p>
			</component-prop>

			<component-prop id="prop-layout-classes">
				<template #name>layoutClasses</template>
				<template #type>String</template>
				<template #default-value>&quot;&quot;</template>
				<p>
					Additional classes passed to each screen's
					<code>form-layout</code>
					.
				</p>
			</component-prop>

			<component-prop id="prop-rules">
				<template #name>rules</template>
				<template #type>Object</template>
				<template #default-value>{}</template>
				<p>
					All validation lives here, keyed by field name. Each value is an array of rules run
					against the full form data on submit. Rules can rely on other fields, so cross-field
					validation belongs here when it is not contained within a single field.
				</p>
			</component-prop>

			<component-prop id="prop-schema">
				<template #name>schema</template>
				<template #type>Object</template>
				<template #default-value>null</template>
				<p>
					A whole-object Standard Schema (for example, Zod or Valibot), validated against the full
					form data in addition to
					<code>rules</code>
					. Both run together and merge into one per-field result: schema errors first, then
					<code>rules</code>
					errors, with identical messages deduplicated. A field is invalid if either source reports
					an issue.
				</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>default</template>
				<p>
					One or more
					<code>form-screen</code>
					components plus other content. Content outside of
					<code>form-screen</code>
					is always shown on each page.
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

			<component-slot id="slot-empty">
				<template #name>empty</template>
				<p>
					Message shown when all screens are removed and no screen is available. Defaults to
					<code>No screens are available.</code>
					The flow does not render navigation or submit actions in this state, so it cannot submit.
					In development, it warns with
					<code>[form-flow] No visible screens remain.</code>
					when it transitions to the empty state.
				</p>
			</component-slot>

			<component-slot id="slot-back-label">
				<template #name>back-label</template>
				<p>
					The label for the Back button. Defaults to
					<code>Back</code>
					.
				</p>
			</component-slot>

			<component-slot id="slot-continue-label">
				<template #name>continue-label</template>
				<template #default-value>Continue</template>
				<p>The label for the Continue button on interim screens and the review-opening action.</p>
			</component-slot>

			<component-slot id="slot-submit-button-label">
				<template #name>submit-button-label</template>
				<p>
					The label to use on the submit button. This should be representative of what is about to
					happen, such as &quot;Create account&quot; or &quot;Update settings&quot;, not something
					generic, and as such
					<strong>no default label is provided</strong>
					.
				</p>
			</component-slot>

			<component-slot id="slot-secondary-actions">
				<template #name>secondary-actions</template>

				<p>
					Additional actions to appear beside the submit button, such as &quot;Save and exit&quot;
					to come back to the form later. Any actions that relate to a particular field, such as
					&quot;Add another&quot;, should appear with that field or group of fields, not in the
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
								whose keys don't match a field.
							</td>
						</tr>
					</tbody>
				</table>
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
			<component-event id="event-screen-change">
				<template #name>screen-change</template>
				<p>
					Fired after the flow completes navigation to another screen. The payload is
					<code>{ sourceId, destinationId, direction, reason }</code>
					, where
					<code>direction</code>
					is
					<code>"forward"</code>
					or
					<code>"backward"</code>
					and
					<code>reason</code>
					is one of
					<code>back</code>
					,
					<code>conditional-screen-recovery</code>
					,
					<code>continue</code>
					,
					<code>final-error-recovery</code>
					,
					<code>review</code>
					, or
					<code>automatic</code>
					. The
					<code>conditional-screen-recovery</code>
					reason means the active conditional screen disappeared, so the flow moved to the next or
					previous visible screen. The
					<code>final-error-recovery</code>
					reason means final validation found an error on another visible screen, so the flow moved
					to that screen. The
					<code>review</code>
					reason means a review Change button moved to a different screen. The internal
					<code>initial-render</code>
					reason does not emit this event.
				</p>
			</component-event>

			<component-event id="event-submit">
				<template #name>submit</template>
				<p>
					Fired when the user submits the form and validation succeeds, containing submit-ready
					values. By submit-ready, we mean that the returned data only contains currently registered
					fields. When a field is unregistered, its value remains in
					<code>v-model</code>
					, but is excluded from submit unless a field with the same name is registered again.
				</p>
			</component-event>

			<component-event id="event-v-model">
				<template #name>v-model</template>
				<p>
					The current values of each of the
					<code>form-field</code>
					elements contained within the form are available as an object through
					<code>v-model</code>
					. Values remain available here after a field is unregistered, even though they are
					excluded from submit payloads until the field is registered again.
				</p>
			</component-event>
		</component-events>

		<component-provides>
			<template #introduction>
				<p>
					A number of values and helpers are provided by
					<code>form-flow</code>
					under the
					<code>form</code>
					namespace so child
					<code>form-field</code>
					components can communicate with and update the form.
				</p>
			</template>

			<component-provide id="provide-field-errors-for">
				<template #name>
					<code>fieldErrorsFor(fieldName)</code>
				</template>
				<p>
					Returns all error messages for a field, deduplicating identical messages. Combines
					parent-owned
					<code>fieldErrors</code>
					, submit callback errors, and form-level
					<code>rules</code>
					errors into a single array. Used by
					<code>form-field</code>
					for its error display.
				</p>
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
							<td><code>fieldName</code></td>
							<td><code>string</code></td>
							<td>The name of the registered field.</td>
						</tr>
					</tbody>
				</table>
			</component-provide>

			<component-provide id="provide-register-field">
				<template #name>
					<code>registerField(field)</code>
				</template>
				<p>Add a field to a form's list of fields.</p>
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
							<td><code>field.triggerFocus</code></td>
							<td><code>function</code></td>
							<td>Method to focus on this field, used by the error summary.</td>
						</tr>
					</tbody>
				</table>
			</component-provide>

			<component-provide id="provide-unregister-field">
				<template #name>
					<code>unregisterField(fieldName)</code>
				</template>
				<p>
					Remove a field from a form's list of fields. This does not remove its value or
					parent-owned errors. Its value remains in
					<code>v-model</code>
					, but is excluded from submit payloads until a field with the same name is registered
					again. Error-summary links and focus-on-error only target currently registered fields, so
					conditionally removed fields are not targeted.
				</p>
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
							<td><code>fieldName</code></td>
							<td><code>string</code></td>
							<td>The name of the field to unregister.</td>
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

			<component-provide id="provide-is-readonly">
				<template #name>
					<code>isReadonly</code>
				</template>
				<p>
					A reactive boolean that reflects the
					<code>readonly</code>
					prop. Used by
					<code>form-field</code>
					to cascade readonly state to underlying controls. Not intended for direct consumer use.
				</p>
			</component-provide>

			<component-provide id="provide-is-field-required">
				<template #name>
					<code>isFieldRequired(fieldName)</code>
				</template>
				<p>
					Returns whether the form's validation rules mark a field as required. Used by form fields
					and related controls to cascade the required state.
				</p>
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
							<td><code>fieldName</code></td>
							<td><code>string</code></td>
							<td>The name of the field to check.</td>
						</tr>
					</tbody>
				</table>
			</component-provide>

			<component-provide id="provide-is-compact">
				<template #name>
					<code>isCompact</code>
				</template>
				<p>
					A reactive boolean that reflects the
					<code>compact</code>
					prop. Used by
					<code>form-layout</code>
					and
					<code>form-fieldset</code>
					to apply compact spacing and headings.
				</p>
			</component-provide>
		</component-provides>

		<component-methods>
			<component-method id="method-reset-submit-button">
				<template #name>resetSubmitButton</template>
				<p>
					Resets the submit button's loading state. Call this after your
					<code>@submit</code>
					handler completes if it does not return a Promise, for example when the async work is
					deferred or the result comes back via a separate channel.
				</p>
			</component-method>
		</component-methods>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="form-flow"</template>
				<p>Present on the root element. Use it to scope styles to this component.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-form-flow />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFormFlow from "./fragments/playground-form-flow.vue";
</script>
