<template>
	<component-page>
		<template #title>
			Modal controller
		</template>

		<template #introduction>
			<p><code>modal-controller</code> displays existing modals created using <code>useModalDialog</code>. The most recently added modal is displayed, falling back to previous modals (if they exist) once that is closed.</p>
			<p>This component teleports its content to the <code>body</code>, and should be placed once, centrally, such as in <code>App.vue</code>.</p>
		</template>

		<component-playgrounds>
			<playground-modal-controller />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
// import PlaygroundModalController from "./fragments/playground-modal-controller.vue";
</script>
