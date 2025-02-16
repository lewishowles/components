<template>
	<preview-wrapper>
		<template #title>
			user-avatars
		</template>

		<preview-section>
			<template #title>
				Default view
			</template>

			<preview-label>
				Where provided avatars are square
			</preview-label>

			<user-avatars v-bind="{ users: generateUsers(5) }" />

			<preview-label>
				Where provided avatars are portrait
			</preview-label>

			<user-avatars v-bind="{ users: generatePortraitUsers(5) }" />
		</preview-section>

		<preview-section>
			<template #title>
				Shapes
			</template>

			<preview-label>
				Round
			</preview-label>

			<user-avatars v-bind="{ users: generateUsers(5), shape: 'round' }" />

			<preview-label>
				Square
			</preview-label>

			<user-avatars v-bind="{ users: generateUsers(5), shape: 'square' }" />

			<preview-label>
				Squircle
			</preview-label>

			<user-avatars v-bind="{ users: generateUsers(5), shape: 'squircle' }" />
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
/**
 * Generate a number of random users.
 *
 * @param  {number}  count
 *     The number of users to generate.
 */
function generateUsers(count) {
	const users = [];

	const names = [
		{ name: "Mickey Mouse", initials: "MM" },
		{ name: "Donald Duck", initials: "DD" },
		{ name: "Goofy", initials: "G" },
		{ name: "Buzz Lightyear", initials: "BL" },
		{ name: "Woody", initials: "W" },
		{ name: "Simba", initials: "S" },
		{ name: "Nemo", initials: "N" },
		{ name: "Dory", initials: "D" },
		{ name: "Mike Wazowski", initials: "MW" },
		{ name: "Sulley", initials: "S" },
		{ name: "Lightning McQueen", initials: "LM" },
		{ name: "Mater", initials: "M" },
	];

	for (let i = 0; i < count; i++) {
		const avatarSize = 100 + i;
		const randomIndex = Math.floor(Math.random() * names.length);
		const { name, initials } = names.splice(randomIndex, 1)[0];

		const user = {
			name,
			initials,
			avatar: `https://placecats.com/${avatarSize}/${avatarSize}`,
		};

		users.push(user);
	}

	return users;
}

/**
 * Generate a number of users with portrait images, to demonstrate object-fit.
 *
 * @param  {number}  count
 *     The number of users to generate.
 */
function generatePortraitUsers(count) {
	const users = generateUsers(count);

	users.forEach((user, index) => {
		const width = 100 + index;
		const height = 140 + index;

		user.avatar = `https://placecats.com/${width}/${height}`;
	});

	return users;
}
</script>
