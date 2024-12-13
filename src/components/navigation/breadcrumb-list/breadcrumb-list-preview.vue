<template>
	<preview-wrapper>
		<template #title>
			breadcrumb-list
		</template>

		<preview-section>
			<template #title>
				Basic breadcrumbs
			</template>

			<breadcrumb-list>
				<breadcrumb-item href="/">
					Admin
				</breadcrumb-item>
				<breadcrumb-item href="/users">
					Users
				</breadcrumb-item>
			</breadcrumb-list>
		</preview-section>
	</preview-wrapper>
</template>
