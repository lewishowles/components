<template>
	<div
		v-if="haveMessages"
		class="flex flex-col gap-2"
		data-component="flash-messages"
		data-test="flash-messages"
	>
		<template v-for="message in messages" :key="message.id">
			<slot v-bind="{ message }">
				<alert-message v-bind="{ ...pick(message, ['type', 'showIcon', 'live', 'titleTag']) }">
					<template #icon>
						<slot name="icon" />
					</template>

					<template #title>
						{{ message.title }}
					</template>

					{{ message.message }}
				</alert-message>
			</slot>
		</template>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { pick } from "@lewishowles/helpers/object";
import { useFlashMessages } from "@/composables";

/**
 * Display one or more flash messages to the user, optionally filtered to the
 * provided `namespace`. If no `namespace` is provided, messages that are
 * generated without a `namespace` will be shown.
 *
 * It may often be useful to include one instance without a namespace at the top
 * of a page for general messages, and other namespaced instances nearer the
 * components that would trigger those messages.
 */
const props = defineProps({
	/**
	 * The namespace from which to retrieve messages. If no namespace is
	 * provided, only messages without a namespace will be displayed.
	 */
	namespace: {
		type: String,
		default: null,
	},
});

const { getMessages } = useFlashMessages();

// The messages to display.
const messages = computed(() => getMessages(props.namespace));
// Whether there are any messages to display.
const haveMessages = computed(() => isNonEmptyArray(messages.value));
</script>
