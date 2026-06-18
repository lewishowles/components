<template>
	<notification-base v-bind="$attrs" @notification:read="onRead">
		<template v-if="$slots['mark-read-label']" #mark-read-label>
			<slot name="mark-read-label" />
		</template>
		<template v-if="$slots['view-more-label']" #view-more-label>
			<slot name="view-more-label" />
		</template>
	</notification-base>

	<div data-test="notification-base-emitted-read" :data-notification-id="emittedId ?? ''" />
</template>

<script setup>
import NotificationBase from "./fragments/notification-base/notification-base.vue";
import { ref } from "vue";

defineOptions({ inheritAttrs: false });

// The ID emitted by the last notification:read event, exposed for test assertions.
const emittedId = ref(null);

function onRead(id) {
	emittedId.value = id;
}
</script>
