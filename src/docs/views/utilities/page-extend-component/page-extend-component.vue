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

			<h3>With auto-imports (recommended)</h3>

			<p>
				If your project uses
				<code>unplugin-vue-components</code>
				or similar auto-import tooling, the simplest approach is to create a local
				<code>.vue</code>
				wrapper.
			</p>

			<code-block :code="autoImportExample" />

			<p>Then use it anywhere, and auto-imports will resolve it:</p>

			<code-block :code="usageExample" />

			<p>
				The local wrapper takes precedence over the library component because auto-imports scan
				local components before applying custom resolvers.
			</p>

			<h3>Without auto-imports</h3>

			<p>
				If your project doesn't use auto-imports, define the wrapper as a JavaScript module and
				import it explicitly where needed.
			</p>

			<code-block :code="definitionExample" />

			<p>Then import and use it:</p>

			<code-block :code="manualImportExample" />
		</component-tab>
	</component-page>
</template>

<script setup>
const autoImportExample = `<!-- src/components/form/form-wrapper/form-wrapper.vue -->
<script setup>
import { extendComponent } from "@lewishowles/components/utilities";
import { parseApiFieldErrors } from "@/helpers/api";
import { FormWrapper } from "@lewishowles/components";

const ExtendedComponent = extendComponent(FormWrapper, {
	props: { fieldErrorsCallback: parseApiFieldErrors },
});
\x3c/script>

<template>
	<extended-component v-bind="$attrs">
		<template v-for="(_, slot) in $slots" #[slot]="slotProps">
			<slot :name="slot" v-bind="slotProps ?? {}" />
		</template>
	</extended-component>
</template>`;

const definitionExample = `// src/components/form/form-wrapper/form-wrapper.js
import { extendComponent } from "@lewishowles/components/utilities";
import { parseApiFieldErrors } from "@/helpers/api";

import { FormWrapper } from "@lewishowles/components";

export default extendComponent(FormWrapper, {
	name: "form-wrapper",
	props: { fieldErrorsCallback: parseApiFieldErrors },
});`;

const usageExample = `<form-wrapper v-model="form" @submit="save">
	<form-field name="email">Email</form-field>

	<template #submit-button-label>Create account</template>
</form-wrapper>`;

const manualImportExample = `import FormWrapper from "@/components/form/form-wrapper";

<form-wrapper v-model="form" @submit="save">
	<form-field name="email">Email</form-field>

	<template #submit-button-label>Create account</template>
</form-wrapper>`;
</script>
