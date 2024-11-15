<template>
	<preview-wrapper>
		<template #title>
			dropdown-menu
		</template>

		<preview-section>
			<template #title>
				Section
			</template>

			<div class="flex gap-4">
				<dropdown-menu ref="actionableDropdown" @open="console.log('Menu opened')" @close="console.log('Menu closed')">
					<template #summary>
						Summary
					</template>

					<dropdown-menu-button>
						Menu button, no icon
					</dropdown-menu-button>

					<dropdown-menu-button icon-start="icon-user">
						Menu button
					</dropdown-menu-button>

					<dropdown-menu-divider />

					<dropdown-menu-link href="#">
						Menu link, no icon
					</dropdown-menu-link>

					<dropdown-menu-link href="#" icon-start="icon-user">
						Menu link
					</dropdown-menu-link>
				</dropdown-menu>

				<ui-button class="button--muted" @click="runComponentMethod(actionableDropdown, 'openMenu')">
					Trigger open
				</ui-button>

				<ui-button class="button--muted" @click="runComponentMethod(actionableDropdown, 'closeMenu')">
					Trigger close
				</ui-button>
			</div>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";

const actionableDropdown = ref(null);
</script>
