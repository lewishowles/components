// Metadata for docs and CLI consumers that need to describe or generate user-avatars usage.
export const userAvatarsMetadata = {
	name: "user-avatars",
	category: "display",
	summary: "A compact avatar list with initials fallback and overflow count.",
	props: [
		{
			name: "users",
			type: "array",
			default: [],
			summary: "Users to display, with optional name, initials, and avatar fields.",
		},
		{
			name: "limit",
			type: "number | null",
			default: null,
			summary: "Maximum number of avatars to show before an overflow item.",
		},
		{
			name: "shape",
			type: "string",
			default: "round",
			values: ["round", "square", "squircle", "roundangle"],
			summary: "Avatar shape.",
		},
		{
			name: "size",
			type: "string",
			default: "size-10",
			summary: "Tailwind size classes for each avatar.",
		},
		{
			name: "overlap",
			type: "boolean | null",
			default: null,
			summary: "Whether avatars should visually overlap.",
		},
		{
			name: "initialsColourClasses",
			type: "string | array | object",
			default: "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200",
			summary: "Classes applied to initials fallback avatars.",
		},
		{
			name: "initialsOutlineClasses",
			type: "string | array | object",
			default: "outline-white dark:outline-primary-200",
			summary: "Outline classes applied to overlapping initials avatars.",
		},
	],
	parts: [
		{ name: "overflow", summary: "Avatar shown when there are more users than the display limit." },
	],
	examples: [],
};
