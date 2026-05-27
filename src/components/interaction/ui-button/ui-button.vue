<template>
	<button
		type="button"
		class="inline-flex items-center justify-center"
		:class="{ relative: reactive, 'button--disabled': disabled }"
		v-bind="attributes"
		data-test="ui-button"
		@click="react"
	>
		<component
			:is="iconStart"
			v-if="haveIconStart"
			:class="[computedIconClasses, { 'me-2': !iconOnly }]"
			data-test="ui-button-icon-start"
		/>

		<conditional-wrapper
			v-bind="{ wrap: reactive || iconOnly, tag: 'span' }"
			:class="{ invisible: isReacting, 'sr-only': iconOnly }"
			data-test="ui-button-label"
		>
			<slot />
		</conditional-wrapper>

		<span
			v-if="reactive"
			v-show="isReacting"
			class="absolute inset-0 flex items-center justify-center"
			data-test="ui-button-loading"
		>
			<icon-loading class="animate-spin stroke-current" />
		</span>

		<span v-if="reactive" role="status" class="sr-only" data-test="ui-button-status">
			<template v-if="isReacting">
				<slot name="loading-label"> Loading </slot>
			</template>
		</span>

		<component
			:is="iconEnd"
			v-if="haveIconEnd"
			:class="[computedIconClasses, { 'ms-2': !iconOnly }]"
			data-test="ui-button-icon-end"
		/>
	</button>
</template>

<script setup>
/**
 * Create a multi-purpose button.
 *
 * Optional icons can be added at either end of the button (`iconStart`,
 * `iconEnd`), using any defined icon in the component library.
 *
 * A special `reactive` mode allows for the button to show a loading indicator
 * when activated, which can be reset via an exposed `reset` method.
 */
import { computed, getCurrentInstance, ref } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";

const props = defineProps({
	/**
	 * An icon to display at the start of the button.
	 */
	iconStart: {
		type: String,
		default: null,
	},

	/**
	 * An icon to display at the end of the button.
	 */
	iconEnd: {
		type: String,
		default: null,
	},

	/**
	 * Only display an icon (with "sr-only" text)
	 */
	iconOnly: {
		type: Boolean,
		default: false,
	},

	/**
	 * Whether this button is "reactive", that is, it will show a loading
	 * indicator when activated.
	 */
	reactive: {
		type: Boolean,
		default: false,
	},

	/**
	 * When true, the button detects a Promise returned by the click listener
	 * and automatically enters its loading state, resetting when the Promise
	 * settles. Async functions return a Promise implicitly, so
	 * `@click="asyncFn"` works without any wrapping.
	 */
	loadingAuto: {
		type: Boolean,
		default: true,
	},

	/**
	 * The pressed state of this button, for use as a toggle button. When `true`
	 * or `false`, `aria-pressed` is set accordingly. When `null` (default),
	 * `aria-pressed` is not set and the button behaves as a normal action button.
	 *
	 * This is a controlled prop — the consumer owns the state and passes it in.
	 * That matters because toggle actions are often async (a mute request might
	 * fail), and `aria-pressed` must reflect actual truth, not an optimistic flip.
	 *
	 * The visible label must remain stable across pressed and unpressed states;
	 * `aria-pressed` alone conveys the state change to screen reader users.
	 */
	pressed: {
		type: Boolean,
		default: null,
	},

	/**
	 * Whether this button is disabled. Uses aria-disabled rather than the
	 * native disabled attribute so the button remains in the tab order and
	 * screen reader users can still encounter and understand it.
	 */
	disabled: {
		type: Boolean,
		default: false,
	},

	/**
	 * Any classes to add to the icon itself. If a size class is added
	 * (`size-`), the default size class will not be included.
	 */
	iconClasses: {
		type: [String, Array, Object],
		default: null,
	},
});

const emit = defineEmits(["click"]);
// Whether the button is currently reacting.
const isReacting = ref(false);
// The component instance, captured during setup so it is available in handlers.
const instance = getCurrentInstance();
// Whether a start icon is defined.
const haveIconStart = computed(() => isNonEmptyString(props.iconStart));
// Whether an end icon is defined.
const haveIconEnd = computed(() => isNonEmptyString(props.iconEnd));

// Any additional attributes to apply to the button.
const attributes = computed(() => {
	const attributes = {};

	if (isReacting.value) {
		attributes["aria-busy"] = "true";
	}

	if (props.pressed !== null) {
		attributes["aria-pressed"] = String(props.pressed);
	}

	if (props.disabled) {
		attributes["aria-disabled"] = "true";
	}

	return attributes;
});

// Classes to apply to the icons. For this, we check whether the user has
// provided their own `size-` or `stroke-` classes, and merge those with the
// defaults.
const computedIconClasses = computed(() => {
	if (!haveIconStart.value && !haveIconEnd.value) {
		return null;
	}

	const baseStrokeClass = "stroke-current";
	const baseAlignmentClasses = "inline-block align-[0]";
	const baseSizeClass = props.iconOnly ? "size-[1em]" : "size-[0.857em]";
	const defaultClasses = [baseStrokeClass, baseAlignmentClasses, baseSizeClass];

	if (!isNonEmptyString(props.iconClasses)) {
		return isReacting.value ? [...defaultClasses, "invisible"] : defaultClasses;
	}

	const classes = props.iconClasses.split(" ");

	if (!classes.some((className) => className.includes("stroke-"))) {
		classes.push(baseStrokeClass);
	}

	if (!classes.some((className) => className.includes("size-"))) {
		classes.push(baseSizeClass);
	}

	if (isReacting.value) {
		classes.push("invisible");
	}

	return classes;
});

/**
 * Respond to a button click, showing the loading state if reactive and
 * auto-resetting if loadingAuto detects a Promise returned by the click
 * listener.
 */
function react() {
	if (props.disabled) {
		return;
	}

	displayReactiveState();

	// If we want to automatically reset when the Promise attached to click
	// ends, work through the click handler(s) to see if we can find that
	// promise to watch. If we can't, the user will have to call `reset`
	// manually.
	if (props.loadingAuto) {
		const onClick = instance?.vnode.props?.onClick;
		const handlers = Array.isArray(onClick) ? onClick : [onClick].filter(Boolean);
		const results = handlers.map((handler) => handler());
		const promise = results.find((result) => result instanceof Promise);

		if (promise) {
			// Use .then(reset, reset) rather than .finally(reset) so that
			// rejections are handled here and don't propagate as unhandled.
			promise.then(reset, reset);
		}

		return;
	}

	emit("click");
}

/**
 * Display the button's reactive state, if available.
 */
function displayReactiveState() {
	if (props.reactive) {
		isReacting.value = true;
	}
}

/**
 * Reset the reacting state of the button.
 */
function reset() {
	isReacting.value = false;
}

defineExpose({
	react: displayReactiveState,
	reset,
});
</script>
