// Metadata for docs and CLI consumers that need to describe or generate ui-button usage.
export const uiButtonMetadata = {
	name: "ui-button",
	category: "interaction",
	summary: "A multi-purpose button with optional icons, toggle state, and reactive loading.",
	props: [
		{
			name: "iconStart",
			type: "string",
			default: null,
			summary: "Icon to display before the button label.",
		},
		{
			name: "iconEnd",
			type: "string",
			default: null,
			summary: "Icon to display after the button label.",
		},
		{
			name: "iconOnly",
			type: "boolean",
			default: false,
			summary: "Visually hide the label while keeping it available to screen readers.",
		},
		{
			name: "reactive",
			type: "boolean",
			default: false,
			summary: "Show a loading indicator when the button is activated.",
		},
		{
			name: "loadingAuto",
			type: "boolean",
			default: true,
			summary: "Automatically reset the loading state when a returned Promise settles.",
		},
		{
			name: "pressed",
			type: "boolean | null",
			default: null,
			summary: "Controlled pressed state for toggle buttons.",
		},
		{
			name: "disabled",
			type: "boolean",
			default: false,
			summary: "Mark the button unavailable while keeping it focusable.",
		},
		{
			name: "iconClasses",
			type: "Vue class binding",
			default: null,
			summary: "Classes to merge onto any rendered icon.",
		},
	],
	slots: [
		{
			name: "default",
			summary: "The visible button label.",
		},
		{
			name: "loading-label",
			summary: "Screen-reader text announced while the button is loading.",
			default: "Loading",
		},
	],
	events: [
		{
			name: "click",
			summary: "Emitted when the button is clicked or activated with the keyboard.",
		},
	],
	methods: [
		{
			name: "react",
			summary: "Show the reactive loading state.",
		},
		{
			name: "reset",
			summary: "Reset the reactive loading state.",
		},
	],
	examples: [
		{
			name: "default",
			label: "Default button",
			summary: "A standard action button.",
			playground: true,
			snippet: {
				slots: {
					default: {
						label: "Button label",
						value: "Create account",
					},
				},
				props: {
					class: {
						label: "Button classes",
						value: "button--primary",
						isInline: true,
					},
				},
				events: {
					click: {
						label: "Click handler",
						value: "createAccount",
					},
				},
			},
		},
		{
			name: "icon-start",
			label: "Start icon",
			summary: "A button with an icon before the label.",
			snippet: {
				slots: {
					default: {
						label: "Button label",
						value: "Reload",
					},
				},
				props: {
					"icon-start": {
						label: "Start icon",
						value: "icon-reload",
						isInline: true,
					},
				},
				events: {
					click: {
						label: "Click handler",
						value: "reload",
					},
				},
			},
		},
		{
			name: "icon-end",
			label: "End icon",
			summary: "A button with an icon after the label.",
			snippet: {
				slots: {
					default: {
						label: "Button label",
						value: "Next step",
					},
				},
				props: {
					"icon-end": {
						label: "End icon",
						value: "icon-arrow-right",
						isInline: true,
					},
				},
				events: {
					click: {
						label: "Click handler",
						value: "continueToNextStep",
					},
				},
			},
		},
		{
			name: "icon",
			label: "Icon button",
			summary: "A primary button with an icon before the label.",
			playground: true,
			snippet: {
				slots: {
					default: {
						label: "Button label",
						value: "Create account",
					},
				},
				props: {
					"icon-start": {
						label: "Prefix icon",
						value: "icon-user",
						isInline: true,
					},
					class: {
						label: "Button classes",
						value: "button--primary",
						isInline: true,
					},
				},
				events: {
					click: {
						label: "Click handler",
						value: "createAccount",
					},
				},
			},
		},
		{
			name: "icon-only",
			label: "Icon-only button",
			summary: "A primary button that shows only an icon while keeping accessible text.",
			playground: true,
			snippet: {
				slots: {
					default: {
						label: "Button label",
						value: "Create account",
					},
				},
				props: {
					"icon-start": {
						label: "Prefix icon",
						value: "icon-user",
						isInline: true,
					},
					iconOnly: {
						label: "Icon only",
						value: true,
						type: "boolean",
					},
					class: {
						label: "Button classes",
						value: "button--primary",
						isInline: true,
					},
				},
				events: {
					click: {
						label: "Click handler",
						value: "createAccount",
					},
				},
			},
		},
		{
			name: "loading-auto",
			label: "Auto-loading button",
			summary:
				"A reactive button that detects a Promise returned by the click handler and resets when the Promise resolves or rejects.",
			snippet: {
				slots: {
					default: {
						label: "Button label",
						value: "Save changes",
					},
				},
				props: {
					reactive: {
						label: "Reactive",
						value: true,
						type: "boolean",
					},
					class: {
						label: "Button classes",
						value: "button--primary",
						isInline: true,
					},
				},
				events: {
					click: {
						label: "Click handler",
						value: "save",
					},
				},
			},
		},
		{
			name: "reactive",
			label: "Reactive button",
			summary: "A button that shows loading feedback while work is in progress.",
			playground: true,
			snippet: {
				slots: {
					default: {
						label: "Button label",
						value: "Save user details",
					},
				},
				props: {
					reactive: {
						label: "Reactive",
						type: "boolean",
						value: true,
					},
					class: {
						label: "Button classes",
						value: "button--primary",
						isInline: true,
					},
				},
				events: {
					click: {
						label: "Click handler",
						value: "createAccount",
					},
				},
			},
		},
		{
			name: "toggle",
			label: "Toggle button",
			summary:
				"A controlled button that exposes pressed state so assistive technologies can announce whether the action is on or off.",
			snippet: {
				slots: {
					default: {
						label: "Button label",
						value: "Mute",
					},
				},
				props: {
					class: {
						label: "Button classes",
						value: "button--toggle",
						isInline: true,
					},
					pressed: {
						label: "Pressed state",
						value: "isMuted",
						isVariable: true,
					},
				},
				events: {
					click: {
						label: "Click handler",
						value: "toggleMute",
					},
				},
			},
		},
		{
			name: "full-width",
			label: "Wide button",
			summary: "A full-width button that centres its contents.",
			playground: true,
			snippet: {
				slots: {
					default: {
						label: "Button label",
						value: "Create account",
					},
				},
				props: {
					"icon-end": {
						label: "Suffix icon",
						value: "icon-arrow-right",
						isInline: true,
					},
					reactive: {
						label: "Reactive",
						value: true,
						type: "boolean",
					},
					class: {
						label: "Button classes",
						value: "button--primary w-full max-w-sm",
						isInline: true,
					},
				},
				events: {
					click: {
						label: "Click handler",
						value: "createAccount",
					},
				},
			},
		},
		{
			name: "trigger-reactive-state",
			label: "Triggering reactive state",
			summary: "A reactive button whose loading state is triggered from another control.",
			snippet: {
				slots: {
					default: {
						label: "Button label",
						value: "Create account",
					},
				},
				props: {
					reactive: {
						label: "Reactive",
						value: true,
						type: "boolean",
					},
					class: {
						label: "Button classes",
						value: "button--primary",
						isInline: true,
					},
				},
				events: {
					click: {
						label: "Click handler",
						value: "createAccount",
					},
				},
			},
		},
		{
			name: "disabled",
			label: "Disabled button",
			summary: "A button that communicates an unavailable action while staying focusable.",
			playground: true,
			snippet: {
				slots: {
					default: {
						label: "Button label",
						value: "Submit form",
					},
				},
				props: {
					disabled: {
						label: "Disabled",
						value: true,
						type: "boolean",
					},
					class: {
						label: "Button classes",
						value: "button--primary",
						isInline: true,
					},
				},
			},
		},
	],
};
