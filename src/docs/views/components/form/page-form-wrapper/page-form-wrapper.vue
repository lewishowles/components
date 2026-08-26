<template>
	<component-page>
		<template #title>Form wrapper</template>

		<template #introduction>
			<p>
				<code>form-wrapper</code>
				is intended as a complete form, wrapped around individual fields. The wrapper automatically
				adds actions, owns form-level validation, and generates an error summary to maximise the
				accessibility of the form.
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

			<p>
				Internally,
				<code>form-wrapper</code>
				uses
				<code>useForm</code>
				to register child fields, run validation, build the error summary, and manage the submit
				lifecycle. Custom wrappers use the same composable and provide the same
				<code>form-wrapper</code>
				injection when they need
				<code>form-field</code>
				children to work.
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

				<code-block v-bind="{ code: fieldErrorsExample }" />
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

			<component-prop id="prop-rules">
				<template #name>rules</template>

				<template #type>Object</template>

				<template #default-value>{}</template>

				<p>
					All validation lives here, keyed by field name. Each value is an array of rules run
					against the full form data on submit. Keeping validation in one place keeps it contained
					rather than spread across fields, and it also allows rules that rely on other fields.
				</p>

				<code-block v-bind="{ code: rulesExample }" />

				<p>
					Each entry in a field's rules array can be either an object
					<code>{ rule, message?, ...ruleOptions }</code>
					or a function
					<code>(value, formData)</code>
					(see Function shorthand below). Available rules include:
				</p>

				<h4 id="rule-required">required</h4>

				<p>
					Requires a value to be set. Adds the
					<code>required</code>
					attribute to the field automatically.
				</p>

				<code-block v-bind="{ code: ruleRequired }" />

				<h4 id="rule-email">email</h4>

				<p>
					Perform a minimal check to see if the value contains an
					<code>@</code>
					symbol. More complex verification isn't really necessary, and the only true way to test an
					email address is through verification.
				</p>

				<code-block v-bind="{ code: ruleEmail }" />

				<h4 id="rule-size">size</h4>

				<p>
					Ensure that the provided value has at least size
					<code>size</code>
					. For strings, the number of characters is used, for arrays, the length of the array, for
					objects, the number of properties, for numbers, the number itself is used, and for numeric
					strings the integer value of the string is used.
				</p>

				<code-block v-bind="{ code: ruleSize }" />

				<h4 id="rule-min">min</h4>

				<p>
					Ensure that the provided value has at least size
					<code>min</code>
					. Values are evaluated as in the
					<code>size</code>
					rule.
				</p>

				<code-block v-bind="{ code: ruleMin }" />

				<h4 id="rule-max">max</h4>

				<p>
					Ensure that the provided value has at most size
					<code>max</code>
					. Values are evaluated as in the
					<code>size</code>
					rule.
				</p>

				<code-block v-bind="{ code: ruleMax }" />

				<h4 id="rule-between">between</h4>

				<p>
					Ensure that the provided value has between
					<code>min</code>
					and
					<code>max</code>
					size. Values are evaluated as in the
					<code>size</code>
					rule.
				</p>

				<code-block v-bind="{ code: ruleBetween }" />

				<h4 id="rule-in">in</h4>

				<p>
					Ensure that the given value is included within
					<code>options</code>
					.
				</p>

				<code-block v-bind="{ code: ruleIn }" />

				<h4 id="rule-not-in">not_in</h4>

				<p>
					Ensure that the given value is not included within
					<code>options</code>
					.
				</p>

				<code-block v-bind="{ code: ruleNotIn }" />

				<h4 id="rule-regexp">regexp</h4>

				<p>
					Ensure that the provided value matches
					<code>regexp</code>
					.
				</p>

				<code-block v-bind="{ code: ruleRegexp }" />

				<h4 id="rule-same">same / different</h4>

				<p>
					Compare the value against another field's value.
					<code>same</code>
					requires them to match;
					<code>different</code>
					requires them to differ.
				</p>

				<code-block v-bind="{ code: ruleSame }" />

				<h4 id="rule-custom">custom</h4>

				<p>
					The escape hatch for any constraint the declarative rules can't express, including
					cross-field validation.
					<code>validate</code>
					receives the field's own value and the complete form data.
				</p>

				<code-block v-bind="{ code: ruleCustom }" />

				<h4 id="rule-function">Function shorthand</h4>

				<p>
					A rule entry can also be a function
					<code>(value, formData)</code>
					instead of an object. The return value determines the outcome:
				</p>

				<ul>
					<li>
						<code>true</code>
						or any truthy non-string: valid.
					</li>
					<li>A non-empty string: invalid; the string is used as the error message.</li>
					<li>A non-empty array of strings: invalid; each string becomes an error message.</li>
				</ul>

				<code-block v-bind="{ code: ruleFunction }" />

				<p>
					Form-level errors map to the named field, so they display beside the field and appear in
					the error summary; the error summary link still focuses the correct field. Within a field,
					errors follow the order of its rules array. Rules re-run on every submit, so resolved
					errors clear automatically.
				</p>
			</component-prop>

			<component-prop id="prop-schema">
				<template #name>schema</template>

				<template #type>Object</template>

				<template #default-value>null</template>

				<p>
					A whole-object Standard Schema (e.g. Zod, Valibot), validated against the full form data
					in addition to
					<code>rules</code>
					. Both run together and merge into a single per-field result: schema errors first, then
					<code>rules</code>
					errors, with identical messages deduplicated. A field is invalid if either source reports
					an issue.
				</p>

				<code-block v-bind="{ code: schemaExample }" />

				<p>
					Each schema issue's
					<code>path[0]</code>
					maps it to its field; deeper nested paths aren't currently mapped. A whole-object schema
					can't express cross-field constraints (
					<code>same</code>
					,
					<code>required_if</code>
					,
					<code>different</code>
					,
					<code>custom</code>
					), so
					<code>rules</code>
					remains available alongside it for those cases.
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
					components become readonly. The
					<code>readonly</code>
					attribute is passed through to each field's underlying control. Use for review-mode or
					read-only forms where the user should not edit values.
				</p>

				<code-block v-bind="{ code: readonlyExample }" />
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

				<code-block v-bind="{ code: compactExample }" />
			</component-prop>

			<component-prop id="prop-field-types">
				<template #name>fieldTypes</template>

				<template #type>Object</template>

				<template #default-value>{}</template>

				<p>
					Field type transformations applied to submitted form data, keyed by field name. Each value
					is one of
					<code>nullable-number</code>
					or
					<code>nullable-string</code>
					.
					<code>nullable-number</code>
					converts
					<code>""</code>
					/
					<code>null</code>
					/
					<code>undefined</code>
					to
					<code>null</code>
					, else
					<code>Number(value)</code>
					(
					<code>NaN</code>
					→
					<code>null</code>
					).
					<code>nullable-string</code>
					converts
					<code>""</code>
					to
					<code>null</code>
					, else keeps the value as-is. This coerces both the initial seed and submitted data, one
					declaration for both directions.
				</p>

				<code-block v-bind="{ code: fieldTypesExample }" />
			</component-prop>

			<component-prop id="prop-initial-data">
				<template #name>initialData</template>

				<template #type>Object | Function</template>

				<template #default-value>null</template>

				<p>
					An object, ref, computed, or getter used to seed the form once it resolves truthy. When
					omitted,
					<code>modelValue</code>
					remains the source of any starting data. No
					<code>recordId</code>
					needed unless the form must later reseed for a different record.
				</p>

				<p>
					Rename fields inline, or with
					<code>mapFormData</code>
					for larger reshaping.
				</p>

				<code-block v-bind="{ code: initialDataExample }" />
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
					refetches when the id changes.
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
								whose keys don't match a registered field.
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
					The current value of the included form fields, in a flat object, keyed by the
					<code>name</code>
					value for each field. Values remain available here after a field is unregistered, even
					though they are excluded from submit payloads until a field with the same name is
					registered again.
				</p>
			</component-event>
		</component-events>

		<component-provides>
			<template #introduction>
				<p>
					Methods and data are provided by
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

				<p>Add a field to a form's field list.</p>

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

			<component-provide id="provide-is-compact">
				<template #name>
					<code>isCompact</code>
				</template>

				<p>
					A reactive boolean that reflects the
					<code>compact</code>
					prop. Consumed by
					<code>form-layout</code>
					and
					<code>form-fieldset</code>
					to reduce vertical spacing. Not intended for direct consumer use.
				</p>
			</component-provide>
		</component-provides>

		<component-methods>
			<component-method id="method-use-form">
				<template #name>
					<code>useForm</code>
				</template>

				<p>
					<code>useForm</code>
					is the composable behind
					<code>form-wrapper</code>
					. A custom wrapper calls it to provide the same
					<code>form-wrapper</code>
					injection that
					<code>form-field</code>
					uses.
				</p>

				<code-block v-bind="{ code: useFormExample }" />
			</component-method>

			<component-method id="method-reset-submit-button">
				<template #name>
					<code>resetSubmitButton</code>
				</template>

				<p>
					Resets the submit button's loading state. Call this after your
					<code>@submit</code>
					handler completes if it does not return a Promise, for example when the async work is
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
			<playground-compact-form-wrapper />
			<playground-async-initial-data />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFormWrapper from "./fragments/playground-form-wrapper.vue";
