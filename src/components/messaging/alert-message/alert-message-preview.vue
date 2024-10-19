<template>
	<preview-wrapper>
		<template #title>
			alert-message
		</template>

		<preview-section>
			<template #title>
				Message types
			</template>

			<div class="flex flex-col gap-4">
				<alert-message v-bind="{ type: 'success' }">
					Success message.
				</alert-message>

				<alert-message v-bind="{ type: 'error' }">
					Error message.
				</alert-message>

				<alert-message v-bind="{ type: 'warning' }">
					Warning message.
				</alert-message>

				<alert-message v-bind="{ type: 'info' }">
					Info message.
				</alert-message>

				<alert-message v-bind="{ type: 'muted' }">
					Muted message.
				</alert-message>
			</div>
		</preview-section>

		<preview-section>
			<template #title>
				With a title
			</template>

			<alert-message v-bind="{ type: 'info' }">
				<template #title>
					Info message title
				</template>

				Info message.
			</alert-message>
		</preview-section>

		<preview-section>
			<template #title>
				Removing the default icon
			</template>

			<div class="flex flex-col gap-4">
				<alert-message v-bind="{ type: 'info', showIcon: false }">
					Info message.
				</alert-message>
			</div>
		</preview-section>

		<preview-section>
			<template #title>
				With custom icon
			</template>

			<div class="flex flex-col gap-4">
				<alert-message v-bind="{ type: 'info' }">
					<template #icon>
						<icon-arrow-up />
					</template>

					Info message.
				</alert-message>
			</div>
		</preview-section>

		<preview-section>
			<template #title>
				Text sizes
			</template>

			<div class="flex flex-col gap-4">
				<alert-message v-bind="{ type: 'info' }" class="text-sm">
					<template #icon>
						<icon-arrow-up />
					</template>

					`text-sm`
				</alert-message>

				<alert-message v-bind="{ type: 'info' }" class="text-lg">
					<template #icon>
						<icon-arrow-up />
					</template>

					`text-lg`
				</alert-message>
			</div>
		</preview-section>
	</preview-wrapper>
</template>
