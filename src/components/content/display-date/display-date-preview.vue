<template>
	<preview-wrapper>
		<template #title>
			display-date
		</template>

		<preview-section>
			<template #title>
				Default formatting
			</template>

			<template #subtitle>
				<dl class="grid grid-cols-[max-content_1fr] gap-x-4">
					<dt>Date</dt>
					<dd>2025-03-29</dd>
				</dl>
			</template>

			<display-date date="2025-03-29" />
		</preview-section>

		<preview-section>
			<template #title>
				Custom formatting
			</template>

			<template #subtitle>
				<dl class="grid grid-cols-[max-content_1fr] gap-x-4">
					<dt>Date</dt>
					<dd>2025-03-29T13:15:20</dd>
					<dt>Locale</dt>
					<dd>de-DE</dd>
				</dl>
			</template>

			<display-date v-bind="{ date: '2025-03-29T13:15:20', locale: 'de-DE', format }" />
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
const format = {
	year: "numeric",
	day: "2-digit",
	weekday: "long",
	month: "long",
	hour: "numeric",
	dayPeriod: "long",
	minute: "numeric",
};
</script>
