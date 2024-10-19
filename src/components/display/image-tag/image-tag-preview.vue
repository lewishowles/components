<template>
	<preview-wrapper>
		<template #title>
			image-tag
		</template>

		<preview-section>
			<template #title>
				Basic image
			</template>

			<image-tag src="https://picsum.photos/300/300" class="size-52" />
		</preview-section>

		<preview-section>
			<template #title>
				Invalid image
			</template>

			<image-tag src="/abcd" class="size-52" />
		</preview-section>
	</preview-wrapper>
</template>
