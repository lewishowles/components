// Metadata for docs and CLI consumers that need to describe or generate pill-badge usage.
export const pillBadgeMetadata = {
	name: "pill-badge",
	category: "messaging",
	summary: "A compact badge for statuses, labels, and small count changes.",
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
			summary: "Colour scheme for the badge.",
		},
		{
			name: "iconStart",
			type: "string",
			default: null,
			summary: "Icon to display before the badge label.",
		},
		{
			name: "iconEnd",
			type: "string",
			default: null,
			summary: "Icon to display after the badge label.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "The visible badge label.",
		},
	],
	parts: [
		{ name: "icon-start", summary: "Icon displayed before the badge content." },
		{ name: "icon-end", summary: "Icon displayed after the badge content." },
	],
	examples: [
		{
			name: "default",
			label: "Default badge",
			summary: "A text badge with a chosen colour.",
			playground: true,
			snippet: {
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
			summary: "A badge with an icon before the label.",
			playground: true,
			snippet: {
				slots: {
					default: {
						label: "Text",
						value: "-8.5%",
					},
				},
				props: {
					colour: {
						label: "Colour",
						value: "red",
						type: "text",
						isInline: true,
					},
					"icon-start": {
						label: "Icon start",
						value: "icon-arrow-down",
						type: "text",
						isInline: true,
					},
				},
			},
		},
		{
			name: "icon-end",
			label: "End icon",
			summary: "A badge with an icon after the label.",
			playground: true,
			snippet: {
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
					"icon-end": {
						label: "End icon",
						value: "icon-arrow-down",
						isInline: true,
					},
				},
			},
		},
	],
};