import PlaygroundCompactFormWrapper from "./fragments/playground-compact-form-wrapper.vue";
import PlaygroundAsyncInitialData from "./fragments/playground-async-initial-data.vue";

const useFormExample = `import { useForm } from "@lewishowles/components/composables";

const {
	fieldErrorsFor,
	isFieldRequired,
	isReadonly,
	registerField,
	updateFieldValue,
} = useForm({
	initialData: modelValue,
	rules: props.rules,
	onSubmit: (data) => emit("submit", data),
	errorSummaryElement,
	generalErrorsElement,
	submitButtonRef,
});

provide("form", {
	fieldErrorsFor,
	isFieldRequired,
	isReadonly,
	registerField,
	updateFieldValue,
});`;

const fieldErrorsExample = `const fieldErrors = { date: "The date must be in the future", email: ["The email address provided already exists"], };`;

const readonlyExample = `<form-wrapper v-bind="{ readonly: true }">…</form-wrapper>`;

const compactExample = `<form-wrapper v-bind="{ compact: true }">…</form-wrapper>`;

const fieldTypesExample = `<form-wrapper v-bind="{ fieldTypes: { age: 'nullable-number' } }">…</form-wrapper>`;

const initialDataExample = `import { computed } from "vue";
import { mapFormData } from "@lewishowles/components/composables";

const initialData = computed(() => {
	if (!record.value) {
		return null;
	}

	return mapFormData(record.value, {
		fields: { firstName: "first_name", age: "age" },
	});
});

<form-wrapper v-model="formData" v-bind="{ fieldTypes: { age: 'nullable-number' }, initialData }">…</form-wrapper>`;

