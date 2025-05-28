<template>
	<component-page>
		<template #title>
			{{SENTENCE_CASE_NAME}}
		</template>

		<template #introduction>
			<p></p>
		</template>

		<component-props>
{{COMPONENT_PROPS}}
		</component-props>

		<component-slots>
{{COMPONENT_SLOTS}}
		</component-slots>

		<component-events>
			<component-event id="event-v-model">
				<template #name>
					v-model
				</template>

				<p>The current value of ... will be available via <code>v-model</code>.</p>
			</component-event>
		</component-events>

		<component-methods>
			<component-method id="method-something">
				<template #name>
					something
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
			</component-method>
		</component-methods>

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
