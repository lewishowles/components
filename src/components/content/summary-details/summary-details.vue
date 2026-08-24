<template>
	<details
		ref="detailsElement"
		v-bind="{ 'data-test': dataTest, 'data-state': isOpen ? 'open' : 'closed' }"
		data-component="summary-details"
		@toggle="updateState"
	>
		<summary
			ref="summaryElement"
			:class="cn('inline-flex cursor-pointer list-none items-center gap-2', summaryClasses)"
			v-bind="{ 'data-test': `${dataTest}-summary` }"
			data-part="summary"
		>
			<component
				:is="currentIconComponent"
				v-if="iconAtStart && includeIcon"
				:class="cn('size-[0.857em]', iconClasses)"
				v-bind="{ 'data-test': `${dataTest}-icon-start` }"
			/>

			<conditional-wrapper v-bind="{ wrap: iconOnly, tag: 'span' }" class="sr-only">
				<slot
					name="summary"
					v-bind="{
						isOpen,
						icon: currentIcon,
						open: openDetails,
						close: closeDetails,
						toggle: toggleDetails,
					}"
				/>
			</conditional-wrapper>

			<component
				:is="currentIconComponent"
				v-if="includeIcon && !iconAtStart"
				:class="cn('size-[0.857em]', iconClasses)"
				v-bind="{ 'data-test': `${dataTest}-icon-end` }"
			/>
		</summary>

		<div
			ref="contentElement"
			:class="cn('mt-3', detailsClasses)"
			v-bind="{
				hidden: isOpen ? undefined : 'until-found',
				role: contentRole,
				'aria-live': contentLive,
				'data-test': `${dataTest}-content`,
			}"
			data-part="content"
		>
			<slot
				v-if="!toggletip || shouldAnnounce"
				v-bind="{
					isOpen,
					icon: currentIcon,
					open: openDetails,
					close: closeDetails,
					toggle: toggleDetails,
				}"
			/>
		</div>
	</details>
</template>

<script setup>
/**
 * Provides an implementation of the `details` element with optional extras,
 * such as custom icons, and allows a simple way of having content that can be
 * toggled. Suitable for items such as FAQs. Use `floating-details` when the
 * toggled content needs to appear as a floating panel, such as a dropdown menu.
 */
import { cn } from "@/utilities/cn.js";
import { computed, nextTick, onMounted, ref, useSlots, useTemplateRef, watch } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";
import { onKeyStroke, useFocusWithin } from "@vueuse/core";
import { resolveIconComponent } from "@/utilities/resolve-icon-component/resolve-icon-component.js";

const props = defineProps({
	/**
	 * Whether the details element should initially be open.
	 */
	open: {
		type: Boolean,
		default: false,
	},

	/**
	 * Whether to close the details element when pressing escape. If focus is
	 * within this component, focus is moved to the summary element.
	 */
	closeWithEscape: {
		type: Boolean,
		default: true,
	},

	/**
	 * The icon to display when the details are open.
	 */
	iconOpen: {
		type: String,
		default: "icon-chevron-up",
	},

	/**
	 * The icon to display when the details are closed.
	 */
	iconClosed: {
		type: String,
		default: "icon-chevron-down",
	},

	/**
	 * An override icon, shown both when details are open and closed.
	 */
	icon: {
		type: String,
		default: null,
	},

	/**
	 * Whether to display the icon at the start of the summary, as opposed to
	 * the end.
	 */
	iconAtStart: {
		type: Boolean,
		default: false,
	},

	/**
	 * Whether to include a summary icon at all. This allows more flexibility
	 * with the styling of the summary, but it is important to make it clear to
	 * the user what is happening.
	 */
	includeIcon: {
		type: Boolean,
		default: true,
	},

	/**
	 * Whether to only include a summary icon, hiding any provided text. When
	 * used, text should still be provided to assist screen reader users.
	 */
	iconOnly: {
		type: Boolean,
		default: false,
	},

	/**
	 * Any classes to add to the summary element, allowing styling to wrap both
	 * the summary and icons.
	 */
	summaryClasses: {
		type: [String, Array, Object],
		default: null,
	},

	/**
	 * Any classes to add to the details content.
	 */
	detailsClasses: {
		type: [String, Array, Object],
		default: null,
	},

	/**
	 * Additional classes to apply to the icon, merged on top of the icon's base
	 * styles. Any provided classes that conflict with base classes will override as necessary.
	 */
	iconClasses: {
		type: [String, Array, Object],
		default: null,
	},

	/**
	 * Whether to focus the first focusable element in the content area when
	 * the details are opened. Useful when the content contains a form or an
	 * action the user is expected to interact with immediately.
	 */
	autofocus: {
		type: Boolean,
		default: false,
	},

	/**
	 * Whether to treat the content as a toggletip, content which is announced
	 * immediately when opened. This is good for information tooltips, for
	 * example.
	 */
	toggletip: {
		type: Boolean,
		default: false,
	},

	/**
	 * The data-test attribute for this element. This allows us to re-use the
	 * provided data-test attribute for sub-components.
	 */
	dataTest: {
		type: String,
		default: "summary-details",
	},
});