const rulesExample = `const rules = {
	confirmPassword: [{ rule: "same", field: "password", message: "Passwords must match" }],
	endDate: [{ rule: "custom", validate: (value, formData) => !value || !formData.startDate || value > formData.startDate, message: "End date must be after the start date" }],
};

<form-wrapper v-bind="{ rules }">

</form-wrapper>
`;

const schemaExample = `import { z } from "zod";

const schema = z.object({
	email: z.string().min(1, "Enter your email address").email("Enter a valid email address"),
});

<form-wrapper v-bind="{ schema }">

</form-wrapper>
`;

const ruleRequired = `[{ rule: "required", message: "Enter your name so we know what to call you" }]`;
const ruleEmail = `[{ rule: "email", message: "We need an email address to set up your account" }]`;
const ruleSize = `[{ rule: "size", size: 11, message: "Your phone number should be 11 digits long" }]`;
const ruleMin = `[{ rule: "min", min: 11, message: "Your phone number should be at least 11 digits long" }]`;
const ruleMax = `[{ rule: "max", max: 11, message: "Your phone number should be no more than 11 digits long" }]`;
const ruleBetween = `[{ rule: "between", min: 5, max: 8, message: "Your post code should be between 5 and 8 characters" }]`;
const ruleIn = `[{ rule: "in", options: ["a", "b", "c"], message: "Your choice should be a, b, or c" }]`;
const ruleNotIn = `[{ rule: "not_in", options: ["a", "b", "c"], message: "Your choice should not include a, b, or c" }]`;
const ruleRegexp = `[{ rule: "regexp", regexp: /[abc]+/, message: "Your ID should only contain the letters a, b, and c" }]`;
const ruleSame = `[{ rule: "same", field: "password", message: "Passwords must match" }]`;
const ruleCustom = `[{ rule: "custom", validate: (value, formData) => value > formData.startDate, message: "End date must be after the start date" }]`;

const ruleFunction = `[
	(v) => !!v || "Enter your name",
	(v) => /^[a-z]+$/i.test(v) || "Name must only contain letters",
]`;
</script>
