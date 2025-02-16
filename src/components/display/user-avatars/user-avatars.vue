<template>
	<ul v-if="haveUsers" class="flex items-center gap-1" data-test="user-avatars">
		<li v-for="(user, index) in internalUsers" :key="index" :class="[shapeClasses, overlapClasses]" data-test="user-avatars-user">
			<image-tag v-if="user.hasAvatar" v-bind="{ src: user.avatar, alt: user.tooltip, title: user.tooltip }" class="object-cover" :class="[size, shapeClasses]" data-test="user-avatars-avatar" />
		</li>
	</ul>
</template>

<script setup>
import { computed } from "vue";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";

const props = defineProps({
	/**
	 * The list of users to display. By default, the format of provided users
	 * should include a name, initials, and absolute path to the user's avatar
	 * image.
	 *
	 * Any of the information can be omitted, and the component will do its best
	 * to compensate.
	 *
	 * - If no name is provided, the tooltip will show the initials.
	 * - If no initials are provided, they will be generated from the name.
	 * - If no avatar is provided, the initials will be shown.
	 * - Without a name or initials, no tooltip is included.
	 */
	users: {
		type: Array,
		default: () => [],
	},

	/**
	 * The shape of avatars to display. Available values include "round",
	 * "square", and "squircle". Anything else will default to "round".
	 */
	shape: {
		type: String,
		default: "round",
	},

	/**
	 * The size of the avatars to display, based on Tailwind size classes.
	 */
	size: {
		type: String,
		default: "size-10",
	},

	/**
	 * Whether avatars should overlap. If they do, they're given an outline so
	 * that the images don't clash.
	 *
	 * Overlap is true by default for "circle" avatars, and false by default for
	 * "square" and "squircle", but a value provided here will take precedence.
	 */
	overlap: {
		type: Boolean,
		default: null,
	},
});

// Our filtered avatars, removing anything that isn't a non-empty string.
const internalUsers = computed(() => {
	if (!isNonEmptyArray(props.users)) {
		return [];
	}

	return props.users.reduce((users, user) => {
		if (!isNonEmptyObject(user)) {
			return users;
		}

		const hasAvatar = isNonEmptyString(user.avatar);
		const hasName = isNonEmptyString(user.name);
		const hasInitials = isNonEmptyString(user.initials);

		if (!hasAvatar && !hasName && !hasInitials) {
			return users;
		}

		const internalUser = {
			...user,
			hasAvatar,
		};

		// Set our tooltip, so that users can see who each image represents
		// without relying just on the avatar itself. This is ideally the
		// provided name, but if not and they're available, we use the initials.
		if (!Object.hasOwn(internalUser, "tooltip")) {
			if (hasName) {
				internalUser.tooltip = internalUser.name;
			} else if (hasInitials) {
				internalUser.tooltip = internalUser.initials;
			}
		}

		users.push(internalUser);

		return users;
	}, []);
});

// Whether we have any avatars to display.
const haveUsers = computed(() => isNonEmptyArray(internalUsers.value));

// The classes to apply our selected shape, defaulting to round if we don't
// recognise the shape provided.
const shapeClasses = computed(() => {
	switch (props.shape) {
		case "square":
			return "";
		case "squircle":
			return "rounded-lg";
		default:
			return "rounded-full";
	}
});

// The classes to apply our selected shape, defaulting to round if we don't
// recognise the shape provided.
const overlapClasses = computed(() => {
	if (props.overlap === false || (["square", "squircle"].includes(props.shape) && props.overlap === null)) {
		return null;
	}

	return "-ms-2 outline-3 outline-white";
});
</script>