const emit = defineEmits(["open", "close"]);

// Whether the details are currently open.
const isOpen = defineModel({
	type: Boolean,
	default: false,
});

// The component's own slots, used to check the summary slot has content.
const slots = useSlots();
// A reference to the details element, from which we can determine the current
// "open" state.
const detailsElement = useTemplateRef("detailsElement");
// A reference to the summary element, with which we can manage focus.
const summaryElement = useTemplateRef("summaryElement");
// A reference to the content div, used to find the first focusable element
// when autofocus is enabled.
const contentElement = useTemplateRef("contentElement");
// Whether focus is currently within our details component. If it isn't, we will
// close our details element, but don't change the user's focus.
const { focused: hasFocus } = useFocusWithin(detailsElement);
// Whether the toggletip slot content should currently be rendered. Briefly set
// to false on each open to clear the live region so repeat opens re-announce.
const shouldAnnounce = ref(true);
// The ARIA role to apply to the content element in toggletip mode.
const contentRole = computed(() => (props.toggletip ? "status" : null));
// The ARIA live region type to apply in toggletip mode.
const contentLive = computed(() => (props.toggletip ? "polite" : null));
// Whether the summary slot has content for the disclosure trigger.
const haveSummary = computed(() => isNonEmptySlot(slots.summary));

// The current icon to display. If an override icon is chosen, we always return
// that, otherwise we return the appropriate icon for the current state.
const currentIcon = computed(() => {
	if (isNonEmptyString(props.icon)) {
		return props.icon;
	}

	if (isOpen.value) {
		return props.iconOpen;
	}

	return props.iconClosed;
});

// The resolved component for the current icon.
const currentIconComponent = computed(() => resolveIconComponent(currentIcon.value));

/**
 * When mounting, sync up our desired initial state with the details element
 * itself.
 */
onMounted(() => {
	isOpen.value = props.open;

	if (import.meta.env.DEV && !haveSummary.value) {
		console.warn(
			"[summary-details] No accessible name found for the trigger. Provide a `summary` slot.",
		);
	}

	if (isOpen.value && detailsElement.value.open === false) {
		detailsElement.value.open = true;
	}

	// When the user finds text within the content via find-in-page (Ctrl+F),
	// the browser fires beforematch on the hidden="until-found" element. Open
	// the details to keep state, content visibility, and the summary icon in
	// sync.
	contentElement.value?.addEventListener("beforematch", () => {
		openDetails();
	});
});

/**
 * When pressing escape, if requested, close the details element. If focus is
 * within the component, move focus to the summary.
 */
onKeyStroke("Escape", (event) => {
	if (!isOpen.value || !props.closeWithEscape) {
		return;
	}

	event.preventDefault();

	if (hasFocus.value) {
		summaryElement.value?.focus();
	}

	closeDetails();
});

/**
 * Update the current open state based on the details element.
 */
function updateState() {
	isOpen.value = detailsElement.value.open;
}

/**
 * Open the details element and update our internal representation.
 */
function openDetails() {
	detailsElement.value.open = true;

	updateState();
}

/**
 * Close the details element and update our internal representation.
 */
function closeDetails() {
	detailsElement.value.open = false;

	updateState();
}

/**
 * Toggle the details element between open and closed.
 */
function toggleDetails() {
	if (isOpen.value) {
		closeDetails();
	} else {
		openDetails();
	}
}

// Emit open/close events, handle toggletip re-announcement, and move focus to
// the first focusable descendant when autofocus is enabled. The watch covers
// both native summary clicks and programmatic openDetails() calls.
watch(isOpen, async () => {
	if (!isOpen.value) {
		emit("close");

		return;
	}

	emit("open");

	if (props.toggletip) {
		// Briefly clear the live region content so that repeated opens
		// re-trigger the announcement even when the text hasn't changed.
		shouldAnnounce.value = false;

		await new Promise((resolve) => setTimeout(resolve, 100));

		shouldAnnounce.value = true;
	}

	if (props.autofocus) {
		await nextTick();

		if (contentElement.value) {
			const focusable = contentElement.value.querySelector(
				":is(button, input, select, textarea):not([disabled]), a[href], [tabindex]:not([tabindex='-1'])",
			);

			focusable?.focus();
		}
	}

	return;
});

defineExpose({
	closeDetails,
	contentElement,
	openDetails,
	summaryElement,
	toggleDetails,
});
</script>
