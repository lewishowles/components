<template>
	<div class="prose prose-slate dark:prose-invert *:animate-fade-in *:delay">
		<h1>Styling hooks</h1>

		<p>
			Components expose styling hooks as HTML data attributes so you can target internal elements
			from your own CSS without relying on internal class names or deep selectors.
		</p>

		<p>
			Three attributes work together.
			<code>data-component</code>
			identifies the component on its root element.
			<code>data-part</code>
			identifies named internal elements like a trigger, panel, or track.
			<code>data-state</code>
			and boolean presence attributes like
			<code>data-checked</code>
			and
			<code>data-invalid</code>
			reflect reactive state directly on the element, so your CSS can respond without needing to
			know the underlying class logic.
		</p>

		<p>
			These attributes are additive. The
			<code>*Classes</code>
			props still work and are the right choice for most customisation. Styling hooks are for
			situations where you want a stable CSS target that won't break if a component's internal class
			names change.
		</p>

		<h2><code>data-component</code></h2>

		<p>
			Every component places
			<code>data-component</code>
			on its root element, set to the component's kebab-case name.
		</p>

		<code-block :code="dataComponentExample" />

		<h2><code>data-part</code></h2>

		<p>
			Visually distinct internal elements carry
			<code>data-part</code>
			, named in kebab-case. Each component documents the parts it exposes. Common examples:
			<code>trigger</code>
			,
			<code>panel</code>
			,
			<code>track</code>
			,
			<code>thumb</code>
			,
			<code>header</code>
			,
			<code>icon</code>
			.
		</p>

		<code-block :code="dataPartExample" />

		<h2>
			<code>data-state</code>
			and boolean attributes
		</h2>

		<p>
			Reactive state is reflected as data attributes rather than toggled classes. This keeps your
			CSS selectors stable and the component template readable.
		</p>

		<p>
			<code>data-state</code>
			is used when both states are valid CSS targets — for example, when a panel transitions
			differently on close than on open, or when expanded and collapsed appearances both need
			explicit styling:
		</p>

		<code-block :code="dataStateExample" />

		<p>
			Boolean presence attributes are used for unidirectional states, where only the "on" case needs
			dedicated CSS. The attribute is present when the state is active and absent otherwise:
		</p>

		<code-block :code="dataScopedExample" />

		<p>Each component documents which state attributes it uses and what values they take.</p>

		<h2>Targeting from CSS</h2>

		<p>Combine the three attributes to target exactly what you need:</p>

		<code-block :code="cssExample" />

		<h2>Keeping styling and testing separate</h2>

		<p>
			<code>data-test</code>
			attributes remain the dedicated hook for test selectors. Styling hooks and test selectors are
			intentionally separate.
		</p>
	</div>
</template>

<script setup>
import useTitle from "@/docs/composables/use-title/use-title";

const { setTitle } = useTitle();

setTitle("Styling hooks");

const dataComponentExample = `<!-- rendered HTML -->
<details data-component="floating-details">
	...
</details>`;

const dataPartExample = `<!-- rendered HTML -->
<details data-component="accordion-group">
	<div data-part="panel" data-state="open">
		<button data-part="trigger">Section title</button>
		<div data-part="content">...</div>
	</div>
</details>`;

const dataStateExample = `<!-- open -->
<div data-part="panel" data-state="open">...</div>

<!-- closed -->
<div data-part="panel" data-state="closed">...</div>`;

const dataScopedExample = `<!-- checked checkbox -->
<span data-part="indicator" data-checked>...</span>

<!-- invalid input -->
<div data-component="form-input" data-invalid>...</div>`;

const cssExample = `/* Style the panel when the accordion is open */
[data-component="accordion-group"] [data-part="panel"][data-state="open"] {
	border-color: var(--colour-brand);
}

/* Style the thumb when the toggle is active */
[data-component="form-toggle"] [data-part="thumb"][data-checked] {
	transform: translateX(1.5rem);
}`;
</script>
