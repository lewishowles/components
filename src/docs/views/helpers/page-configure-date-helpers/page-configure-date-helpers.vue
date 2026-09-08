<template>
	<component-page>
		<template #title>configureDateHelpers</template>

		<template #introduction>
			<p>
				<code>configureDateHelpers</code>
				sets project-wide defaults for parsing and formatting dates. Configure it once so date
				helpers use the same locale, timezone, input format, default format, and named output
				formats.
			</p>

			<p>
				The built-in named formats are
				<code>date</code>
				,
				<code>dateTime</code>
				, and
				<code>shortDate</code>
				.
				<router-link to="/content/display-date">
					<code>display-date</code>
				</router-link>
				and
				<router-link to="/form/form-date">
					<code>form-date</code>
				</router-link>
				honour this configuration when they use their default formatting.
			</p>
		</template>

		<component-parameters>
			<component-parameter id="parameter-config">
				<template #name>config</template>

				<template #type>object</template>

				<p>The optional date helper defaults to merge into the active configuration.</p>

				<table>
					<caption>Configuration options</caption>
					<thead>
						<tr>
							<th scope="col">Option</th>
							<th scope="col">Type</th>
							<th scope="col">Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>locale</code></td>
							<td><code>string</code></td>
							<td>
								The
								<link-tag
									href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang#language_tag_syntax"
									:external="true"
								>
									BCP 47
								</link-tag>
								locale used by date formatters.
							</td>
						</tr>
						<tr>
							<td><code>timeZone</code></td>
							<td><code>string</code></td>
							<td>
								The timezone used to resolve plain dates and date-times to a specific moment, such
								as
								<code>"Europe/London"</code>
								; see the
								<link-tag
									href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#timezone"
									:external="true"
								>
									<code>timeZone</code>
									option in
									<code>Intl.DateTimeFormat</code>
								</link-tag>
								.
							</td>
						</tr>
						<tr>
							<td><code>inputFormat</code></td>
							<td><code>string</code></td>
							<td>
								The
								<link-tag href="https://day.js.org/docs/en/parse/string-format" :external="true">
									Day.js-style token format
								</link-tag>
								used when parsing non-ISO strings.
							</td>
						</tr>
						<tr>
							<td><code>defaultFormat</code></td>
							<td><code>string</code></td>
							<td>
								A key from
								<code>formats</code>
								, such as
								<code>"date"</code>
								,
								<code>"dateTime"</code>
								, or
								<code>"shortDate"</code>
								, used when a format is not provided.
							</td>
						</tr>
						<tr>
							<td><code>formats</code></td>
							<td><code>Record&lt;string, string | Intl.DateTimeFormatOptions&gt;</code></td>
							<td>
								A map of named output formats. Each value is a Day.js-style token string or an
								<code>Intl.DateTimeFormatOptions</code>
								object.
							</td>
						</tr>
					</tbody>
				</table>

				<p>
					The default
					<code>formats</code>
					map is
					<code>
						{ date: { dateStyle: "medium" }, dateTime: { dateStyle: "medium", timeStyle: "short" },
						shortDate: "DD/MM/YYYY" }
					</code>
					.
				</p>

				<p>
					<code>formats.date</code>
					,
					<code>formats.dateTime</code>
					, and
					<code>formats.shortDate</code>
					follow the same shape as any other entry in
					<code>formats</code>
					: either a Day.js-style token string or an
					<code>Intl.DateTimeFormatOptions</code>
					object. Projects can override these three built-in formats, or add named formats of their
					own.
				</p>
			</component-parameter>
		</component-parameters>

		<component-returns>
			<component-return id="return-config">
				<template #name>config</template>

				<template #type>object</template>

				<p>
					The active date helper configuration, including the merged defaults and named formats.
					Calling
					<code>configureDateHelpers</code>
					without arguments returns the current configuration.
				</p>
			</component-return>
		</component-returns>

		<component-tab v-bind="{ id: 'tab-example', icon: 'icon-code' }">
			<template #title>Example</template>

			<p>Configure the shared date defaults when the application starts:</p>

			<code-block :code="configurationExample" />
		</component-tab>
	</component-page>
</template>

<script setup>
const configurationExample = `import { configureDateHelpers } from "@lewishowles/helpers/date";

configureDateHelpers({
	locale: "en-US",
	timeZone: "America/New_York",
	defaultFormat: "date",
	formats: {
		date: "MM/DD/YYYY",
		dateTime: { dateStyle: "medium", timeStyle: "short" },
	},
});`;
</script>
