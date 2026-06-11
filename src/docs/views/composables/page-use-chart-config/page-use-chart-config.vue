<template>
	<component-page>
		<template #title>useChartConfig</template>

		<template #introduction>
			<p>
				<code>useChartConfig</code>
				extends a list of chart segments with colours from the library's accessible Okabe-Ito
				palette, making them ready for both visual rendering and legend display. Colours are
				assigned by position and wrap when the segment count exceeds the palette size.
			</p>

			<p>
				Pass the result directly to
				<router-link v-bind="{ to: '/chart/donut-chart' }">
					<code>donut-chart</code>
				</router-link>
				,
				<router-link v-bind="{ to: '/chart/chart-legend' }">
					<code>chart-legend</code>
				</router-link>
				, or any custom chart component.
			</p>

			<code-block
				:code="`import { useChartConfig } from &quot;@lewishowles/components/composables&quot;;`"
			/>
		</template>

		<component-returns>
			<component-return id="return-series">
				<template #name>series</template>

				<template #type>ComputedRef&lt;object[]&gt;</template>

				<p>
					The extended series — each entry from the input paired with its chart colour. Each object
					contains
					<code>color</code>
					(a
					<code>var(--color-chart-N)</code>
					CSS variable string),
					<code>label</code>
					, and
					<code>value</code>
					.
				</p>
			</component-return>
		</component-returns>

		<component-methods>
			<component-method id="method-use-chart-config">
				<template #name>
					<code>useChartConfig(segments)</code>
				</template>

				<p>
					Takes a plain array, a ref, or a getter returning an array. Each entry must have
					<code>label</code>
					and
					<code>value</code>
					properties.
				</p>

				<p>
					Any
					<code>--color-chart-N</code>
					token can be overridden in
					<code>:root</code>
					to re-theme charts without touching component code.
				</p>
			</component-method>
		</component-methods>
	</component-page>
</template>
