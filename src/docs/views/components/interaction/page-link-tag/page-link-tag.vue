<template>
	<component-page>
		<template #title>
			Link tag
		</template>

		<template #introduction>
			<p><code>link-tag</code> is an extension of a standard anchor.</p>
		</template>

		<component-props>
			<component-prop id="prop-href">
				<template #name>
					href
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>The destination for this link.</p>
			</component-prop>

			<component-prop id="prop-external">
				<template #name>
					external
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					false
				</template>

				<p>Whether this is an external link. If so, <code>target=&quot;_blank&quot;</code> is added and an appropriate external icon is shown at the end of the link.</p>
			</component-prop>

			<component-prop id="prop-show-external-icon">
				<template #name>
					showExternalIcon
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					false
				</template>

				<p>When <code>external</code> is true, but an external icon is not desired, <code>showExternalIcon</code> can be set to false.</p>
				<p><em>Note that if a link is <code>external</code>, <code>showExternalIcon</code> is true, and <code>iconEnd</code> is defined, the external icon takes precedence.</em></p>
			</component-prop>

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

				<p>An icon to display at the start of a link.</p>

				<p>
					The icon is implemented using <code>&lt;component :is=&quot;...&quot;&gt;</code>, allowing the link to use icons it doesn't explicitly import. To be used in this way, the icon must be globally registered. You can find
					<router-link v-bind="{ to: '/icons' }">
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

				<p>An icon to display at the end of a link.</p>

				<p>
					The icon is implemented using <code>&lt;component :is=&quot;...&quot;&gt;</code>, allowing the link to use icons it doesn't explicitly import. To be used in this way, the icon must be globally registered. You can find
					<router-link v-bind="{ to: '/icons' }">
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

				<p>Whether to only show an icon (and not the associated text). If true, the text is hidden via an <code>sr-only</code> class, so is still accessible to screen readers and therefore important. The displayed icon is also shown at <code>1em</code> size when alone, to better fill the link.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The default slot contains the content to display in the link.</p>
			</component-slot>
		</component-slots>

		<component-playgrounds>
			<playground-link-tag />
			<playground-link-tag-external />
			<playground-link-tag-icon-start />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundLinkTag from "./fragments/playground-link-tag.vue";
import PlaygroundLinkTagExternal from "./fragments/playground-link-tag-external.vue";
import PlaygroundLinkTagIconStart from "./fragments/playground-link-tag-icon-start.vue";
</script>
