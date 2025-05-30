<template>
	<component-page>
		<template #title>
			Form date
		</template>

		<template #introduction>
			<p><code>form-date</code> is a date component that aims to remove any confusion when it comes to dates by providing three separate, labelled inputs.</p>
			<p>At this time, the component doesn't include a calendar component, which should only really be used when the user needs to select a date in the recent past or near future.</p>
			<p><code>form-date</code> models its date as <code>{ day, month, year }</code>, allowing any further manipulation to be done easily.</p>
		</template>

		<component-props>
			<component-prop id="prop-id">
				<template #name>
					id
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>Any ID to use as a basis for this field. If an ID is not provided, one will be generated at random. IDs provided will be suffixed with <code>day</code>, <code>month</code> and <code>year</code> as appropriate to differentiate the fields.</p>
				<p>Note that when providing an ID, please make sure that it is unique to avoid any unforeseen issues.</p>
			</component-prop>
			<component-prop id="prop-day-placeholder">
				<template #name>
					dayPlaceholder
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>Any placeholder to show in the &quot;Day&quot; field. Do not use a placeholder for critical information. Always use the label and help text as priorities.</p>
			</component-prop>
			<component-prop id="prop-month-placeholder">
				<template #name>
					monthPlaceholder
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>Any placeholder to show in the &quot;Month&quot; field. Do not use a placeholder for critical information. Always use the label and help text as priorities.</p>
			</component-prop>
			<component-prop id="prop-year-placeholder">
				<template #name>
					yearPlaceholder
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>Any placeholder to show in the &quot;Year&quot; field. Do not use a placeholder for critical information. Always use the label and help text as priorities.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The default slot contains the label of the field.</p>
				<p><em>Note that a label is always required, even if a label is not shown to the user, as it will be critical for screen readers. This component will show an error if no label is provided.</em></p>
			</component-slot>
			<component-slot id="slot-introduction">
				<template #name>
					introduction
				</template>

				<p>Any additional text to introduce this field, which appears between the label and the inputs.</p>
			</component-slot>
			<component-slot id="slot-day-label">
				<template #name>
					day-label
				</template>

				<p>The label for the "Day" field.</p>
			</component-slot>
			<component-slot id="slot-month-label">
				<template #name>
					month-label
				</template>

				<p>The label for the "Month" field.</p>
			</component-slot>
			<component-slot id="slot-year-label">
				<template #name>
					year-label
				</template>

				<p>The label for the "Year" field.</p>
			</component-slot>
			<component-slot id="slot-error">
				<template #name>
					error
				</template>

				<p>Any error text to display below the field.</p>
			</component-slot>
			<component-slot id="slot-help">
				<template #name>
					help
				</template>

				<p>Any help text to display below the field.</p>
			</component-slot>
		</component-slots>

		<component-events>
			<component-event id="event-v-model">
				<template #name>
					v-model
				</template>

				<p>The current value of the field will be available via <code>v-model</code>.</p>
			</component-event>
		</component-events>

		<component-methods>
			<component-method id="method-to-string">
				<template #name>
					<code>toString</code>
				</template>

				<p>
					Retrieve a pre-formatted string representation of the current (date only) in
					<link-tag href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDate#rfc_9557_format" :external="true">
						RFC 9557 format
					</link-tag>.
				</p>
			</component-method>
			<component-method id="method-set-date-from-iso-string">
				<template #name>
					<code>setDateFromIsoString(string)</code>
				</template>

				<p>Set the current <code>day</code>, <code>month</code>, and <code>year</code>, as parsed from an <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDate#rfc_9557_format">RFC 9557 format</a> date string.</p>

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
							<td><code>dateString</code></td>
							<td><code>string</code></td>
							<td>The date string to parse</td>
						</tr>
					</tbody>
				</table>
			</component-method>
			<component-method id="method-trigger-focus">
				<template #name>
					<code>triggerFocus</code>
				</template>

				<p>Focus the "day" input of this field.</p>
			</component-method>
		</component-methods>

		<component-playgrounds>
			<playground-form-date />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFormDate from "./fragments/playground-form-date.vue";
</script>
