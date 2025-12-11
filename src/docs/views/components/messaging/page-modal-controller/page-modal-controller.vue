<template>
	<component-page>
		<template #title>
			Modal controller
		</template>

		<template #introduction>
			<p><code>modal-controller</code> displays existing modals created using <code>useModalDialog</code>. The most recently added modal is displayed, falling back to previous modals (if they exist) once that is closed.</p>

			<p>This component teleports its content to the <code>body</code>, and should be placed once, centrally, such as in <code>App.vue</code>.</p>

			<p>To simplify the creation of modal dialogs that share a visual style, there are a number of companion components, including:</p>

			<ul>
				<li><code>modal-controller-title</code>, a styled title with a customisable <code>tag</code></li>
				<li><code>modal-controller-actions</code>, a wrapper for actions to be taken within the dialog</li>
			</ul>
		</template>

		<component-playgrounds>
			<playground-modal-controller />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundModalController from "./fragments/playground-modal-controller.vue";
</script>
