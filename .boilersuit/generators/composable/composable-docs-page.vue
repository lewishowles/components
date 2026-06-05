<template>
	<component-page>
		<template #title> {{ NAME | pascal }} </template>

		<template #introduction>
			<p><code>{{ NAME | camel }}</code> [describe what this composable manages].</p>
		</template>

		<component-parameters>
			<component-parameter id="parameter-example">
				<template #name> example </template>

				<template #type> string </template>

				<template #default-value> null </template>

				<p>[Describe this parameter.]</p>
			</component-parameter>
		</component-parameters>

		<component-returns>
			<component-return id="return-example">
				<template #name> example </template>

				<template #type> Ref&lt;boolean&gt; </template>

				<p>[Describe this returned value.]</p>
			</component-return>
		</component-returns>

		<component-methods>
			<component-method id="method-example">
				<template #name>
					<code>example()</code>
				</template>

				<p>[Describe this method.]</p>
			</component-method>
		</component-methods>
	</component-page>
</template>
