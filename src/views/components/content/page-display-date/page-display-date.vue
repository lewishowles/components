<template>
	<component-page>
		<template #title>
			Display date
		</template>

		<template #introduction>
			<p>
				<code>display-date</code> displays a given ISO-formatted date in a human-readable form. The component makes use of the
				<link-tag href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDateTime" :external="true">
					Temporal API's PlainDateTime
				</link-tag>
				to parse a date, and either formats the date to the user's current locale by default, or provides options for customising the format of the date using the options provided by
				<link-tag href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDateTime/toLocaleString#options" :external="true">
					<code>toLocaleString</code>'s options
				</link-tag>.
			</p>

			<p><strong>Note</strong> if the provided date contains <code>[</code> to indicate a time zone component, we use <code>ZonedDateTime</code>. If it does not, but contains <code>T</code> for a time component, we use a <code>PlainDateTime</code>, otherwise a <code>PlainDate</code> is used. Note that these different options produce different outputs via <code>toLocaleString</code> by default.</p>
		</template>

		<component-props>
			<component-prop id="prop-date">
				<template #name>
					date
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>
					The date to be converted and displayed. This should be in a format that can be parsed by the
					<link-tag href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDateTime" :external="true">
						Temporal API's PlainDateTime
					</link-tag>.
				</p>
			</component-prop>

			<component-prop id="prop-locale">
				<template #name>
					locale
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					undefined
				</template>

				<p>The locale to use when formatting dates. By default, the user's locale is used.</p>
			</component-prop>

			<component-prop id="prop-format">
				<template #name>
					format
				</template>

				<template #type>
					Object
				</template>

				<template #default-value>
					null
				</template>

				<p>
					The formatting options to apply to the displayed date, as defined by
					<link-tag href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options" :external="true">
						Intl.DateTimeFormat
					</link-tag>.
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
