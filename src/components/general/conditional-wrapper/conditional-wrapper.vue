<template>
	<component :is="tag" v-if="wrap" v-bind="$attrs">
		<slot />
	</component>
	<template v-else>
		<slot />
	</template>
</template>

<script setup>
defineProps({
	/**
	 * Whether to wrap the contents.
	 */
	wrap: {
		type: Boolean,
		default: true,
	},

	/**
	 * The tag to wrap with, if wrapping is active.
	 */
	tag: {
		type: String,
		default: "div",
	},
});
</script>

<script>
export default {
	inheritAttrs: false,
};
</script>
