import{Ct as e,M as t,O as n,V as r,c as i,h as a,m as o,s,v as c}from"./runtime-core.esm-bundler-DpihAPF5.js";var l=`<template>
	<input
		v-model="search"
		v-bind="inputAttributes"
		autocomplete="off"
		@focus="open"
		@input="open"
		@keydown="handleKeydown"
	/>

	<ul v-if="isOpen" v-bind="listboxAttributes" class="bg-white">
		<li
			v-for="option in filteredOptions"
			:key="option.id"
			v-bind="getOptionAttributes(option.id).value"
			:class="{ active: activeId === option.id }"
			@click="selectOption(option.id)"
		>
			{{ option.label }}
		</li>
	</ul>
</template>

<script setup>
import { computed, ref } from "vue";
import { useCombobox } from "@lewishowles/components/composables";

const options = [
	{ id: "owner-lewis", label: "Lewis Howles" },
	{ id: "owner-maya", label: "Maya Patel" },
	{ id: "owner-sam", label: "Sam Taylor" },
];

const search = ref("");
const filteredOptions = computed(() =>
	options.filter((option) => option.label.toLowerCase().includes(search.value.toLowerCase())),
);
const optionIds = computed(() => filteredOptions.value.map((option) => option.id));

const {
	activeId,
	getOptionAttributes,
	handleKeydown,
	inputAttributes,
	isOpen,
	listboxAttributes,
	open,
	selectOption,
} = useCombobox({
	options: optionIds,
	listboxId: "owner-listbox",
	onSelect: (id) => {
		search.value = options.find((option) => option.id === id)?.label ?? "";
	},
});
<\/script>`,u={__name:`page-use-combobox`,setup(u){return(u,d)=>{let f=t(`component-parameter`),p=t(`component-parameters`),m=t(`component-return`),h=t(`component-returns`),g=t(`component-method`),_=t(`component-methods`),v=t(`code-block`),y=t(`component-tab`),b=t(`component-page`);return n(),i(b,null,{title:r(()=>[...d[0]||=[o(`useCombobox`,-1)]]),introduction:r(()=>[...d[1]||=[s(`p`,null,[s(`code`,null,`useCombobox`),o(` provides the groundwork for implementing a combobox interaction pattern, including ARIA attribute management and keyboard handling. `)],-1),s(`p`,null,[o(` It owns the state and behaviour only; you provide the markup. Spread the returned attribute objects onto your input, listbox, and option elements, pass the ordered list of option IDs as `),s(`code`,null,`options`),o(` , and forward keydown events to `),s(`code`,null,`handleKeydown`),o(` . `)],-1)]]),default:r(()=>[a(p,null,{default:r(()=>[a(f,{id:`parameter-options`},{name:r(()=>[...d[2]||=[o(`options`,-1)]]),type:r(()=>[...d[3]||=[o(`array | ref | getter`,-1)]]),default:r(()=>[d[4]||=s(`p`,null,` The ordered list of option IDs the user can navigate, as a plain array, a ref, or a getter. Navigation follows this order, and the active option is cleared automatically when it leaves the list. `,-1)]),_:1}),a(f,{id:`parameter-listbox-id`},{name:r(()=>[...d[5]||=[o(`listboxId`,-1)]]),type:r(()=>[...d[6]||=[o(`string`,-1)]]),"default-value":r(()=>[...d[7]||=[o(`auto-generated`,-1)]]),default:r(()=>[d[8]||=s(`p`,null,[o(` The ID used to link the input's `),s(`code`,null,`aria-controls`),o(` to the listbox's `),s(`code`,null,`id`),o(` . A unique ID is generated automatically if one is not provided. `)],-1)]),_:1}),a(f,{id:`parameter-on-select`},{name:r(()=>[...d[9]||=[o(`onSelect`,-1)]]),type:r(()=>[...d[10]||=[o(`function`,-1)]]),default:r(()=>[d[11]||=s(`p`,null,[o(` Called with the selected option's ID when an option is chosen, either by clicking or by pressing `),s(`code`,null,`Enter`),o(` on the highlighted option. `)],-1)]),_:1})]),_:1}),a(h,null,{default:r(()=>[a(m,{id:`return-is-open`},{name:r(()=>[...d[12]||=[o(`isOpen`,-1)]]),type:r(()=>[...d[13]||=[o(`Ref<boolean>`,-1)]]),default:r(()=>[d[14]||=s(`p`,null,`Whether the listbox popup is currently open.`,-1)]),_:1}),a(m,{id:`return-active-id`},{name:r(()=>[...d[15]||=[o(`activeId`,-1)]]),type:r(()=>[...d[16]||=[o(`Ref<string | null>`,-1)]]),default:r(()=>[d[17]||=s(`p`,null,[o(` The ID of the currently highlighted option, or `),s(`code`,null,`null`),o(` when none is highlighted. Drives `),s(`code`,null,`aria-activedescendant`),o(` and each option's `),s(`code`,null,`aria-selected`),o(` . `)],-1)]),_:1}),a(m,{id:`return-input-attributes`},{name:r(()=>[...d[18]||=[o(`inputAttributes`,-1)]]),type:r(()=>[...d[19]||=[o(`ComputedRef<object>`,-1)]]),default:r(()=>[d[20]||=s(`p`,null,[o(` ARIA attributes to spread onto the input element: `),s(`code`,null,`role="combobox"`),o(` , `),s(`code`,null,`aria-autocomplete`),o(` , `),s(`code`,null,`aria-controls`),o(` , `),s(`code`,null,`aria-expanded`),o(` , and `),s(`code`,null,`aria-activedescendant`),o(` . `)],-1)]),_:1}),a(m,{id:`return-listbox-attributes`},{name:r(()=>[...d[21]||=[o(`listboxAttributes`,-1)]]),type:r(()=>[...d[22]||=[o(`ComputedRef<object>`,-1)]]),default:r(()=>[d[23]||=s(`p`,null,[o(` ARIA attributes to spread onto the listbox element: `),s(`code`,null,`role="listbox"`),o(` and the shared `),s(`code`,null,`id`),o(` . `)],-1)]),_:1})]),_:1}),a(_,null,{default:r(()=>[a(g,{id:`method-open`},{name:r(()=>[...d[24]||=[s(`code`,null,`open()`,-1)]]),default:r(()=>[d[25]||=s(`p`,null,`Open the listbox popup.`,-1)]),_:1}),a(g,{id:`method-close`},{name:r(()=>[...d[26]||=[s(`code`,null,`close()`,-1)]]),default:r(()=>[d[27]||=s(`p`,null,`Close the listbox popup and clear the active highlight.`,-1)]),_:1}),a(g,{id:`method-select-option`},{name:r(()=>[...d[28]||=[s(`code`,null,`selectOption(id?)`,-1)]]),default:r(()=>[d[29]||=s(`p`,null,[o(` Select an individual option, which in turn calls `),s(`code`,null,`onSelect`),o(` and closes the popup. Selects the currently highlighted option when no ID is provided. `)],-1)]),_:1}),a(g,{id:`method-get-option-attributes`},{name:r(()=>[...d[30]||=[s(`code`,null,`getOptionAttributes(id)`,-1)]]),default:r(()=>[d[31]||=s(`p`,null,[o(` Use on individual options. Returns a computed object of ARIA attributes for an individual option: `),s(`code`,null,`role="option"`),o(` , its `),s(`code`,null,`id`),o(` , and `),s(`code`,null,`aria-selected`),o(` . `)],-1)]),_:1}),a(g,{id:`method-handle-keydown`},{name:r(()=>[...d[32]||=[s(`code`,null,`handleKeydown(event)`,-1)]]),default:r(()=>[d[33]||=s(`p`,null,[o(` Attach to the input to handle keydown events, implementing the combobox keyboard functionality: arrow keys open and navigate the list, `),s(`code`,null,`Enter`),o(` selects, `),s(`code`,null,`Escape`),o(` closes, and cursor keys return to text editing. `)],-1)]),_:1})]),_:1}),a(y,e(c({id:`tab-examples`,icon:`icon-code`})),{title:r(()=>[...d[34]||=[o(`Examples`,-1)]]),default:r(()=>[a(v,{code:l})]),_:1},16)]),_:1})}}};export{u as default};