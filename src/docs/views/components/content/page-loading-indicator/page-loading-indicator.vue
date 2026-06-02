<template>
	<component-page>
		<template #title> Loading indicator </template>

		<template #introduction>
			<p>
				<code>loading-indicator</code> provides a consistent loading notice and animation when data
				is pending.
			</p>
		</template>

		<component-props>
			<component-prop id="prop-large">
				<template #name> large </template>

				<template #type> Boolean </template>

				<template #default-value> false </template>

				<p>Whether to display a larger, vertical version of the indicator.</p>
			</component-prop>

			<component-prop id="prop-spinner-classes">
				<template #name> spinnerClasses </template>

				<template #type> Vue class binding </template>

				<template #default-value> null </template>

				<p>
					Additional classes to apply to the spinner, merged on top of any size set by
					<code>large</code>. Any provided classes that conflict with base classes will override as
					necessary.
				</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name> default </template>

				<p>The default slot contains the text to display beside the loading indicator.</p>
				<p>
					<em
						>Note that no default text is provided by design. Using a specific message related to
						what is loaded is strongly encouraged.</em
					>
				</p>
			</component-slot>
		</component-slots>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="loading-indicator"</template>

				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-large">
				<template #attribute>data-large</template>

				<p>Present when the <code>large</code> prop is set.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-loading-indicator />
			<playground-loading-indicator-large />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundLoadingIndicator from "./fragments/playground-loading-indicator.vue";
import PlaygroundLoadingIndicatorLarge from "./fragments/playground-loading-indicator-large.vue";
</script>
