<template>
	<preview-wrapper>
		<template #title>
			skeleton-loader
		</template>

		<preview-section>
			<template #title>
				Simple loader
			</template>

			<skeleton-loader>
				<div class="flex items-center gap-4">
					<skeleton-indicator class="size-10 rounded-full" />

					<div class="flex flex-col gap-2">
						<skeleton-indicator class="h-4 w-28 rounded-sm" />
						<skeleton-indicator class="h-2 w-12 rounded-sm" />
					</div>
				</div>
			</skeleton-loader>
		</preview-section>

		<preview-section>
			<template #title>
				Custom label
			</template>

			<skeleton-loader>
				<template #label>
					Loading users…
				</template>

				<div class="flex items-center gap-4">
					<skeleton-indicator class="size-10 rounded-full" />

					<div class="flex flex-col gap-2">
						<skeleton-indicator class="h-4 w-28 rounded-sm" />
						<skeleton-indicator class="h-2 w-12 rounded-sm" />
					</div>
				</div>
			</skeleton-loader>
		</preview-section>
	</preview-wrapper>
</template>
