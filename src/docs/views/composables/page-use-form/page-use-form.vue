<template>
	<component-page>
		<template #title>useForm</template>

		<template #introduction>
			<p>
				<code>useForm</code>
				prepares the bindings passed to
				<router-link v-bind="{ to: '/form/form-wrapper' }">
					<code>form-wrapper</code>
				</router-link>
				. Use it when setting up a form so form data, validation rules, initial values, and submit
				side effects stay together.
			</p>

			<p>
				Destructure
				<code>form</code>
				from the return and pass it to
				<router-link v-bind="{ to: '/form/form-wrapper' }">
					<code>form-wrapper</code>
				</router-link>
				with
				<code>v-bind</code>
				. The wrapper still handles field registration, validation, the error summary, and the
				<router-link v-bind="{ to: '/form/form-field' }">
					<code>form-field</code>
				</router-link>
				injection. Additional values such as
				<code>formData</code>
				and
				<code>isDirty</code>
				are also returned and can be destructured when needed.
			</p>
		</template>

		<component-parameters v-bind="{ title: 'Options' }">
			<component-parameter id="parameter-initial-data">
				<template #name>initialData</template>
				<template #type>Ref | object</template>

				<p>
					Initial values for the form. Pass a plain object to seed the form immediately, or pass an
					async source such as a query
					<code>data</code>
					ref; the form populates once the source first becomes available.
				</p>
			</component-parameter>

			<component-parameter id="parameter-mapper">
				<template #name>mapper</template>
				<template #type>function</template>

				<p>
					Shapes the resolved
					<code>initialData</code>
					value into the object used by the form. Receives the resolved value and should return a
					plain object whose keys match your
					<router-link v-bind="{ to: '/form/form-field' }">
						<code>form-field</code>
					</router-link>
					<code>name</code>
					attributes. Use it when the source data has a different shape to your form fields, for
					example to rename keys or pick a subset of properties. Defaults to a deep clone of the
					source.
				</p>
			</component-parameter>

			<component-parameter id="parameter-record-id">
				<template #name>recordId</template>
				<template #type>string | number</template>

				<p>
					Identifies the record that
					<code>initialData</code>
					represents. Most forms can leave this out and rely on the default behaviour: populate
					once, then never reseed. Provide
					<code>recordId</code>
					when a single form instance is reused for different records, such as an edit page whose
					route changes from one item to another without remounting the component.
				</p>

				<p>
					When
					<code>recordId</code>
					changes to a new value, the form reseeds itself from
					<code>initialData</code>
					once that source next resolves, as long as the form isn't dirty (see
					<code>isDirty</code>
					below). If the user has unsaved changes at that point, the reseed is skipped until they
					save or discard them, and the
					<code>unsavedChangesGuard</code>
					below helps prevent them from losing that work by accident.
				</p>
			</component-parameter>

			<component-parameter id="parameter-unsaved-changes-guard">
				<template #name>unsavedChangesGuard</template>
				<template #type>boolean</template>

				<p>
					Whether this form should guard against losing unsaved changes: warn on tab close/refresh
					while dirty, and contribute to a shared dirty-form count that
					<code>installUnsavedChangesGuard</code>
					's router guard checks. Defaults to
					<code>true</code>
					. Set to
					<code>false</code>
					for trivial forms, such as a live search filter, where the guard would be unwanted noise.
				</p>
			</component-parameter>

			<component-parameter id="parameter-rules">
				<template #name>rules</template>
				<template #type>object</template>

				<p>
					Form-level validation rules, keyed by field name. Run on submit before the handler is
					called.
				</p>
			</component-parameter>

			<component-parameter id="parameter-schema">
				<template #name>schema</template>
				<template #type>object</template>

				<p>
					A whole-object Standard Schema (e.g. Zod, Valibot), validated against the full form data
					alongside
					<code>rules</code>
					. Both run together and merge into a single per-field result, schema errors first. A
					whole-object schema can't express cross-field constraints (
					<code>same</code>
					,
					<code>required_if</code>
					,
					<code>different</code>
					,
					<code>custom</code>
					), so
					<code>rules</code>
					remains available for those.
					<code>v-bind="form"</code>
					carries
					<code>schema</code>
					through to
					<router-link v-bind="{ to: '/form/form-wrapper' }">
						<code>form-wrapper</code>
					</router-link>
					the same way it does
					<code>rules</code>
					.
				</p>
			</component-parameter>

			<component-parameter id="parameter-on-submit">
				<template #name>onSubmit(formData)</template>
				<template #type>function</template>

				<p>
					Called with the current form values when validation passes. This is where the async work
					goes: an API call, a mutation, or similar. Throw to trigger
					<code>onError</code>
					.
				</p>
			</component-parameter>

			<component-parameter id="parameter-on-success">
				<template #name>onSuccess(result, formData)</template>
				<template #type>function</template>

				<p>
					Called after
					<code>onSubmit</code>
					resolves successfully. Use it for side effects such as showing a flash message, closing a
					modal, or navigating away.
				</p>
			</component-parameter>

			<component-parameter id="parameter-on-error">
				<template #name>onError(error, formData)</template>
				<template #type>function</template>

				<p>
					Called when
					<code>onSubmit</code>
					throws or rejects. Use it to log the error or show a fallback message for failures that
					cannot be mapped to a specific field.
				</p>
			</component-parameter>

			<component-parameter id="parameter-on-settled">
				<template #name>onSettled(result, error, formData)</template>
				<template #type>function</template>

				<p>
					Called after every submit attempt regardless of outcome. Useful for cleanup that should
					run whether the submit succeeded or failed.
				</p>
			</component-parameter>
		</component-parameters>

		<component-returns v-bind="{ title: 'Returned values' }">
			<component-return id="return-form">
				<template #name>form</template>
				<template #type>object</template>

				<p>
					A bindable object for
					<code>v-bind="form"</code>
					on
					<router-link v-bind="{ to: '/form/form-wrapper' }">
						<code>form-wrapper</code>
					</router-link>
					. Packs the
					<code>v-model</code>
					binding, validation
					<code>rules</code>
					, and the
					<code>@submit</code>
					handler so no separate bindings are needed.
				</p>
			</component-return>

			<component-return id="return-form-data">
				<template #name>formData</template>
				<template #type>Ref&lt;object&gt;</template>

				<p>
					The current form field values. Destructure this when you need direct access, for example
					to watch for changes or derive computed values from the form state.
				</p>
			</component-return>

			<component-return id="return-is-submitting">
				<template #name>isSubmitting</template>
				<template #type>Ref&lt;boolean&gt;</template>

				<p>Whether a submit is currently in progress.</p>
			</component-return>

			<component-return id="return-is-dirty">
				<template #name>isDirty</template>
				<template #type>ComputedRef&lt;boolean&gt;</template>

				<p>Whether the current form values differ from the initial values.</p>
			</component-return>

			<component-return id="return-status">
				<template #name>status</template>
				<template #type>Ref&lt;object | null&gt;</template>

				<p>
					The result of the last submit as
					<code>{ type: 'success' | 'error', message }</code>
					, shaped to feed directly into
					<router-link v-bind="{ to: '/form/form-wrapper' }">
						<code>form-wrapper</code>
					</router-link>
					's
					<code>status</code>
					prop. Clears when the next submit begins.
				</p>
			</component-return>
		</component-returns>

		<component-methods>
			<component-method id="method-install-unsaved-changes-guard">
				<template #name>
					<code>installUnsavedChangesGuard(router, options)</code>
				</template>

				<p>
					Registers a single, app-wide navigation guard that blocks routing away while any
					<code>useForm</code>
					instance is dirty. Call once, wherever the app builds its router: every
					<code>useForm</code>
					instance with
					<code>unsavedChangesGuard</code>
					enabled (the default) contributes to the shared dirty-form count this checks. Takes the
					router instance directly rather than importing anything from
					<code>vue-router</code>
					, so this library carries no dependency on it.
				</p>

				<table>
					<thead>
						<tr>
							<th>Parameter</th>
							<th>Type</th>
							<th>Purpose</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>router</code></td>
							<td><code>object</code></td>
							<td>
								A Vue Router instance, or anything exposing a compatible
								<code>beforeEach</code>
								method.
							</td>
						</tr>
						<tr>
							<td><code>options.message</code></td>
							<td><code>string</code></td>
							<td>The message shown in the confirm dialog before blocking navigation.</td>
						</tr>
					</tbody>
				</table>
			</component-method>
		</component-methods>

		<component-tab v-bind="{ id: 'tab-examples', icon: 'icon-code' }">
			<template #title>Examples</template>

			<h3>Unsaved changes</h3>

			<code-block :code="unsavedChangesExample" />

			<h3>Async-seeded form</h3>

			<p>
				Pass a ref as
				<code>initialData</code>
				and the form populates once it becomes truthy. Only show the form itself when you determine
				that the data is ready, so that fields mount after data is available.
			</p>

			<code-block :code="asyncExample" language="html" />

			<h3>Sync form</h3>

			<code-block :code="syncExample" language="html" />

			<h3>Using a mapper</h3>

			<p>
				Use
				<code>mapper</code>
				when the source data shape does not match your field names, for example to rename keys or
				pick a subset of properties.
			</p>

			<code-block :code="mapperExample" language="javascript" />

			<h3>Watching form data</h3>

			<p>
				Destructure
				<code>formData</code>
				alongside
				<code>form</code>
				when you need to react to field changes outside the submit flow.
			</p>

			<code-block :code="watchExample" language="javascript" />
		</component-tab>
	</component-page>
