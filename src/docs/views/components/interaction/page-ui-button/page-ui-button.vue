<template>
	<component-page>
		<template #title>
			UI button
		</template>

		<template #introduction>
			<p><code>ui-button</code> is an extension of the standard <code>button</code> element.</p>
		</template>

		<component-props>
			<component-prop id="prop-icon-start">
				<template #name>
					iconStart
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>An icon to display at the start of a button.</p>

				<p>
					The icon is implemented using <code>&lt;component :is=&quot;...&quot;&gt;</code>, allowing the button to use icons it doesn't explicitly import. To be used in this way, the icon must be globally registered. You can find
					<router-link v-bind="{ to: 'icons' }">
						the list of available icons in this project
					</router-link>,
					or you can use one that is globally registered in your project.
				</p>

				<p><em>Note that <code>start</code> and <code>end</code> depend on the current document direction.</em></p>
			</component-prop>

			<component-prop id="prop-icon-end">
				<template #name>
					iconEnd
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>An icon to display at the start of a button.</p>

				<p>
					The icon is implemented using <code>&lt;component :is=&quot;...&quot;&gt;</code>, allowing the button to use icons it doesn't explicitly import. To be used in this way, the icon must be globally registered. You can find
					<router-link v-bind="{ to: 'icons' }">
						the list of available icons in this project
					</router-link>,
					or you can use one that is globally registered in your project.
				</p>

				<p><em>Note that <code>start</code> and <code>end</code> depend on the current document direction.</em></p>
			</component-prop>

			<component-prop id="prop-icon-only">
				<template #name>
					iconOnly
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					false
				</template>

				<p>Whether to only show an icon (and not the associated text). If true, the text is hidden via an <code>sr-only</code> class, so is still accessible to screen readers and therefore important. The displayed icon is also shown at <code>1em</code> size when alone, to better fill the button.</p>
			</component-prop>

			<component-prop id="prop-reactive">
				<template #name>
					reactive
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					false
				</template>

				<p>When a button is <code>reactive</code>, it will show a loading indicator when activated. This can be deactivated via the exposed <code>reset</code> method.</p>
			</component-prop>

			<component-prop id="prop-icon-classes">
				<template #name>
					iconClasses
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>Any classes to add to the icon itself. If a size class is added (<code>size-</code>), the default size class will not be included.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The default slot contains the content to display in the button.</p>
			</component-slot>

			<component-slot id="slot-loading-label">
				<template #name>
					loading-label
				</template>

				<template #default-value>
					Loading
				</template>

				<p>The text to show to screen-reader users when this button is in its <code>reactive</code> state.</p>
			</component-slot>
		</component-slots>

		<component-events>
			<component-event id="event-click">
				<template #name>
					click
				</template>

				<p>Emitted when the button is clicked or activated via keyboard.</p>
			</component-event>
		</component-events>

		<component-methods>
			<component-method id="method-reset">
				<template #name>
					<code>reset</code>
				</template>

				<p>Reset the reactive state of a reactive button.</p>
			</component-method>
		</component-methods>

		<component-playgrounds>
			<playground-ui-button />
			<playground-ui-button-icon />
			<playground-ui-button-reactive />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundUiButton from "./fragments/playground-ui-button.vue";
import PlaygroundUiButtonIcon from "./fragments/playground-ui-button-icon.vue";
import PlaygroundUiButtonReactive from "./fragments/playground-ui-button-reactive.vue";
</script>
