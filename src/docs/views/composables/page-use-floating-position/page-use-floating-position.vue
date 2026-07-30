<template>
	<component-page>
		<template #title>useFloatingPosition</template>

		<template #introduction>
			<p>
				<code>useFloatingPosition</code>
				positions a floating panel relative to a trigger element, flipping its placement and
				alignment when the panel would otherwise clip the edge of the viewport.
			</p>

			<p>
				It is used internally by
				<router-link :to="{ name: 'dropdown-menu' }">
					<code>dropdown-menu</code>
				</router-link>
				and
				<router-link :to="{ name: 'floating-details' }">
					<code>floating-details</code>
				</router-link>
				. You will not usually need it directly unless you are building a new floating component.
			</p>
		</template>

		<component-parameters>
			<component-parameter id="parameter-trigger-element">
				<template #name>triggerElement</template>

				<template #type>Ref&lt;HTMLElement&gt;</template>

				<p>A ref resolving to the trigger element the panel is positioned against.</p>
			</component-parameter>

			<component-parameter id="parameter-panel-element">
				<template #name>panelElement</template>

				<template #type>Ref&lt;HTMLElement&gt;</template>

				<p>A ref resolving to the floating panel element being positioned.</p>
			</component-parameter>

			<component-parameter id="parameter-initial-placement">
				<template #name>initialPlacement</template>

				<template #type>Ref&lt;string&gt;</template>

				<p>
					The preferred placement of the panel:
					<code>"above"</code>
					or
					<code>"below"</code>
					. Flips to the opposite side if the preferred side would clip the viewport.
				</p>
			</component-parameter>

			<component-parameter id="parameter-initial-align">
				<template #name>initialAlign</template>

				<template #type>Ref&lt;string&gt;</template>

				<p>
					The preferred alignment of the panel:
					<code>"start"</code>
					or
					<code>"end"</code>
					. Flips to the opposite side if the preferred side would clip the viewport.
				</p>
			</component-parameter>
		</component-parameters>

		<component-returns>
			<component-return id="return-computed-placement">
				<template #name>computedPlacement</template>

				<template #type>Ref&lt;string&gt;</template>

				<p>
					The resolved placement (
					<code>"above"</code>
					or
					<code>"below"</code>
					) after measuring.
				</p>
			</component-return>

			<component-return id="return-computed-align">
				<template #name>computedAlign</template>

				<template #type>Ref&lt;string&gt;</template>

				<p>
					The resolved alignment (
					<code>"start"</code>
					or
					<code>"end"</code>
					) after measuring.
				</p>
			</component-return>

			<component-return id="return-is-positioning">
				<template #name>isPositioning</template>

				<template #type>Ref&lt;boolean&gt;</template>

				<p>Whether positioning is currently being calculated.</p>
			</component-return>

			<component-return id="return-placement-classes">
				<template #name>placementClasses</template>

				<template #type>ComputedRef&lt;string&gt;</template>

				<p>
					A gap utility class reflecting the resolved placement (
					<code>mb-3</code>
					when above,
					<code>mt-3</code>
					when below).
				</p>
			</component-return>
		</component-returns>

		<component-methods>
			<component-method id="method-handle-open">
				<template #name>
					<code>handleOpen()</code>
				</template>

				<p>
					Measures available space and reveals the panel. Call this when the floating panel opens.
				</p>
			</component-method>

			<component-method id="method-handle-close">
				<template #name>
					<code>handleClose()</code>
				</template>

				<p>Removes any current event listeners. Call this when the floating panel closes.</p>
			</component-method>
		</component-methods>

		<component-tab v-bind="{ id: 'tab-examples', icon: 'icon-code' }">
			<template #title>Examples</template>

			<code-block :code="floatingPositionExample" />
		</component-tab>
	</component-page>
</template>

<script setup>
const floatingPositionExample = `<template>
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
\x3c/script>`;
</script>
