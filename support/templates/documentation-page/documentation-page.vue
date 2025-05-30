<template>
	<component-page>
		<template #title>
			{{SENTENCE_CASE_NAME}}
		</template>

		<template #introduction>
			<p></p>
		</template>
{{COMPONENT_PROPS}}
{{COMPONENT_SLOTS}}
{{COMPONENT_EVENTS}}
{{COMPONENT_METHODS}}
		<component-provides>
			<template #introduction>
				<p>...</p>
			</template>

			<component-provide id="provide-">
				<template #name>
					<code>...</code>
				</template>

				<p>...</p>

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
							<td><code>...</code></td>
							<td><code>...</code></td>
							<td>...</td>
						</tr>
					</tbody>
				</table>
			</component-provide>
		</component-provides>

		<component-playgrounds>
			<playground-{{COMPONENT_NAME}} />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import Playground{{PASCAL_CASE_NAME}} from "./fragments/playground-{{COMPONENT_NAME}}.vue";
</script>
