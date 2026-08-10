import{Ct as e,M as t,O as n,V as r,c as i,h as a,m as o,s,v as c}from"./runtime-core.esm-bundler-D8JxCXTF.js";var l=`<template>
	<button ref="triggerElement" type="button" @click="togglePanel">Toggle panel</button>

	<div v-if="isOpen" ref="panelElement" :class="panelClasses">
		Floating panel content
	</div>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";
import { useFloatingPosition } from "@lewishowles/components/composables";

const isOpen = ref(false);
const triggerElement = ref(null);
const panelElement = ref(null);
const initialPlacement = ref("below");
const initialAlign = ref("start");

const { computedAlign, computedPlacement, handleClose, handleOpen, isPositioning, placementClasses } =
	useFloatingPosition({ triggerElement, panelElement, initialPlacement, initialAlign });

const panelClasses = computed(() => [
	placementClasses.value,
	isPositioning.value ? "invisible" : "",
	computedPlacement.value === "above" ? "bottom-full" : "top-full",
	computedAlign.value === "end" ? "right-0" : "left-0",
]);

async function togglePanel() {
	isOpen.value = !isOpen.value;

	if (!isOpen.value) {
		handleClose();
		return;
	}

	await nextTick();
	await handleOpen();
}
<\/script>`,u={__name:`page-use-floating-position`,setup(u){return(u,d)=>{let f=t(`router-link`),p=t(`component-parameter`),m=t(`component-parameters`),h=t(`component-return`),g=t(`component-returns`),_=t(`component-method`),v=t(`component-methods`),y=t(`code-block`),b=t(`component-tab`),x=t(`component-page`);return n(),i(x,null,{title:r(()=>[...d[0]||=[o(`useFloatingPosition`,-1)]]),introduction:r(()=>[d[6]||=s(`p`,null,[s(`code`,null,`useFloatingPosition`),o(` positions a floating panel relative to a trigger element, flipping its placement and alignment when the panel would otherwise clip the edge of the viewport. `)],-1),s(`p`,null,[d[3]||=o(` It is used internally by `,-1),a(f,{to:{name:`dropdown-menu`}},{default:r(()=>[...d[1]||=[s(`code`,null,`dropdown-menu`,-1)]]),_:1}),d[4]||=o(` and `,-1),a(f,{to:{name:`floating-details`}},{default:r(()=>[...d[2]||=[s(`code`,null,`floating-details`,-1)]]),_:1}),d[5]||=o(` . You will not usually need it directly unless you are building a new floating component. `,-1)])]),default:r(()=>[a(m,null,{default:r(()=>[a(p,{id:`parameter-trigger-element`},{name:r(()=>[...d[7]||=[o(`triggerElement`,-1)]]),type:r(()=>[...d[8]||=[o(`Ref<HTMLElement>`,-1)]]),default:r(()=>[d[9]||=s(`p`,null,`A ref resolving to the trigger element the panel is positioned against.`,-1)]),_:1}),a(p,{id:`parameter-panel-element`},{name:r(()=>[...d[10]||=[o(`panelElement`,-1)]]),type:r(()=>[...d[11]||=[o(`Ref<HTMLElement>`,-1)]]),default:r(()=>[d[12]||=s(`p`,null,`A ref resolving to the floating panel element being positioned.`,-1)]),_:1}),a(p,{id:`parameter-initial-placement`},{name:r(()=>[...d[13]||=[o(`initialPlacement`,-1)]]),type:r(()=>[...d[14]||=[o(`Ref<string>`,-1)]]),default:r(()=>[d[15]||=s(`p`,null,[o(` The preferred placement of the panel: `),s(`code`,null,`"above"`),o(` or `),s(`code`,null,`"below"`),o(` . Flips to the opposite side if the preferred side would clip the viewport. `)],-1)]),_:1}),a(p,{id:`parameter-initial-align`},{name:r(()=>[...d[16]||=[o(`initialAlign`,-1)]]),type:r(()=>[...d[17]||=[o(`Ref<string>`,-1)]]),default:r(()=>[d[18]||=s(`p`,null,[o(` The preferred alignment of the panel: `),s(`code`,null,`"start"`),o(` or `),s(`code`,null,`"end"`),o(` . Flips to the opposite side if the preferred side would clip the viewport. `)],-1)]),_:1})]),_:1}),a(g,null,{default:r(()=>[a(h,{id:`return-computed-placement`},{name:r(()=>[...d[19]||=[o(`computedPlacement`,-1)]]),type:r(()=>[...d[20]||=[o(`Ref<string>`,-1)]]),default:r(()=>[d[21]||=s(`p`,null,[o(` The resolved placement ( `),s(`code`,null,`"above"`),o(` or `),s(`code`,null,`"below"`),o(` ) after measuring. `)],-1)]),_:1}),a(h,{id:`return-computed-align`},{name:r(()=>[...d[22]||=[o(`computedAlign`,-1)]]),type:r(()=>[...d[23]||=[o(`Ref<string>`,-1)]]),default:r(()=>[d[24]||=s(`p`,null,[o(` The resolved alignment ( `),s(`code`,null,`"start"`),o(` or `),s(`code`,null,`"end"`),o(` ) after measuring. `)],-1)]),_:1}),a(h,{id:`return-is-positioning`},{name:r(()=>[...d[25]||=[o(`isPositioning`,-1)]]),type:r(()=>[...d[26]||=[o(`Ref<boolean>`,-1)]]),default:r(()=>[d[27]||=s(`p`,null,`Whether positioning is currently being calculated.`,-1)]),_:1}),a(h,{id:`return-placement-classes`},{name:r(()=>[...d[28]||=[o(`placementClasses`,-1)]]),type:r(()=>[...d[29]||=[o(`ComputedRef<string>`,-1)]]),default:r(()=>[d[30]||=s(`p`,null,[o(` A gap utility class reflecting the resolved placement ( `),s(`code`,null,`mb-3`),o(` when above, `),s(`code`,null,`mt-3`),o(` when below). `)],-1)]),_:1})]),_:1}),a(v,null,{default:r(()=>[a(_,{id:`method-handle-open`},{name:r(()=>[...d[31]||=[s(`code`,null,`handleOpen()`,-1)]]),default:r(()=>[d[32]||=s(`p`,null,` Measures available space and reveals the panel. Call this when the floating panel opens. `,-1)]),_:1}),a(_,{id:`method-handle-close`},{name:r(()=>[...d[33]||=[s(`code`,null,`handleClose()`,-1)]]),default:r(()=>[d[34]||=s(`p`,null,`Removes any current event listeners. Call this when the floating panel closes.`,-1)]),_:1})]),_:1}),a(b,e(c({id:`tab-examples`,icon:`icon-code`})),{title:r(()=>[...d[35]||=[o(`Examples`,-1)]]),default:r(()=>[a(y,{code:l})]),_:1},16)]),_:1})}}};export{u as default};