<template>
	<component-page>
		<template #title>UI button</template>

		<template #introduction>
			<p>
				<code>ui-button</code>
				is an extension of the standard
				<code>button</code>
				element.
			</p>
		</template>

		<component-props>
			<component-prop id="prop-icon-start">
				<template #name>iconStart</template>

				<template #type>String</template>

				<template #default-value>null</template>

				<p>An icon to display at the start of a button.</p>

				<p>
					The icon is implemented using
					<code>&lt;component :is=&quot;...&quot;&gt;</code>
					, allowing the button to use icons it doesn't explicitly import. To be used in this way,
					the icon must be globally registered. You can find
					<router-link v-bind="{ to: 'icons' }">
						the list of available icons in this project
					</router-link>
					, or you can use one that is globally registered in your project.
				</p>

				<p>
					<em>
						Note that
						<code>start</code>
						and
						<code>end</code>
						depend on the current document direction.
					</em>
				</p>
			</component-prop>

			<component-prop id="prop-icon-end">
				<template #name>iconEnd</template>

				<template #type>String</template>

				<template #default-value>null</template>

				<p>An icon to display at the start of a button.</p>

				<p>
					The icon is implemented using
					<code>&lt;component :is=&quot;...&quot;&gt;</code>
					, allowing the button to use icons it doesn't explicitly import. To be used in this way,
					the icon must be globally registered. You can find
					<router-link v-bind="{ to: 'icons' }">
						the list of available icons in this project
					</router-link>
					, or you can use one that is globally registered in your project.
				</p>

				<p>
					<em>
						Note that
						<code>start</code>
						and
						<code>end</code>
						depend on the current document direction.
					</em>
				</p>
			</component-prop>

			<component-prop id="prop-icon-only">
				<template #name>iconOnly</template>

				<template #type>Boolean</template>

				<template #default-value>false</template>

				<p>
					Whether to only show an icon (and not the associated text). If true, the text is hidden
					via an
					<code>sr-only</code>
					class, so is still accessible to screen readers and therefore important. The displayed
					icon is also shown at
					<code>1em</code>
					size when alone, to better fill the button.
				</p>
			</component-prop>

			<component-prop id="prop-reactive">
				<template #name>reactive</template>

				<template #type>Boolean</template>

				<template #default-value>false</template>

				<p>
					When a button is
					<code>reactive</code>
					, it will show a loading indicator when activated. This can be deactivated via the exposed
					<code>reset</code>
					method.
				</p>
			</component-prop>

			<component-prop id="prop-loading-auto">
				<template #name>loadingAuto</template>

				<template #type>Boolean</template>

				<template #default-value>true</template>

				<p>
					When true, the button detects a Promise returned by the click listener and automatically
					enters its loading state, resetting when the Promise settles. Async functions return a
					Promise implicitly, so
					<code>@click="asyncFn"</code>
					works without any wrapping.
				</p>
			</component-prop>

			<component-prop id="prop-pressed">
				<template #name>pressed</template>

				<template #type>Boolean | null</template>

				<template #default-value>null</template>

				<p>
					The pressed state of this button, for toggle buttons. When
					<code>true</code>
					or
					<code>false</code>
					,
					<code>aria-pressed</code>
					is set accordingly. When
					<code>null</code>
					(default),
					<code>aria-pressed</code>
					is not set and the button behaves as a normal action button.
				</p>

				<p>
					This is a controlled prop — the consumer owns the state and passes it in. That matters
					because toggle actions are often async (a mute request might fail), and
					<code>aria-pressed</code>
					must reflect actual truth, not an optimistic flip.
				</p>

				<p>
					The visible label must remain stable across pressed and unpressed states;
					<code>aria-pressed</code>
					alone conveys the state change to screen reader users.
				</p>
			</component-prop>

			<component-prop id="prop-icon-classes">
				<template #name>iconClasses</template>

				<template #type>Vue class binding</template>

				<template #default-value>null</template>

				<p>
					Additional classes to apply to the icon, merged on top of the base styles (stroke,
					alignment, and size). Any provided classes that conflict with base classes will override
					as necessary.
				</p>
			</component-prop>

			<component-prop id="prop-disabled">
				<template #name>disabled</template>

				<template #type>Boolean</template>

				<template #default-value>false</template>

				<p>
					Whether this button is disabled. Rather than using the native
					<code>disabled</code>
					attribute, which removes the button from the tab order entirely, this prop sets
					<code>aria-disabled="true"</code>
					and swallows click events. The button remains focusable, so keyboard and screen reader
					users can still encounter it and understand that the action is currently unavailable.
				</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>default</template>

				<p>The default slot contains the content to display in the button.</p>
			</component-slot>

			<component-slot id="slot-loading-label">
				<template #name>loading-label</template>

				<template #default-value>Loading</template>

				<p>
					The text announced to screen readers when the button is in its loading state. Populates a
					live region inside the button, so it is read aloud when the button becomes busy.
				</p>
			</component-slot>
		</component-slots>

		<component-events>
			<component-event id="event-click">
				<template #name>click</template>

				<p>Emitted when the button is clicked or activated via keyboard.</p>
			</component-event>
		</component-events>

		<component-methods>
			<component-method id="method-react">
				<template #name>
					<code>react</code>
				</template>

				<p>
					Show the "reacting" state, as though someone had clicked the button. This is helpful if
					another element performs the same action as the button might, but you still want to show
					feedback to the user.
				</p>
			</component-method>

			<component-method id="method-reset">
				<template #name>
					<code>reset</code>
				</template>

				<p>Reset the reactive state of a reactive button.</p>
			</component-method>
		</component-methods>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="ui-button"</template>
				<p>
					Present on the root
					<code>&lt;button&gt;</code>
					element. Use to scope styles to this component.
				</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-icon-start">
				<template #attribute>data-part="icon-start"</template>
				<p>
					The icon rendered before the label, when
					<code>iconStart</code>
					is set.
				</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-label">
				<template #attribute>data-part="label"</template>
				<p>The label wrapper. Hidden visually when the button is reacting.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-loading">
				<template #attribute>data-part="loading"</template>
				<p>The loading spinner overlay, shown when the button is in its reacting state.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-icon-end">
				<template #attribute>data-part="icon-end"</template>
				<p>
					The icon rendered after the label, when
					<code>iconEnd</code>
					is set.
				</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-disabled">
				<template #attribute>data-disabled</template>
				<p>Present on the root element when the button is disabled.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-reacting">
				<template #attribute>data-reacting</template>
				<p>Present on the root element while the button is showing its loading state.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-ui-button />
			<playground-ui-button-icon />
			<playground-ui-button-icon-only />
			<playground-ui-button-reactive />
			<playground-ui-button-loading-auto />
			<playground-ui-button-trigger-reactive-state />
			<playground-ui-button-pressed />
			<playground-ui-button-full-width />
			<playground-ui-button-disabled />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundUiButton from "./fragments/playground-ui-button.vue";
import PlaygroundUiButtonDisabled from "./fragments/playground-ui-button-disabled.vue";
import PlaygroundUiButtonFullWidth from "./fragments/playground-ui-button-full-width.vue";
import PlaygroundUiButtonLoadingAuto from "./fragments/playground-ui-button-loading-auto.vue";
import PlaygroundUiButtonPressed from "./fragments/playground-ui-button-pressed.vue";
import PlaygroundUiButtonIcon from "./fragments/playground-ui-button-icon.vue";
import PlaygroundUiButtonIconOnly from "./fragments/playground-ui-button-icon-only.vue";
import PlaygroundUiButtonReactive from "./fragments/playground-ui-button-reactive.vue";
import PlaygroundUiButtonTriggerReactiveState from "./fragments/playground-ui-button-trigger-reactive-state.vue";
</script>
