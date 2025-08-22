<template>
	<component-page>
		<template #title>
			User avatars
		</template>

		<template #introduction>
			<p><code>user-avatars</code> displays a list of provided avatars, with additional information such as their name or initials as provided.</p>
		</template>

		<component-props>
			<component-prop id="prop-users">
				<template #name>
					users
				</template>

				<template #type>
					Array
				</template>

				<template #default-value>
					[]
				</template>

				<p>The list of users to display. By default, the format of provided users should be as follows:</p>

				<code-block>[{ name: &quot;Sophie Wardhaugh&quot;, initials: &quot;SW&quot;, avatar: &quot;/absolute/path/to/avatar&quot; }]</code-block>

				<p>Any of the information can be omitted, and the component will do its best to compensate.</p>

				<ul>
					<li>If no name is provided, the tooltip will show the initials.</li>
					<li>If no initials are provided, they will be generated from the name.</li>
					<li>If no avatar is provided, the initials will be shown.</li>
					<li>Without a name or initials, no tooltip is included.</li>
					<li>If an avatar is provided, but fails to load, the user will fall back to the initials if possible.</li>
				</ul>
			</component-prop>

			<component-prop id="prop-limit">
				<template #name>
					limit
				</template>

				<template #type>
					Number
				</template>

				<template #default-value>
					null
				</template>

				<p>The maximum number of avatars to display. Any additional will contribute to a "+X" last item.</p>
			</component-prop>

			<component-prop id="prop-shape">
				<template #name>
					shape
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					round
				</template>

				<p>The shape of avatars to display. Available values include &quot;round&quot;, &quot;square&quot;, and &quot;squircle&quot; (or &quot;roundangle&quot;). Anything else will default to &quot;round&quot;.</p>
			</component-prop>

			<component-prop id="prop-size">
				<template #name>
					size
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					size-10
				</template>

				<p>The size of the avatars to display, based on Tailwind size classes.</p>
			</component-prop>

			<component-prop id="prop-overlap">
				<template #name>
					overlap
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					null
				</template>

				<p>Whether avatars should overlap. If they do, they're given an outline so that the images don't clash.</p>
				<p>Overlap is true by default for &quot;circle&quot; avatars, and false by default for &quot;square&quot; and &quot;squircle&quot;, but a value provided here will take precedence.</p>
			</component-prop>

			<component-prop id="prop-initials-colour-classes">
				<template #name>
					initialsColourClasses
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200
				</template>

				<p>The colour classes to apply when displaying initials.</p>
			</component-prop>

			<component-prop id="prop-initials-outline-classes">
				<template #name>
					initialsOutlineClasses
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					outline-white dark:outline-purple-200
				</template>

				<p>The colour classes to apply when displaying initials.</p>
			</component-prop>
		</component-props>

		<component-playgrounds>
			<playground-user-avatars />
			<playground-user-avatars-no-images />
			<playground-user-avatars-limit />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundUserAvatars from "./fragments/playground-user-avatars.vue";
import PlaygroundUserAvatarsNoImages from "./fragments/playground-user-avatars-no-images.vue";
import PlaygroundUserAvatarsLimit from "./fragments/playground-user-avatars-limit.vue";
</script>
