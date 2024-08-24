<template>
	<preview-wrapper>
		<template #title>
			summary-details
		</template>

		<preview-section>
			<template #title>
				Standard expanding details
			</template>

			<div class="flex flex-col gap-10">
				<summary-details>
					<template #summary>
						Summary
					</template>

					Details content
				</summary-details>

				<summary-details v-bind="{ open: true }">
					<template #summary>
						Open by default
					</template>

					Details content
				</summary-details>

				<summary-details v-bind="{ iconOpen: 'icon-arrow-left', iconClosed: 'icon-arrow-right' }">
					<template #summary>
						Custom icon
					</template>

					Details content
				</summary-details>

				<summary-details v-bind="{ iconStart: true }">
					<template #summary>
						Icon start
					</template>

					Details content
				</summary-details>
			</div>
		</preview-section>

		<preview-section>
			<template #title>
				Slot props
			</template>

			<summary-details>
				<template #summary="{ isOpen, icon }">
					Summary {{ { isOpen, icon } }}
				</template>

				Details content
			</summary-details>
		</preview-section>
	</preview-wrapper>
</template>
