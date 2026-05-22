<template>
	<component-page>
		<template #title> Display date </template>

		<template #introduction>
			<p>
				<code>display-date</code> displays a given date in a human-readable form. The component
				accepts strings, epoch millisecond timestamps, Date instances, and Temporal date objects,
				then formats the date to the user's current locale by default. Custom formatting can be
				provided using

				<link-tag
					href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDateTime/toLocaleString#options"
					:external="true"
				>
					the options provided by <code>toLocaleString</code>
				</link-tag>
			</p>

			<p>
				<strong>Note</strong> string dates are parsed into the closest Temporal type. A string
				containing <code>[</code> is treated as a <code>ZonedDateTime</code>; an instant string
				ending in <code>Z</code> or an offset such as <code>+01:00</code> is converted to a local
				<code>PlainDateTime</code>; a string containing <code>T</code> is treated as a
				<code>PlainDateTime</code>; otherwise a <code>PlainDate</code> is used. Timestamps, Date
				instances, and Temporal instants are also converted to local <code>PlainDateTime</code>
				values.
			</p>
		</template>

		<component-props>
			<component-prop id="prop-date">
				<template #name> date </template>

				<template #type>
					String | Number | Date | Temporal.PlainDate | Temporal.PlainDateTime |
					Temporal.ZonedDateTime | Temporal.Instant
				</template>

				<template #default-value> null </template>

				<p>
					The date to convert and display. Supports epoch millisecond timestamps, Date objects,
					Temporal date objects, or string dates in
					<link-tag
						href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDateTime#rfc_9557_format"
						:external="true"
					>
						RFC 9557 format
					</link-tag>
				</p>
			</component-prop>

			<component-prop id="prop-locale">
				<template #name> locale </template>

				<template #type> String </template>

				<template #default-value> undefined </template>

				<p>The locale to use when formatting dates. By default, the user's locale is used.</p>
			</component-prop>

			<component-prop id="prop-format">
				<template #name> format </template>

				<template #type> Object </template>

				<template #default-value> undefined </template>

				<p>
					The formatting options to apply to the displayed date, as defined by
					<link-tag
						href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options"
						:external="true"
					>
						Intl.DateTimeFormat
					</link-tag>
				</p>
			</component-prop>
		</component-props>

		<component-playgrounds>
			<playground-display-date />
			<playground-display-date-locale />
			<playground-display-date-format />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundDisplayDate from "./fragments/playground-display-date.vue";
import PlaygroundDisplayDateLocale from "./fragments/playground-display-date-locale.vue";
import PlaygroundDisplayDateFormat from "./fragments/playground-display-date-format.vue";
</script>
