<template>
	<ul v-if="haveUsers" class="flex items-center gap-1" :class="{ 'ms-2': shouldOverlap }" data-test="user-avatars">
		<li v-for="(user, userIndex) in internalUsers" :key="userIndex" :class="[shapeClasses, overlapClasses]" data-test="user-avatars-user">
			<image-tag
				v-if="user.showAvatar"
				v-bind="{ src: user.avatar, alt: user.tooltip, title: user.tooltip }"
				class="object-cover"
				:class="[size, shapeClasses]"
				data-test="user-avatars-avatar"
				@error="handleImageError(user.avatar)"
			/>

			<div v-else-if="user.hasInitials" v-bind="{ title: user.tooltip }" class="flex items-center justify-center text-sm font-bold" :class="[size, shapeClasses, initialColourClasses]">
				{{ user.initials }}
			</div>
		</li>
	</ul>
</template>

<script setup>
import { computed, ref } from "vue";
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
	 * "square", and "squircle" (or "roundangle"). Anything else will default to
	 * "round".
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

	/**
	 * The colour classes to apply when displaying initials.
	 */
	initialColourClasses: {
		type: String,
		default: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
	},

	/**
	 * The colour classes to apply for the initial outline.
	 */
	initialOutlineClasses: {
		type: String,
		default: "outline-white dark:outline-purple-200",
	},
});

// Our filtered avatars, removing anything that isn't a non-empty string.
const internalUsers = computed(() => {
	if (!isNonEmptyArray(props.users)) {
		return [];
	}

	return props.users.reduce((users, user) => {
		const internalUser = standardiseUser(user);

		if (internalUser) {
			internalUser.showAvatar = internalUser.hasAvatar && !failedAvatars.value.includes(user.avatar);

			users.push(internalUser);
		}

		return users;
	}, []);
});

// Whether we have any avatars to display.
const haveUsers = computed(() => isNonEmptyArray(internalUsers.value));
// Whether the avatars should overlap.
const shouldOverlap = computed(() => props.overlap === true || (!["square", "squircle"].includes(props.shape) && props.overlap === null));

// The classes to apply our selected shape, defaulting to round if we don't
// recognise the shape provided.
const shapeClasses = computed(() => {
	switch (props.shape) {
		case "square":
			return "";
		case "squircle":
		case "roundangle":
			return "rounded-lg";
		default:
			return "rounded-full";
	}
});

// The classes to apply our selected shape, defaulting to round if we don't
// recognise the shape provided.
const overlapClasses = computed(() => {
	if (!shouldOverlap.value) {
		return null;
	}

	const baseClasses = "-ms-2 outline-3";

	if (!isNonEmptyString(props.initialOutlineClasses)) {
		return baseClasses;
	}

	return `${baseClasses} ${props.initialOutlineClasses}`;
});

// Any avatar URLs that have failed to load.
const failedAvatars = ref([]);

/**
 * Standardise a user's details.
 * - Determine if an avatar has been provided
 * - Add initials if necessary and a name is provided
 * - Add a tooltip if necessary
 */
function standardiseUser(user) {
	if (!isNonEmptyObject(user)) {
		return null;
	}

	const hasAvatar = isNonEmptyString(user.avatar);
	const hasName = isNonEmptyString(user.name);
	const hasInitials = isNonEmptyString(user.initials);

	if (!hasAvatar && !hasName && !hasInitials) {
		return null;
	}

	const internalUser = {
		...user,
		hasAvatar,
	};

	if (hasName && !hasInitials) {
		internalUser.initials = user.name.split(" ").map(word => word[0]).join("").toUpperCase();
	}

	// Set our tooltip, so that users can see who each image represents
	// without relying just on the avatar itself. This is ideally the
	// provided name, but if not and they're available, we use the initials.
	if (!Object.hasOwn(internalUser, "tooltip")) {
		if (hasName) {
			internalUser.tooltip = internalUser.name;
		} else if (hasInitials) {
			// We don't need to worry about re-checking whether initials were
			// added here, because we only reach this if no name is provided, in
			// which case there was nothing from which to generate initials.
			internalUser.tooltip = internalUser.initials;
		}
	}

	// Re-determine whether we have initials so we know whether we can fall back
	// if no avatar is provided.
	internalUser.hasInitials = isNonEmptyString(internalUser.initials);

	return internalUser;
}

/**
 * Mark the given avatar URL as having failed, which we can cross-reference
 * later. We use the URL of the avatar since that's what failed, and it allows
 * us update multiple users on the off chance they share an avatar.
 *
 * @param  {string}  avatarUrl
 *     The URL of the avatar to check.
 */
function handleImageError(avatarUrl) {
	failedAvatars.value.push(avatarUrl);
}
</script>
