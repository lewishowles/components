<template>
	<component-page>
		<template #title>
			Pill badge
		</template>

		<template #introduction>
			<p>The <code>pill-badge</code> is great for showing statuses or changes in data.</p>
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

				<p>An icon to display at the start of a badge.</p>

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

				<p>An icon to display at the of a badge.</p>

				<p>
					The icon is implemented using <code>&lt;component :is=&quot;...&quot;&gt;</code>, allowing the button to use icons it doesn't explicitly import. To be used in this way, the icon must be globally registered. You can find
					<router-link v-bind="{ to: 'icons' }">
						the list of available icons in this project
					</router-link>,
					or you can use one that is globally registered in your project.
				</p>

				<p><em>Note that <code>start</code> and <code>end</code> depend on the current document direction.</em></p>
			</component-prop>

			<component-prop id="prop-colour">
				<template #name>
					colour
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>
					The colour of this badge, one of <code>grey</code>, <code>red</code>, <code>orange</code>, <code>yellow</code>, <code>green</code>, <code>teal</code>, <code>blue</code>, <code>indigo</code>, <code>purple</code>, <code>pink</code>
				</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The default slot contains the text of the label.</p>
			</component-slot>
		</component-slots>

		<component-playgrounds>
			<playground-pill-badge />
			<playground-pill-badge-icon />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundPillBadge from "./fragments/playground-pill-badge.vue";
import PlaygroundPillBadgeIcon from "./fragments/playground-pill-badge-icon.vue";
</script>
