<template>
	<img
		v-if="haveImageSrc && !haveImageError"
		class="bg-surface-sunken"
		data-component="image-tag"
		data-test="image-tag"
		v-bind="{ ...$attrs, src }"
		@error="handleImageError"
	/>

	<slot v-else name="fallback">
		<div
			class="bg-surface-sunken flex items-center justify-center p-3"
			v-bind="$attrs"
			data-component="image-tag"
			data-part="fallback"
			data-test="image-tag-fallback"
		>
			<icon-image class="text-content-muted aspect-square h-auto w-8 max-w-full" />
		</div>
	</slot>
</template>

<script setup>
import { computed, ref } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";

const props = defineProps({
	/**
	 * The source of the image.
	 */
	src: {
		type: String,
		default: null,
	},
});

const emit = defineEmits(["error"]);
// Whether an image src has been provided.
const haveImageSrc = computed(() => isNonEmptyString(props.src));
// Whether the image has encountered an error.
const haveImageError = ref(false);

/**
 * When we receive an error from an image, use it to display a fallback.
 */
function handleImageError() {
	haveImageError.value = true;

	emit("error");
}
</script>

<script>
export default {
	inheritAttrs: false,
};
</script>
