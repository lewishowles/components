<template>
	<div class="prose prose-slate dark:prose-invert *:animate-fade-in *:delay">
		<h1>Theming</h1>

		<p>
			The library is themed with CSS variables, allowing you to re-colour everything from your own
			stylesheet. There are two layers to the system, and most of the time you'll only need to touch
			the first.
		</p>

		<h2>The two layers</h2>

		<p>
			The first layer is a set of named colour scales. The five scales; primary, danger, warning,
			success, and info; each run from <code>50</code> (the lightest shade) to <code>950</code> (the
			darkest). This is where colour actually lives, and it's the layer you override if you need to.
		</p>

		<p>
			The second layer is the semantic tokens. Rather than asking for "purple 800", components ask
			for "the primary fill" or "normal body text". Each token picks a sensible shade from the
			scales, and it picks the right shade for light or dark mode.
		</p>

		<h2>Re-theming</h2>

		<p>
			To re-theme, set the scale variables you care about in your own <code>:root</code>, after the
			library's stylesheet has loaded. Your values win:
		</p>

		<code-block :code="overrideExample" />

		<p>
			That single line re-points everything built on <code>--primary-500</code>. To shift the whole
			brand, set the shades that your brand relies on.
		</p>

		<h2>Using the stylesheets</h2>

		<p>
			The styles are built with Tailwind, so your project needs Tailwind (version 4) as well. Point
			it at the library so it can generate the utility classes the components rely on. Import this
			into your Tailwind entry stylesheet:
		</p>

		<code-block :code="sourceExample" />

		<p>
			Each of the library's stylesheets is published so that you can start from a working copy
			rather than a blank file. Overriding tokens covers most re-theming, but to change how a
			component itself looks, from button shapes to form fields, copy the matching stylesheet and
			edit it.
			<code>main.css</code> is the entry point and imports the rest:
		</p>

		<ul>
			<li v-for="stylesheet in stylesheets" :key="stylesheet.file">
				<a :href="stylesheetUrl(stylesheet.file)" download>
					<code>{{ stylesheet.file }}</code>
				</a>
				— {{ stylesheet.description }}
			</li>
		</ul>

		<h2>Colour scales</h2>

		<p>
			Every family follows the same pattern — <code>--{name}-50</code> through
			<code>--{name}-950</code>. The defaults map to a Tailwind palette.
		</p>

		<table>
			<thead>
				<tr>
					<th>Family</th>
					<th>Variables</th>
					<th>Default palette</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Primary</td>
					<td><code>--primary-50</code> … <code>--primary-950</code></td>
					<td>Purple</td>
				</tr>
				<tr>
					<td>Danger</td>
					<td><code>--danger-50</code> … <code>--danger-950</code></td>
					<td>Red</td>
				</tr>
				<tr>
					<td>Warning</td>
					<td><code>--warning-50</code> … <code>--warning-950</code></td>
					<td>Yellow</td>
				</tr>
				<tr>
					<td>Success</td>
					<td><code>--success-50</code> … <code>--success-950</code></td>
					<td>Green</td>
				</tr>
				<tr>
					<td>Info</td>
					<td><code>--info-50</code> … <code>--info-950</code></td>
					<td>Blue</td>
				</tr>
			</tbody>
		</table>

		<h2>Semantic tokens</h2>

		<p>
			Each intent (primary, danger, warning, success, info) gives you four roles. Reach for the
			utility rather than a raw shade wherever you can, because the utility keeps light and dark
			mode correct without any extra work from you.
		</p>

		<table>
			<thead>
				<tr>
					<th>Role</th>
					<th>Utility</th>
					<th>What it's for</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Fill</td>
					<td><code>bg-primary</code></td>
					<td>A solid background, such as a primary button or a danger banner</td>
				</tr>
				<tr>
					<td>Text</td>
					<td><code>text-primary</code></td>
					<td>Coloured text and icons</td>
				</tr>
				<tr>
					<td>Border</td>
					<td><code>border-primary</code></td>
					<td>A border that matches the text shade</td>
				</tr>
				<tr>
					<td>Subtle</td>
					<td><code>bg-primary-subtle</code></td>
					<td>A soft tint behind content, like a quiet alert</td>
				</tr>
				<tr>
					<td>Foreground</td>
					<td><code>text-primary-foreground</code></td>
					<td>Text that sits on top of a fill, kept readable</td>
				</tr>
			</tbody>
		</table>

		<p>
			Swap <code>primary</code> for any intent to get the same five utilities. Behind each one is a
			meaningful shade, which changes between light and dark mode:
		</p>

		<table>
			<thead>
				<tr>
					<th>Intent</th>
					<th>Fill (light → dark)</th>
					<th>Text (light → dark)</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Primary</td>
					<td>800 → 500</td>
					<td>800 → 300</td>
				</tr>
				<tr>
					<td>Danger</td>
					<td>700 → 500</td>
					<td>800 → 200</td>
				</tr>
				<tr>
					<td>Warning</td>
					<td>300 → 300</td>
					<td>800 → 200</td>
				</tr>
				<tr>
					<td>Success</td>
					<td>600 → 500</td>
					<td>800 → 200</td>
				</tr>
				<tr>
					<td>Info</td>
					<td>600 → 500</td>
					<td>800 → 200</td>
				</tr>
			</tbody>
		</table>

		<p>
			The subtle wash uses the <code>50</code> shade in light mode and a half-transparent
			<code>500</code> in dark mode. The foreground is white, except on the light warning fill,
			where it's near-black so the text stays legible.
		</p>

		<h2>Neutral tokens</h2>

		<p>
			Surfaces, body text, and borders that aren't tied to an intent have their own tokens. These
			carry the bulk of a page's appearance:
		</p>

		<table>
			<thead>
				<tr>
					<th>Utility</th>
					<th>Role</th>
					<th>Light</th>
					<th>Dark</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>bg-surface</code></td>
					<td>Page and card background</td>
					<td>White</td>
					<td>Grey 950</td>
				</tr>
				<tr>
					<td><code>bg-surface-subtle</code></td>
					<td>A slightly raised panel</td>
					<td>Grey 50</td>
					<td>White at 10%</td>
				</tr>
				<tr>
					<td><code>bg-surface-sunken</code></td>
					<td>A recessed well</td>
					<td>Grey 100</td>
					<td>White at 20%</td>
				</tr>
				<tr>
					<td><code>text-content</code></td>
					<td>Body text</td>
					<td>Grey 600</td>
					<td>Grey 50</td>
				</tr>
				<tr>
					<td><code>text-content-strong</code></td>
					<td>Headings and emphasis</td>
					<td>Grey 950</td>
					<td>White</td>
				</tr>
				<tr>
					<td><code>text-content-muted</code></td>
					<td>Secondary text</td>
					<td>Grey 500</td>
					<td>White at 60%</td>
				</tr>
				<tr>
					<td><code>border-border</code></td>
					<td>Default border</td>
					<td>Grey 200</td>
					<td>White at 20%</td>
				</tr>
				<tr>
					<td><code>border-border-strong</code></td>
					<td>A stronger border</td>
					<td>Grey 300</td>
					<td>White at 30%</td>
				</tr>
			</tbody>
		</table>

		<h2>Numbered shades and roles are different things</h2>

		<p>Two utilities look alike but aren't the same thing:</p>

		<p>
			<code>bg-primary-500</code> is one specific step on the scale. The scale steps are available
			wherever Tailwind expects a colour: backgrounds, text, borders, and rings. Reach for these
			when you need an exact shade.
		</p>

		<p>
			<code>bg-primary</code> is a role. It already holds the right shade for the job and swaps
			itself between light and dark mode. Use roles for almost everything, and drop down to a
			numbered shade only when a role doesn't cover what you need.
		</p>

		<h2>Dark mode</h2>

		<p>
			Dark mode is class-based, and it works the way it always has. Add the <code>dark</code> class
			to a parent element (usually <code>&lt;html&gt;</code>) and every semantic token flips to its
			dark value. There's nothing to restyle. The tokens carry the dark appearance themselves.
		</p>

		<code-block :code="darkModeExample" />

		<p>
			If you re-theme a scale, dark mode keeps working. The dark values read from the same scales
			you override, so your brand colour follows through into both modes.
		</p>
	</div>
