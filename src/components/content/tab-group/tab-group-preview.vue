<template>
	<preview-wrapper>
		<template #title>
			tab-group
		</template>

		<preview-section>
			<template #title>
				Basic tabs
			</template>

			<tab-group>
				<tab-item>
					<template #label>
						Tab label
					</template>

					Tab content
				</tab-item>
				<tab-item>
					<template #label>
						Second tab
					</template>

					Second tab content
				</tab-item>
			</tab-group>
		</preview-section>
	</preview-wrapper>
</template>
