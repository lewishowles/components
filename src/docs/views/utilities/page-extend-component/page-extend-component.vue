<template>
	<component-page>
		<template #title>extendComponent</template>

		<template #introduction>
			<p>
				<code>extendComponent</code>
				creates a wrapper around an existing component that forwards all props, attributes, slots,
				<code>v-model</code>
				bindings, and exposed methods automatically, while allowing default props and slots to be
				provided.
			</p>

			<p>
				It is intended for wrapping a library component in your own application to inject
				project-specific defaults—such as a shared error-parsing callback on
				<router-link v-bind="{ to: '/form/form-wrapper' }">
					<code>form-wrapper</code>
				</router-link>
				—without having to re-declare its interface. Anything the caller provides takes precedence
				over the defaults, so the wrapper can be a simple drop-in replacement.
			</p>
		</template>

		<component-parameters>
			<component-parameter id="parameter-base-component">
				<template #name>baseComponent</template>

				<template #type>object</template>

				<p>The component to extend.</p>
			</component-parameter>

			<component-parameter id="parameter-options">
				<template #name>options</template>

				<template #type>object</template>

				<p>Optional configuration for the wrapper.</p>

				<table>
					<thead>
						<tr>
							<th>Option</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>name</code></td>
							<td><code>string</code></td>
							<td>
								An optional name for the resulting component. Defaults to
								<code>extended-{name}</code>
								based on the base component.
							</td>
						</tr>
						<tr>
							<td><code>props</code></td>
							<td><code>object</code></td>
							<td>Default props to apply, overridable by the caller.</td>
						</tr>
						<tr>
							<td><code>slots</code></td>
							<td><code>object</code></td>
							<td>Default slots, as render functions, overridable by the caller.</td>
						</tr>
					</tbody>
				</table>
			</component-parameter>
		</component-parameters>

		<component-returns>
			<component-return id="return-component">
				<template #name>component</template>

				<template #type>object</template>

				<p>
					A new component that renders the base component with the provided defaults applied, and
					all caller-provided props, attributes, slots,
					<code>v-model</code>
					bindings, and exposed methods forwarded automatically.
				</p>
			</component-return>
		</component-returns>

		<component-tab v-bind="{ id: 'tab-example', icon: 'icon-code' }">
			<template #title>Example</template>

			<p>
				Define the wrapper once in JavaScript, then import it wherever you would use the base
				component. It behaves exactly like the component it extends—slots, props,
				<code>v-model</code>
				, and events are all forwarded.
			</p>

			<code-block :code="definitionExample" />

			<p>Then import and use it like the component it extends:</p>

			<code-block :code="usageExample" />
		</component-tab>
	</component-page>
</template>

<script setup>
const definitionExample = `// src/components/form/form-wrapper.js
import { extendComponent } from "@lewishowles/components/utilities";
import { parseApiFieldErrors } from "@/helpers/api";

import { FormWrapper } from "@lewishowles/components";

export default extendComponent(FormWrapper, {
	name: "form-wrapper",
	props: { fieldErrorsCallback: parseApiFieldErrors },
});`;

const usageExample = `import FormWrapper from "@/components/form/form-wrapper";

<form-wrapper v-model="form" @submit="save">
	<form-field name="email">Email</form-field>

	<template #submit-button-label>Create account</template>
</form-wrapper>`;
</script>
