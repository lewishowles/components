<template>
	<component-page>
		<template #title>
			Form layout
		</template>

		<template #introduction>
			<p><code>form-layout</code> is a functional component that adds consistent spacing between elements in a form.</p>
		</template>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The default slot contains the content to wrap.</p>
			</component-slot>
		</component-slots>

		<component-playgrounds>
			<template #additional-content>
				<p><code>form-layout</code> is a functional component that only provides template, and as such provides no options.</p>
			</template>
		</component-playgrounds>
	</component-page>
</template>
