// Metadata for docs and CLI consumers that need to describe or generate pill-badge usage.
export const pillBadgeMetadata = {
	name: "pill-badge",
	category: "messaging",
	description: "A compact badge for statuses, labels, and small count changes.",
	props: [
		{
			name: "colour",
			type: "string",
			default: "grey",
			values: [
				"grey",
				"danger",
				"red",
				"orange",
				"warning",
				"yellow",
				"success",
				"green",
				"teal",
				"info",
				"blue",
				"indigo",
				"primary",
				"pink",
				"purple",
			],
			description: "Colour scheme for the badge.",
		},
		{
			name: "iconStart",
			type: "string",
			default: null,
			description: "Icon to display before the badge label.",
		},
		{
			name: "iconEnd",
			type: "string",
			default: null,
			description: "Icon to display after the badge label.",
		},
	],
	slots: [
		{
			name: "default",
			description: "The visible badge label.",
		},
	],
	snippetQuestions: [
		{
			name: "variant",
			label: "Badge shape",
			type: "select",
			options: ["default", "icon-start", "icon-end"],
		},
		{
			name: "colour",
			label: "Colour",
			type: "select",
			options: [
				"grey",
				"danger",
				"red",
				"orange",
				"warning",
				"yellow",
				"success",
				"green",
				"teal",
				"info",
				"blue",
				"indigo",
				"primary",
				"pink",
				"purple",
			],
		},
	],
	snippetVariants: [
		{
			name: "default",
			label: "Default badge",
			description: "A text badge with a chosen colour.",
			template: {
				slots: {
					default: {
						label: "Text",
						value: "Active",
					},
				},
				props: {
					colour: {
						label: "Colour",
						value: "green",
						type: "text",
						isInline: true,
					},
				},
			},
		},
		{
			name: "icon-start",
			label: "Start icon",
			description: "A badge with an icon before the label.",
			template: {
				slots: {
					default: {
						label: "Text",
						value: "Increased",
					},
				},
				props: {
					colour: {
						label: "Colour",
						value: "green",
						type: "text",
						isInline: true,
					},
					iconStart: {
						label: "Start icon",
						value: "icon-arrow-up",
					},
				},
			},
		},
		{
			name: "icon-end",
			label: "End icon",
			description: "A badge with an icon after the label.",
			template: {
				slots: {
					default: {
						label: "Text",
						value: "Decreased",
					},
				},
				props: {
					colour: {
						label: "Colour",
						value: "red",
						type: "text",
						isInline: true,
					},
					iconEnd: {
						label: "End icon",
						value: "icon-arrow-down",
					},
				},
			},
		},
	],
};
