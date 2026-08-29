<template>
	<component-page>
		<template #title>Form screen</template>

		<template #introduction>
			<p>
				<code>form-screen</code>
				groups the fields and other content for one screen in a
				<code>form-flow</code>
				. The flow renders only the active screen.
			</p>

			<p>
				A screen can be nested at any depth in the flow's slot tree. Keep its
				<code>id</code>
				unchanged while it is part of the flow.
			</p>

			<p>
				A screen is marked complete after Continue succeeds or it progresses automatically. Going
				Back keeps that state, while changing an earlier completed screen marks it and every
				following screen incomplete.
			</p>

			<p>
				Screens removed by conditional rendering are left out of progress and review until they
				return. With
				<code>enable-review</code>
				on
				<code>form-flow</code>
				, review uses each screen's
				<code>label</code>
				or
				<code>title</code>
				as its heading.
			</p>
		</template>

		<component-props>
			<component-prop id="prop-id">
				<template #name>id</template>
				<template #type>String</template>
				<template #required>yes</template>

				<p>Stable unique identifier used to register the screen with its form-flow.</p>
			</component-prop>

			<component-prop id="prop-auto-advance">
				<template #name>autoAdvance</template>
				<template #type>String</template>
				<template #default-value>undefined</template>

				<p>
					If a field name is provided, the screen automatically advances when that field's value
					changes and successfully validates. Initial model data and programmatic updates do not
					trigger this progression.
				</p>
			</component-prop>

			<component-prop id="prop-auto-focus">
				<template #name>autoFocus</template>
				<template #type>String</template>
				<template #default-value>undefined</template>

				<p>
					If a field name is provided, that field is focused when the screen becomes active. The
					error summary receives focus first if it is showing. Otherwise, the named field receives
					focus if it is registered. If not, the screen title receives focus.
				</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-title">
				<template #name>title</template>

				<p>The heading for this screen.</p>
			</component-slot>

			<component-slot id="slot-introduction">
				<template #name>introduction</template>

				<p>Optional introductory content.</p>
			</component-slot>

			<component-slot id="slot-label">
				<template #name>label</template>

				<p>
					The concise label used in progress displays and answer summaries. It falls back to the
					<code>title</code>
					slot.
				</p>
			</component-slot>

			<component-slot id="slot-default">
				<template #name>default</template>

				<p>Fields and other content shown while the screen is active.</p>
			</component-slot>
		</component-slots>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="form-screen"</template>

				<p>Present on the active root element. Use it to scope styles to this component.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-screen-id">
				<template #attribute>data-screen-id</template>

				<p>Present on the active root element with the registered screen ID.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-title">
				<template #attribute>data-part="title"</template>

				<p>Present on the screen title heading.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-introduction">
				<template #attribute>data-part="introduction"</template>

				<p>Present on the optional introductory paragraph.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-form-screen />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundFormScreen from "./fragments/playground-form-screen.vue";
</script>
