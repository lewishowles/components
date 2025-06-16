<template>
	<component-page>
		<template #title>
			Image tag
		</template>

		<template #introduction>
			<p>Display an image with automatic fallback where an image doesn't load.</p>
		</template>

		<component-props>
			<component-prop id="prop-src">
				<template #name>
					src
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>The URL to the image, which is applied directly to the underlying <code>img</code> tag.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-fallback">
				<template #name>
					fallback
				</template>

				<p>A slot provided to override the default fallback image.</p>
			</component-slot>
		</component-slots>

		<component-events>
			<component-event id="event-error">
				<template #name>
					error
				</template>

				<p>Fired when an image load error occurs, and the <code>image-tag</code> would be showing the fallback.</p>
			</component-event>
		</component-events>

		<component-playgrounds>
			<playground-image-tag />
			<playground-image-tag-fallback />
			<playground-image-tag-custom-fallback />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundImageTag from "./fragments/playground-image-tag.vue";
import PlaygroundImageTagFallback from "./fragments/playground-image-tag-fallback.vue";
import PlaygroundImageTagCustomFallback from "./fragments/playground-image-tag-custom-fallback.vue";
</script>
