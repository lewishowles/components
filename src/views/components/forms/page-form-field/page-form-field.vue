<template>
	<div class="prose prose-slate dark:prose-invert">
		<h1>Form field</h1>

		<p>A general form component that can take the place of a text input, select, textarea, and more, providing compatibility with <code>form-wrapper</code>, allowing a form to be built up quickly and simply.</p>
	</div>

	<tab-group class="mt-10" v-bind="{ updateUrl: true }">
		<tab-item v-bind="{ id: 'tab-props', icon: 'icon-object' }">
			<template #label>
				Props
			</template>

			<div class="prose dark:prose-invert">
				<h2>Props</h2>

				<ol class="not-prose font-mono">
					<li><a href="#prop-type">type</a></li>
					<li><a href="#prop-id">id</a></li>
					<li><a href="#prop-name">name</a></li>
					<li><a href="#prop-validation">validation</a></li>
				</ol>

				<prop-title id="prop-type">
					<template #title>
						type
					</template>

					<template #type>
						String
					</template>

					<template #default>
						text
					</template>
				</prop-title>

				<p>The type of field. Known types include:</p>

				<ul>
					<li><code>text</code></li>
					<li><code>email</code></li>
					<li><code>password</code></li>
					<li><code>textarea</code></li>
					<li><code>select</code></li>
					<li><code>checkbox</code></li>
					<li><code>radio-group</code></li>
					<li><code>button-group</code></li>
					<li><code>date</code></li>
				</ul>

				<p>Any unknown type will default to <code>text</code>.</p>

				<prop-title id="prop-id">
					<template #title>
						id
					</template>

					<template #type>
						String
					</template>

					<template #default>
						null
					</template>
				</prop-title>

				<p>Any ID to apply to this field. If an ID is not provided, one will be generated at random. Note that when providing an ID, please make sure that it is unique to avoid any unforeseen issues.</p>

				<prop-title id="prop-name">
					<template #title>
						name
					</template>

					<template #type>
						String
					</template>

					<template #default>
						null
					</template>
				</prop-title>

				<p>
					The name of the field. This is required when used within a <code>form-wrapper</code> component, where it is used as the key for the form's data collection. As such, its uniqueness will be verified by <code>form-wrapper</code> when used together.
				</p>

				<prop-title id="prop-validation">
					<template #title>
						validation
					</template>

					<template #type>
						Array
					</template>

					<template #default>
						[]
					</template>
				</prop-title>

				<p>
					Any validation to apply to the field. This is used with the externally-facing <code>validate</code> function, as well as applying attributes to the field as necessary, such as <code>required</code>.
				</p>

				<p>
					Each entry in validation requires at least a <code>rule</code>, outlining the type of validation, and a <code>message</code>, which is used if validation fails. Available rules and properties include:
				</p>

				<h4 id="validation-required">
					required
				</h4>

				<p>
					Requires a value to be set. Adds the <code>required</code> attribute to the field automatically.
				</p>

				<code-block>[{ rule: "required", message: "Enter your name so we know what to call you" }]</code-block>

				<h4 id="validation-email">
					email
				</h4>

				<p>
					Perform a minimal check to see if the value contains an <code>@</code> symbol. More complex verification isn't really necessary, and the only true way to test an email address is through verification.
				</p>

				<code-block>[{ rule: "email", message: "We need an email address to set up your account" }]</code-block>

				<h4 id="validation-size">
					size
				</h4>

				<p>
					Ensure that the provided value has at least size <code>size</code>. For strings, the number of characters is used, for arrays, the length of the array, for objects, the number of properties, for numbers, the number itself is used, and for numeric strings the integer value of the string is used.
				</p>

				<code-block>[{ rule: "size", size: 11, message: "Your phone number should be 11 digits long" }]</code-block>

				<h4 id="validation-min">
					min
				</h4>

				<p>
					Ensure that the provided value has at least size <code>min</code>. Values are evaluated as in the <code>size</code> rule.
				</p>

				<code-block>[{ rule: "min", min: 11, message: "Your phone number should be at least 11 digits long" }]</code-block>

				<h4 id="validation-max">
					max
				</h4>

				<p>Ensure that the provided value is has at most size <code>max</code>. Values are evaluated as in the <code>size</code> rule.</p>

				<code-block>[{ rule: "max", max: 11, message: "Your phone number should be no more than 11 digits long" }]</code-block>

				<h4 id="validation-max">
					between
				</h4>

				<p>Ensure that the provided value is has between <code>min</code> and <code>max</code> size. Values are evaluated as in the <code>size</code> rule.</p>

				<code-block>[{ rule: "between", min: 5, max: 8, message: "Your post code should be between 5 and 8 characters" }]</code-block>

				<h4 id="validation-in">
					in
				</h4>

				<p>Ensure that the given value is included within <code>options</code>.</p>

				<code-block>[{ rule: "in", options: ["a", "b", "c"], message: "Your choice should be a, b, or c" }]</code-block>

				<h4 id="validation-not-in">
					not_in
				</h4>

				<p>Ensure that the given value is not included within <code>options</code>.</p>

				<code-block>[{ rule: "not_in", options: ["a", "b", "c"], message: "Your choice should not include a, b, or c" }]</code-block>

				<h4 id="validation-regexp">
					regexp
				</h4>

				<p>Ensure that the provided value matches <code>regexp</code>.</p>

				<code-block>[{ rule: "regexp", regexp: /[abc]+/, message: "Your ID should only contain the letters a, b, and c" }]</code-block>

				<h3>Additional props</h3>

				<p>
					Additional props are passed through to the underlying form field. Additional props may be required depending on that field, such as <code>options</code> for <code>radio-group</code>.
				</p>
			</div>
		</tab-item>

		<tab-item v-bind="{ id: 'tab-slots', icon: 'icon-slot' }">
			<template #label>
				Slots
			</template>

			<div class="prose dark:prose-invert">
				<h2>Slots</h2>

				<prop-title id="slot-default">
					<template #title>
						default
					</template>
				</prop-title>

				<p>Passed through to the <code>default</code> slot of the relevant form field, the <code>default</code> slot generally contains the label for the form element.</p>
			</div>
		</tab-item>

		<tab-item v-bind="{ id: 'tab-events', icon: 'icon-megaphone' }">
			<template #label>
				Events
			</template>

			<div class="prose dark:prose-invert">
				<h2>Events</h2>

				<prop-title id="event-vmodel">
					<template #title>
						v-model
					</template>
				</prop-title>

				<p>The current value of the underlying form field will be available via <code>v-model</code>.</p>
			</div>
		</tab-item>

		<tab-item v-bind="{ id: 'tab-playground', icon: 'icon-code' }">
			<template #label>
				Playground
			</template>

			<div class="flex flex-col gap-10">
				<playground-form-field-text />
				<playground-form-field-textarea />
			</div>
		</tab-item>
	</tab-group>
</template>

<script setup>
import PlaygroundFormFieldText from "./fragments/playground-form-field-text.vue";
import PlaygroundFormFieldTextarea from "./fragments/playground-form-field-textarea.vue";
</script>
