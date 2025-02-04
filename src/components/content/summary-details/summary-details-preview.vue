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
				Floating
			</template>

			<div class="flex flex-col gap-10">
				<summary-details v-bind="{ floating: true }" class="w-max" summary-classes="button--muted">
					<template #summary>
						Summary
					</template>

					<div class="mt-1 min-w-xs rounded-md border border-grey-200 bg-white p-4 shadow-sm">
						Details content
					</div>
				</summary-details>

				<summary-details v-bind="{ floating: true, align: 'end' }" class="w-max" summary-classes="button--muted">
					<template #summary>
						Align end
					</template>

					<div class="mt-1 min-w-xs rounded-md border border-grey-200 bg-white p-4 shadow-sm">
						Details content
					</div>
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

		<preview-section>
			<template #title>
				Interaction
			</template>

			<div class="flex flex-col gap-10">
				<summary-details>
					<template #summary>
						With focusable content
					</template>

					<a href="#">Focusable details content</a>
				</summary-details>

				<summary-details v-bind="{ closeWithClickOutside: true }">
					<template #summary>
						With click outside
					</template>

					Details content
				</summary-details>
			</div>
		</preview-section>
	</preview-wrapper>
</template>
