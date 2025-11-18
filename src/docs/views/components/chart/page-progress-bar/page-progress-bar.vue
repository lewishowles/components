<template>
	<component-page>
		<template #title>
			Progress bar
		</template>

		<template #introduction>
			<p>Display the progress of an action, with appropriate accessible labelling.</p>
			<p>Currently, progress is assumed to be a percentage, based on the minimum, maximum and current values.</p>
		</template>

		<component-props>
			<component-prop id="prop-value">
				<template #name>
					value
				</template>

				<template #type>
					number
				</template>

				<template #default-value>
					0
				</template>

				<p>The current value represented by the progress bar.</p>
			</component-prop>

			<component-prop id="prop-min">
				<template #name>
					min
				</template>

				<template #type>
					number
				</template>

				<template #default-value>
					0
				</template>

				<p>The minimum value of the progress bar, used to determine how much of the bar is filled based on the current value.</p>
			</component-prop>

			<component-prop id="prop-max">
				<template #name>
					max
				</template>

				<template #type>
					number
				</template>

				<template #default-value>
					100
				</template>

				<p>The maximum value of the progress bar, used to determine how much of the bar is filled based on the current value.</p>
			</component-prop>

			<component-prop id="prop-label">
				<template #name>
					label
				</template>

				<template #type>
					string
				</template>

				<template #default-value>
					Loading…
				</template>

				<p>The label for the progress bar. This label is hidden by default, but is included for accessibility purposes.</p>
			</component-prop>

			<component-prop id="prop-show-label">
				<template #name>
					showLabel
				</template>

				<template #type>
					boolean
				</template>

				<template #default-value>
					false
				</template>

				<p>Whether to show the label to the user.</p>
			</component-prop>

			<component-prop id="prop-show-value">
				<template #name>
					showValue
				</template>

				<template #type>
					boolean
				</template>

				<template #default-value>
					false
				</template>

				<p>Whether to show the value to the user, formatted as a percentage.</p>
			</component-prop>

			<component-prop id="prop-track-classes">
				<template #name>
					trackClasses
				</template>

				<template #type>
					string | array | object
				</template>

				<template #default-value>
					h-4 rounded-full bg-grey-200
				</template>

				<p>Classes to apply to the track, which is the background behind the bar.</p>
			</component-prop>

			<component-prop id="prop-bar-classes">
				<template #name>
					barClasses
				</template>

				<template #type>
					string | array | object
				</template>

				<template #default-value>
					h-full rounded-full bg-purple-700
				</template>

				<p>Classes to apply to the bar, which indicates the current value.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The label for this progress bar. This is also included when the label is hidden for accessibility purposes.</p>
			</component-slot>

			<component-slot id="slot-value">
				<template #name>
					value
				</template>

				<p>When the value is shown, override the default value display.</p>

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
							<td><code>value</code></td>
							<td><code>number</code></td>
							<td>The current value of the progress bar.</td>
						</tr>
					</tbody>
				</table>
			</component-slot>
		</component-slots>

		<component-playgrounds>
			<playground-progress-bar />
			<playground-progress-bar-showing-labels />
			<playground-progress-bar-custom-design />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundProgressBar from "./fragments/playground-progress-bar.vue";
import PlaygroundProgressBarShowingLabels from "./fragments/playground-progress-bar-showing-labels.vue";
import PlaygroundProgressBarCustomDesign from "./fragments/playground-progress-bar-custom-design.vue";
</script>
