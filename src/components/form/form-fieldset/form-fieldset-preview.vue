<template>
	<preview-wrapper>
		<template #title>
			form-fieldset
		</template>

		<preview-section>
			<template #title>
				Basic fieldset
			</template>

			<form-fieldset>
				<template #title>
					Your details
				</template>

				<template #introduction>
					Your details will only be used to administer your account.
				</template>

				<form-field name="your_name">
					Your name
				</form-field>
			</form-fieldset>
		</preview-section>
	</preview-wrapper>
</template>
