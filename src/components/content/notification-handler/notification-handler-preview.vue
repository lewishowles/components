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
	message: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
};

const readNotification = {
	id: nanoid(),
	message: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
	read: true,
};

const extendedNotification = {
	id: nanoid(),
	title: "Notification title",
	message: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
	date: "2025-03-12",
	url: "https://duckduckgo.com",
};

const warningNotification = {
	id: nanoid(),
	message: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
	type: "warning",
};

const dangerNotification = {
	id: nanoid(),
	message: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
	type: "danger",
};

const pinnedNotification = {
	id: nanoid(),
	message: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
	pinned: true,
};

const imageNotification = {
	id: nanoid(),
	message: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
	image_url: "https://placehold.co/100x100",
};

const iconNotification = {
	id: nanoid(),
	message: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
	icon: "icon-film",
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
