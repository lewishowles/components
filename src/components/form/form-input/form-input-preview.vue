<template>
	<preview-wrapper>
		<template #title>
			form-input
		</template>

		<preview-section>
			<template #title>
				Basic input options
			</template>

			<form-layout class="max-w-sm">
				<form-input v-model="inputValue">
					Your name
				</form-input>

				<form-input>
					Your name

					<template #help>
						With help text
					</template>
				</form-input>

				<form-input>
					Your name

					<template #error>
						With an error
					</template>
				</form-input>

				<form-input>
					Your name

					<template #help>
						With help text
					</template>

					<template #error>
						With an error
					</template>
				</form-input>

				<form-input />
			</form-layout>
		</preview-section>

		<preview-section>
			<template #title>
				With decoration
			</template>

			<form-layout class="max-w-sm">
				<form-input v-bind="{ iconStart: 'icon-user' }">
					Icon start

					<template #help>
						With help text
					</template>
				</form-input>

				<form-input v-bind="{ iconEnd: 'icon-email' }">
					Icon end

					<template #help>
						With help text
					</template>
				</form-input>

				<form-input>
					Text start

					<template #text-start>
						https://
					</template>

					<template #help>
						With help text
					</template>
				</form-input>

				<form-input>
					Text end

					<template #text-end>
						mph
					</template>

					<template #help>
						With help text
					</template>
				</form-input>
			</form-layout>
		</preview-section>
	</preview-wrapper>
</template>
