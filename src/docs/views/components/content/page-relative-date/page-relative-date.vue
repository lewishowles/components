<template>
	<component-page>
		<template #title> Relative date </template>

		<template #introduction>
			<p>
				<code>relative-date</code> displays a date relative to another date, such as
				<code>30 seconds ago</code>, <code>2 minutes ago</code>, or <code>1 day ago</code>.
			</p>

			<p>
				Relative values round up through seconds, minutes, and hours. Day values do not round from
				<code>1 day ago</code> to <code>2 days ago</code> until a full 48 hours has elapsed.
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
					The date to describe. Supports epoch millisecond timestamps, Date objects, Temporal date
					objects, or string dates in RFC 9557 format.
				</p>
			</component-prop>

			<component-prop id="prop-relative-to">
				<template #name> relativeTo </template>

				<template #type>
					String | Number | Date | Temporal.PlainDate | Temporal.PlainDateTime |
					Temporal.ZonedDateTime | Temporal.Instant
				</template>

				<template #default-value> null </template>

				<p>The date to compare against. By default, the current time is used.</p>
			</component-prop>

			<component-prop id="prop-locale">
				<template #name> locale </template>

				<template #type> String </template>

				<template #default-value> undefined </template>

				<p>
					The locale to use when formatting the relative date. By default, the user's locale is
					used.
				</p>
			</component-prop>

			<component-prop id="prop-refresh-interval">
				<template #name> refreshInterval </template>

				<template #type> Number </template>

				<template #default-value> 1000 </template>

				<p>
					How often to refresh the relative date when comparing against the current time. Set to
					<code>0</code> to disable automatic refreshing.
				</p>
			</component-prop>
		</component-props>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="relative-date"</template>

				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-relative-date />
			<playground-relative-date-locale />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundRelativeDate from "./fragments/playground-relative-date.vue";
import PlaygroundRelativeDateLocale from "./fragments/playground-relative-date-locale.vue";
</script>