</template>

<script setup>
const unsavedChangesExample = `// router.js, wherever the app builds its router
import { installUnsavedChangesGuard } from "@lewishowles/components/composables";

const router = createRouter({ ... });

installUnsavedChangesGuard(router);`;

const asyncExample = `<template>
	<form-wrapper v-if="isReady" v-bind="form">
		<form-field name="name">Full name</form-field>

		<form-field name="email" type="email">Email address</form-field>

		<template #submit-button-label>Save profile</template>
	</form-wrapper>
</template>

<script setup>
import { useForm } from "@lewishowles/components/composables";

const { isReady, data: userDetails } = useUser(userId);

const { form } = useForm({
	initialData: userDetails,
	rules: {
		name: [{ rule: "required", message: "Enter your full name." }],
		email: [{ rule: "required", message: "Enter your email address." }],
	},
	onSubmit: (values) => console.log(values),
	onSuccess: () => console.log("Profile saved"),
	onError: (error) => console.error(error),
});
\x3c/script>`;

const syncExample = `<template>
	<form-wrapper v-bind="form">
		<form-field name="name">Full name</form-field>

		<form-field name="email" type="email">Email address</form-field>

		<template #submit-button-label>Send invite</template>
	</form-wrapper>
</template>

<script setup>
import { useForm } from "@lewishowles/components/composables";

const { form } = useForm({
	rules: {
		name: [{ rule: "required", message: "Enter a name." }],
		email: [{ rule: "required", message: "Enter an email address." }],
	},
	onSubmit: (values) => console.log(values),
});
\x3c/script>`;

const mapperExample = `const { form } = useForm({
	initialData: userDetails,
	mapper: (data) => ({
		name: data.displayName,
		email: data.emailAddress,
	}),
	onSubmit: (values) => console.log(values),
});`;

const watchExample = `import { watch } from "vue";

const { form, formData } = useForm({ ... });

watch(formData, (values) => {
	console.log("Form changed", values);
});`;
</script>
