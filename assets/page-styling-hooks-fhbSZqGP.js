import{M as e,O as t,h as n,m as r,p as i,s as a,u as o}from"./runtime-core.esm-bundler-CyDMPmLI.js";import{jt as s}from"./index-Dq2l2Sk3.js";var c={class:`prose prose-slate dark:prose-invert *:animate-fade-in *:delay`},l=`<!-- rendered HTML -->
<details data-component="floating-details">
	...
</details>`,u=`<!-- rendered HTML -->
<details data-component="accordion-group">
	<div data-part="panel" data-state="open">
		<button data-part="trigger">Section title</button>
		<div data-part="content">...</div>
	</div>
</details>`,d=`<!-- open -->
<div data-part="panel" data-state="open">...</div>

<!-- closed -->
<div data-part="panel" data-state="closed">...</div>`,f=`<!-- checked checkbox -->
<span data-part="indicator" data-checked>...</span>

<!-- invalid input -->
<div data-component="form-input" data-invalid>...</div>`,p=`/* Style the panel when the accordion is open */
[data-component="accordion-group"] [data-part="panel"][data-state="open"] {
	border-color: var(--colour-brand);
}

/* Style the thumb when the toggle is active */
[data-component="form-toggle"] [data-part="thumb"][data-checked] {
	transform: translateX(1.5rem);
}`,m={__name:`page-styling-hooks`,setup(m){let{setTitle:h}=s();return h(`Styling hooks`),(s,m)=>{let h=e(`code-block`);return t(),o(`div`,c,[m[0]||=i(`<h1>Styling hooks</h1><p> Components expose styling hooks as HTML data attributes so you can target internal elements from your own CSS without relying on internal class names or deep selectors. </p><p> Three attributes work together. <code>data-component</code> identifies the component on its root element. <code>data-part</code> identifies named internal elements like a trigger, panel, or track. <code>data-state</code> and boolean presence attributes like <code>data-checked</code> and <code>data-invalid</code> reflect reactive state directly on the element, so your CSS can respond without needing to know the underlying class logic. </p><p> These attributes are additive. The <code>*Classes</code> props still work and are the right choice for most customisation. Styling hooks are for situations where you want a stable CSS target that won&#39;t break if a component&#39;s internal class names change. </p><h2><code>data-component</code></h2><p> Every component places <code>data-component</code> on its root element, set to the component&#39;s kebab-case name. </p>`,6),n(h,{code:l}),m[1]||=i(`<h2><code>data-part</code></h2><p> Visually distinct internal elements carry <code>data-part</code> , named in kebab-case. Each component documents the parts it exposes. Common examples: <code>trigger</code> , <code>panel</code> , <code>track</code> , <code>thumb</code> , <code>header</code> , <code>icon</code> . </p>`,2),n(h,{code:u}),m[2]||=a(`h2`,null,[a(`code`,null,`data-state`),r(` and boolean attributes `)],-1),m[3]||=a(`p`,null,` Reactive state is reflected as data attributes rather than toggled classes. This keeps your CSS selectors stable and the component template readable. `,-1),m[4]||=a(`p`,null,[a(`code`,null,`data-state`),r(` is used when both states are valid CSS targets — for example, when a panel transitions differently on close than on open, or when expanded and collapsed appearances both need explicit styling: `)],-1),n(h,{code:d}),m[5]||=a(`p`,null,` Boolean presence attributes are used for unidirectional states, where only the "on" case needs dedicated CSS. The attribute is present when the state is active and absent otherwise: `,-1),n(h,{code:f}),m[6]||=a(`p`,null,`Each component documents which state attributes it uses and what values they take.`,-1),m[7]||=a(`h2`,null,`Targeting from CSS`,-1),m[8]||=a(`p`,null,`Combine the three attributes to target exactly what you need:`,-1),n(h,{code:p}),m[9]||=a(`h2`,null,`Keeping styling and testing separate`,-1),m[10]||=a(`p`,null,[a(`code`,null,`data-test`),r(` attributes remain the dedicated hook for test selectors. Styling hooks and test selectors are intentionally separate. `)],-1)])}}};export{m as default};