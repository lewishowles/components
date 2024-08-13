import colors from "tailwindcss/colors";
import hocusPlugin from "tailwindcss-hocus";

export default {
	darkMode: "selector",
	content: [
		"./index.html",
		"./src/**/*.vue",
		"./src/**/*.cy.js",
	],
	theme: {
		colors: {
			// Set our preferred colours from those provided by Tailwind
			transparent: "transparent",
			current: "currentColor",
			black: colors.black,
			white: colors.white,
			grey: colors.slate,
			red: colors.red,
			orange: colors.orange,
			yellow: colors.amber,
			green: colors.green,
			teal: colors.teal,
			blue: colors.sky,
			indigo: colors.indigo,
			purple: colors.purple,
			pink: colors.pink,
		},
	},
	plugins: [hocusPlugin],
};

