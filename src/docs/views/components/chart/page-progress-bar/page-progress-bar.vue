<template>
	<component-page>
		<template #title> Progress bar </template>

		<template #introduction>
			<p>
				Display the progress of an action. Progress is calculated as a percentage based on the
				current, minimum, and maximum values. Pass <code>current: null</code> for an indeterminate
				state when the quantity is unknown.
			</p>
		</template>

		<component-props>
			<component-prop id="prop-current">
				<template #name> current </template>

				<template #type> number | null </template>

				<template #default-value> 0 </template>

				<p>
					The current value represented by the progress bar. Pass <code>null</code> to render an
					indeterminate bar.
				</p>
			</component-prop>

			<component-prop id="prop-min">
				<template #name> min </template>

				<template #type> number </template>

				<template #default-value> 0 </template>

				<p>
					The minimum value of the progress bar, used to determine how much of the bar is filled
					based on the current value.
				</p>
			</component-prop>

			<component-prop id="prop-max">
				<template #name> max </template>

				<template #type> number </template>

				<template #default-value> 100 </template>

				<p>
					The maximum value of the progress bar, used to determine how much of the bar is filled
					based on the current value.
				</p>
			</component-prop>

			<component-prop id="prop-variant">
				<template #name> variant </template>

				<template #type> "progress" | "meter" </template>

				<template #default-value> progress </template>

				<p>
					The kind of progress bar. Use <code>&quot;progress&quot;</code> for tasks with a known
					endpoint (e.g. file upload or a multi-step wizard). Use <code>&quot;meter&quot;</code> for
					measurements within a fixed range (e.g. disk usage or battery level).
				</p>
			</component-prop>

			<component-prop id="prop-get-value-label">
				<template #name> getValueLabel </template>

				<template #type> (value: number) => string </template>

				<template #default-value> null </template>

				<p>
					A function that receives the current value and returns a custom string for
					<code>aria-valuetext</code>. Use this in situations where providing a human-friendly
					description instead of the default percentage makes more sense, for example,
					<code>&quot;3 of 10 files uploaded&quot;</code>. Only called when the bar is not
					indeterminate.
				</p>
			</component-prop>

			<component-prop id="prop-show-label">
				<template #name> showLabel </template>

				<template #type> boolean </template>

				<template #default-value> false </template>

				<p>Whether to show the label to the user.</p>
			</component-prop>

			<component-prop id="prop-show-value">
				<template #name> showValue </template>

				<template #type> boolean </template>

				<template #default-value> false </template>

				<p>Whether to show the value to the user, formatted as a percentage.</p>
			</component-prop>

			<component-prop id="prop-track-classes">
				<template #name> trackClasses </template>

				<template #type> Vue class binding </template>

				<template #default-value> h-4 rounded-full bg-grey-200 </template>

				<p>Classes to apply to the track, which is the background behind the bar.</p>
			</component-prop>

			<component-prop id="prop-bar-classes">
				<template #name> barClasses </template>

				<template #type> Vue class binding </template>

				<template #default-value> h-full rounded-full bg-purple-700 </template>

				<p>Classes to apply to the bar, which indicates the current value.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name> default </template>

				<p>
					The label for this progress bar. This is also included when the label is hidden for
					accessibility purposes.
				</p>
			</component-slot>

			<component-slot id="slot-value">
				<template #name> value </template>

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
							<td><code>current</code></td>
							<td><code>number | null</code></td>
							<td>The current value of the progress bar.</td>
						</tr>
						<tr>
							<td><code>percentage</code></td>
							<td><code>number</code></td>
							<td>The calculated percentage (0–100).</td>
						</tr>
					</tbody>
				</table>
			</component-slot>
		</component-slots>

		<component-playgrounds>
			<playground-progress-bar />
			<playground-progress-bar-showing-labels />
			<playground-progress-bar-meter />
			<playground-progress-bar-indeterminate />
			<playground-progress-bar-custom-design />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundProgressBar from "./fragments/playground-progress-bar.vue";
import PlaygroundProgressBarCustomDesign from "./fragments/playground-progress-bar-custom-design.vue";
import PlaygroundProgressBarIndeterminate from "./fragments/playground-progress-bar-indeterminate.vue";
import PlaygroundProgressBarMeter from "./fragments/playground-progress-bar-meter.vue";
import PlaygroundProgressBarShowingLabels from "./fragments/playground-progress-bar-showing-labels.vue";
</script>
