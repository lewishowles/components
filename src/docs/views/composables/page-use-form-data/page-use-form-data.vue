<template>
	<component-page>
		<template #title>useFormData</template>

		<template #introduction>
			<p>
				<code>useFormData</code>
				initialises form data from an async data source, such as the
				<code>data</code>
				ref from a Pinia Colada query. It populates the form once when the source first becomes
				available.
			</p>

			<p>
				When using this composable, gate the form on the query's
				<code>isReady</code>
				so fields mount only after data is available.
			</p>

			<code-block
				:code="`import { useFormData } from &quot;@lewishowles/components/composables&quot;;`"
			/>
		</template>

		<component-returns>
			<component-return id="return-form-data">
				<template #name>formData</template>

				<template #type>Ref&lt;object&gt;</template>

				<p>
					The form data object, initialised as
					<code>{}</code>
					and populated with the mapped value once the source resolves.
				</p>
			</component-return>
		</component-returns>

		<component-methods>
			<component-method id="method-use-form-data">
				<template #name>
					<code>useFormData(source, mapper)</code>
				</template>

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
							<td><code>source</code></td>
							<td><code>Ref</code></td>
							<td>
								The async data source to watch. Typically the
								<code>data</code>
								ref from a Pinia Colada query.
							</td>
						</tr>
						<tr>
							<td><code>mapper</code></td>
							<td><code>function</code></td>
							<td>Maps the resolved source value to the initial form data object.</td>
						</tr>
					</tbody>
				</table>

				<p>Usage example:</p>

				<code-block :code="usageExample" />

				<p>Template gate:</p>

				<code-block :code="templateExample" language="html" />
			</component-method>
		</component-methods>
	</component-page>
</template>

<script setup>
// Usage examples shown in the documentation.
const usageExample = `const { isReady, userDetails } = useUser(userId);

const formData = useFormData(userDetails, (data) => ({
	email: data.email,
	name: data.name,
}));`;

const templateExample = `<form-wrapper v-if="isReady" v-model="formData" @submit="handleSubmit">
	<!-- form fields -->
</form-wrapper>`;
</script>
