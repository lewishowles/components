<template>
	<component-page>
		<template #title>useFormData</template>

		<template #introduction>
			<p>
				<code>useFormData</code>
				prepares the
				<code>formData</code>
				ref that is passed to
				<router-link v-bind="{ to: '/form/form-wrapper' }">
					<code>form-wrapper</code>
				</router-link>
				or
				<code>useForm</code>
				. It initialises values from an async data source, such as the
				<code>data</code>
				ref from a Pinia Colada query. It populates the form once when the source first becomes
				available.
			</p>

			<p>
				When using this composable, gate the form on the query's
				<code>isReady</code>
				so fields mount only after data is available.
			</p>
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
			</component-method>
		</component-methods>

		<component-tab v-bind="{ id: 'tab-examples', icon: 'icon-code' }">
			<template #title>Examples</template>

			<code-block :code="formDataExample" />
		</component-tab>
	</component-page>
</template>

<script setup>
const formDataExample = `<template>
	<form-wrapper v-if="isReady" v-model="formData" @submit="saveProfile">
		<form-field name="name">Full name</form-field>
		<form-field name="email" type="email">Email address</form-field>

		<template #submit-button-label>Save profile</template>
	</form-wrapper>
</template>

<script setup>
import { computed } from "vue";
import { useFormData } from "@lewishowles/components/composables";
import { useUser } from "@/queries/use-user";

const { data: profile } = useUser();
const isReady = computed(() => Boolean(profile.value));

const formData = useFormData(profile, (data) => ({
	email: data.email,
	name: data.name,
}));
\x3c/script>`;
</script>
