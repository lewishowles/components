<template>
	<preview-wrapper>
		<template #title>
			notification-handler
		</template>

		<preview-section>
			<template #title>
				Basic notifications
			</template>

			<div class="flex justify-end">
				<notification-handler v-bind="{ notifications }" />
			</div>
		</preview-section>

		<preview-section>
			<template #title>
				Component options
			</template>

			<div class="flex justify-end">
				<notification-handler v-bind="{ notifications }" />
			</div>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { nanoid } from "nanoid";

const unreadNotification = {
	id: nanoid(),
	message: "Don't forget to check your tasks for today!",
};

const readNotification = {
	id: nanoid(),
	message: "Your profile has been successfully updated.",
	read: true,
};

const extendedNotification = {
	id: nanoid(),
	title: "System Maintenance",
	message: "Our system will undergo maintenance on March 15th from 2 AM to 5 AM. Please save your work and log out before this time.",
	date: "2025-03-12",
	url: "https://example.com/maintenance-info",
};

const warningNotification = {
	id: nanoid(),
	message: "Your subscription is about to expire in 3 days. Renew now to avoid interruptions.",
	type: "warning",
};

const dangerNotification = {
	id: nanoid(),
	message: "Unauthorised login attempt detected. Please secure your account immediately.",
	type: "danger",
};

const pinnedNotification = {
	id: nanoid(),
	message: "Welcome to our platform! Check out the getting started guide to make the most of your experience.",
	pinned: true,
};

const imageNotification = {
	id: nanoid(),
	message: "Check out our latest product launch! Click to learn more.",
	image_url: "https://placehold.co/100x100",
};

const iconNotification = {
	id: nanoid(),
	message: "You have 5 new messages in your inbox.",
	icon: "icon-envelope",
};

const notifications = [
	readNotification,
	unreadNotification,
	extendedNotification,
	warningNotification,
	dangerNotification,
	pinnedNotification,
	imageNotification,
	iconNotification,
];
</script>