</template>

<script setup>
import useTitle from "@/docs/composables/use-title/use-title";

const { setTitle } = useTitle();

setTitle("Theming");

// The library's stylesheets, published alongside the docs so the links always
// point at the current version. main.css is the entry point and imports the
// rest.
const stylesheets = [
	{
		file: "main.css",
		description: "The entry point. Pulls in Tailwind and imports the stylesheets below.",
	},
	{
		file: "theme.css",
		description: "Colour scales and semantic tokens — the file you override to re-theme.",
	},
	{ file: "buttons.css", description: "Button shapes and variants." },
	{ file: "form.css", description: "Form control styling." },
	{ file: "font.css", description: "Font faces and typography tokens." },
	{ file: "animation.css", description: "Keyframes and animation helpers." },
];

// An example for overriding a token.
const overrideExample = `:root {
	--primary-500: oklch(0.6 0.2 250);
}`;

// The example code to add Components as a source.
const sourceExample = `@import "@lewishowles/components/source";`;

// An example of how to trigger dark mode.
const darkModeExample = `<html class="dark">`;

/**
 * Build the published URL for a stylesheet, resolved against the docs base
 * path.
 *
 * @param  {string}  file
 *     The stylesheet filename.
 */
function stylesheetUrl(file) {
	return `${import.meta.env.BASE_URL}css/${file}`;
}
</script>
