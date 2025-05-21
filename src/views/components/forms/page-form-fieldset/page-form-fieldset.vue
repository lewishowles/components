<template>
	<div class="prose prose-slate dark:prose-invert *:animate-fade-in *:delay">
		<h1>Form fieldset</h1>

		<p>A fieldset represents a group of fields, containing a title and optional, but preferred, introduction.</p>

		<p>When deciding whether to group fields, ideally if some fields are grouped, all should be, otherwise the form could look incomplete.</p>
	</div>

	<tab-group class="mt-10">
		<tab-item v-bind="{ id: 'tab-props', icon: 'icon-object' }" class="pt-8">
			<template #label>
				Props
			</template>

			<div class="prose dark:prose-invert *:animate-fade-in *:delay">
				<h2>Props</h2>

				<ol class="font-mono">
					<li><a href="#prop-heading-level">headingLevel</a></li>
				</ol>

				<prop-title id="prop-heading-level">
					<template #title>
						headingLevel
					</template>

					<template #type>
						String
					</template>

					<template #default>
						h2
					</template>
				</prop-title>

				<p>
					The heading level to use for this fieldset.
				</p>
			</div>
		</tab-item>

		<tab-item v-bind="{ id: 'tab-slots', icon: 'icon-slot' }" class="pt-8">
			<template #label>
				Slots
			</template>

			<div class="prose dark:prose-invert">
				<h2>Slots</h2>

				<prop-title id="slot-title">
					<template #title>
						title
					</template>
				</prop-title>

				<p>The title of this section, outlining the purpose of the grouping.</p>

				<prop-title id="slot-introduction">
					<template #title>
						introduction
					</template>
				</prop-title>

				<p>Any additional information relating to this group of fields.</p>

				<prop-title id="slot-default">
					<template #title>
						default
					</template>
				</prop-title>

				<p>The content of the fieldset, which will be wrapped in a <code><router-link v-bind="{ to: '/forms/form-layout' }">form-layout</router-link></code> component.</p>
			</div>
		</tab-item>

		<tab-item v-bind="{ id: 'tab-playground', icon: 'icon-code' }" class="pt-8">
			<template #label>
				Playground
			</template>

			<div class="flex flex-col gap-8">
				<div class="prose dark:prose-invert">
					<h2>Playground</h2>

					<ol>
						<li><a href="#playground-form-fieldset">Fieldset</a></li>
					</ol>
				</div>

				<playground-form-fieldset />
			</div>
		</tab-item>
	</tab-group>
</template>

<script setup>
import PlaygroundFormFieldset from "./fragments/playground-form-fieldset.vue";
</script>
