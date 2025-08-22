<template>
	<img
		v-if="!haveImageError"
		class="bg-grey-100"
		data-test="image-tag"
		v-bind="{ ...$attrs, src }"
		@error="handleImageError"
	/>

	<slot v-else name="fallback">
		<div class="flex items-center justify-center bg-grey-100 p-3" v-bind="$attrs" data-test="image-tag-fallback">
			<icon-image class="aspect-square h-auto w-8 max-w-full text-grey-500" />
		</div>
	</slot>
</template>

<script setup>
import { ref } from "vue";

defineProps({
	/**
	 * The source of the image.
	 */
	src: {
		type: String,
		required: true,
	},
});

const emit = defineEmits(["error"]);

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
