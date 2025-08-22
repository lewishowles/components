<template>
	<component-page>
		<template #title>
			Star rating
		</template>

		<template #introduction>
			<p><code>star-rating</code> offers two optional, mutually inclusive options. Users can either select a rating (out of 5), or view the current aggregate rating. <code>star-rating</code> is an extension of <code>form-field[type=&quot;radio&quot;]</code> (and thus <code>form-radio-group</code>).</p>
		</template>

		<component-props>
			<component-prop id="prop-name">
				<template #name>
					name
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>A name for this rating group. If not set, the input ID is used.</p>
			</component-prop>

			<component-prop id="prop-id">
				<template #name>
					id
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>Any ID to apply to this field. If an ID is not provided, one will be generated at random. Note that when providing an ID, please make sure that it is unique to avoid any unforeseen issues.</p>
			</component-prop>

			<component-prop id="prop-read-only">
				<template #name>
					readOnly
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					false
				</template>

				<p>Whether to allow the user to choose a rating. If false, this component can just be used to display a current rating, or activated based on some other change, such as an edit.</p>
			</component-prop>

			<component-prop id="prop-shape">
				<template #name>
					shape
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					star
				</template>

				<p>One of <code>star</code> or <code>heart</code>. Defaults to <code>star</code> if the shape is unrecognised.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The default slot contains the label of the field.</p>
				<p><em>Note that a label is always required, even if a label is not shown to the user, as it will be critical for screen readers. This component will show an error if no label is provided.</em></p>
			</component-slot>

			<component-slot id="slot-current-rating">
				<template #name>
					current-rating
				</template>

				<p>A space to place additional text to display the current average rating, for example "4.5/5 based on 300 reviews".</p>
			</component-slot>

			<component-slot id="slot-introduction">
				<template #name>
					introduction
				</template>

				<p>Any additional text to introduce the options, which appears between the label and options.</p>
			</component-slot>

			<component-slot id="slot-error">
				<template #name>
					error
				</template>

				<p>Any error text to display below the field.</p>
			</component-slot>

			<component-slot id="slot-help">
				<template #name>
					help
				</template>

				<p>Any help text to display below the field.</p>
			</component-slot>
		</component-slots>

		<component-playgrounds>
			<playground-star-rating />
			<playground-star-rating-current-rating />
			<playground-star-rating-read-only />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundStarRating from "./fragments/playground-star-rating.vue";
import PlaygroundStarRatingCurrentRating from "./fragments/playground-star-rating-current-rating.vue";
import PlaygroundStarRatingReadOnly from "./fragments/playground-star-rating-read-only.vue";
</script>
