<template>
	<component :is="tag" v-if="wrap" v-bind="$attrs">
		<slot />
	</component>
	<template v-else>
		<slot />
	</template>
</template>

<script setup>
/**
 * `conditional-wrapper` is a helper component that makes it easy to optionally
 * wrap one or more elements in a tag. This might be useful, for example, to
 * group items together when there are more than one, but keep a template simple
 * otherwise.
 */
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
