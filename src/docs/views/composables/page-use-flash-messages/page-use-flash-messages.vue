<template>
	<component-page>
		<template #title>useFlashMessages</template>

		<template #introduction>
			<p>
				<code>useFlashMessages</code>
				provides shared flash-message state for messages that should appear somewhere else in the
				page after an action completes.
			</p>

			<p>
				Messages are shown by
				<router-link v-bind="{ to: '/content/flash-messages' }">
					<code>flash-messages</code>
				</router-link>
				. Pass a
				<code>namespace</code>
				when the message should appear in a specific outlet, or omit it for page-level messages.
			</p>
		</template>

		<component-methods>
			<component-method id="method-send-message">
				<template #name>
					<code>sendMessage(message)</code>
				</template>

				<p>
					Add a message. The message should include
					<code>type</code>
					,
					<code>title</code>
					, and
					<code>message</code>
					. It may also include
					<code>namespace</code>
					,
					<code>showIcon</code>
					,
					<code>live</code>
					, and
					<code>titleTag</code>
					. A unique
					<code>id</code>
					is added when the message is stored.
				</p>
			</component-method>

			<component-method id="method-get-messages">
				<template #name>
					<code>getMessages(namespace?)</code>
				</template>

				<p>
					Get messages for a namespace. When no namespace is provided, only messages without a
					namespace are returned.
				</p>
			</component-method>

			<component-method id="method-clear-messages">
				<template #name>
					<code>clearMessages(namespace?)</code>
				</template>

				<p>
					Clear messages for a namespace. When no namespace is provided, only messages without a
					namespace are cleared.
				</p>
			</component-method>

			<component-method id="method-clear-all-messages">
				<template #name>
					<code>_clearMessages()</code>
				</template>

				<p>
					Remove every flash message. Intended for internal and testing use only—it clears messages
					requested by any component.
				</p>
			</component-method>
		</component-methods>
	</component-page>
</template>
