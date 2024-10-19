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
	</preview-wrapper>
</template>
