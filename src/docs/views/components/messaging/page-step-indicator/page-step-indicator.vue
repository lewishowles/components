<template>
	<component-page>
		<template #title>
			Step indicator
		</template>

		<template #introduction>
			<p>Display the user's current progress through a discrete number of steps.</p>
		</template>

		<component-props>
			<component-prop id="prop-current-step">
				<template #name>
					currentStep
				</template>

				<template #type>
					Number
				</template>

				<template #default-value>
					1
				</template>

				<p>The user's current step.</p>
			</component-prop>

			<component-prop id="prop-step-count">
				<template #name>
					stepCount
				</template>

				<template #type>
					Number
				</template>

				<p>The number of steps that the user can expect in this workflow.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The name of the current step.</p>
			</component-slot>

			<component-slot id="slot-current-step">
				<template #name>
					current-step
				</template>

				<template #default-value>
					<span v-pre>Step {{ currentStep }} of {{ stepCount }}</span>
				</template>

				<p>The indicator for the current step.</p>
			</component-slot>
		</component-slots>

		<component-playgrounds>
			<playground-step-indicator />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundStepIndicator from "./fragments/playground-step-indicator.vue";
</script>
