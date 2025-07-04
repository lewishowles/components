<template>
	<component-page>
		<template #title>
			Conditional wrapper
		</template>

		<template #introduction>
			<p><code>conditional-wrapper</code> is a helper component that makes it easy to optionally wrap one or more elements in a tag. This might be useful, for example, to group items together when there are more than one, but keep a template simple otherwise.</p>
		</template>

		<component-props>
			<component-prop id="prop-wrap">
				<template #name>
					wrap
				</template>

				<template #type>
					boolean
				</template>

				<template #default-value>
					true
				</template>

				<p>Whether to apply the wrapper. If  <code>false</code>, the contents are unwrapped and display as if <code>conditional-wrapper</code> was not used.</p>

				<p><em>Note that this component does not inherit attributes when <code>wrap</code> is set to false, as there may be multiple root nodes.</em></p>
			</component-prop>

			<component-prop id="prop-tag">
				<template #name>
					tag
				</template>

				<template #type>
					string
				</template>

				<template #default-value>
					div
				</template>

				<p>The tag to use when wrapping content.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The default slot contains the content to be wrapped.</p>
			</component-slot>
		</component-slots>

		<component-playgrounds>
			<playground-conditional-wrapper />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundConditionalWrapper from "./fragments/playground-conditional-wrapper.vue";
</script>
