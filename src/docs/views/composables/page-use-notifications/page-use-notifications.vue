<template>
	<component-page>
		<template #title>useNotifications</template>

		<template #introduction>
			<p>
				<code>useNotifications</code>
				provides a module-scoped registry for application notifications. All calls share the same
				state, so notifications added anywhere in the app are visible to every
				<router-link v-bind="{ to: '/messaging/notification-handler' }">
					<code>notification-handler</code>
				</router-link>
				instance.
			</p>

			<p>
				Each notification can declare
				<code>onRead</code>
				and
				<code>onRemove</code>
				callbacks, called automatically when the notification is marked as read or removed, which is
				useful for syncing state with a backend.
			</p>

			<code-block
				:code="`import { useNotifications } from &quot;@lewishowles/components/composables&quot;;`"
			/>
		</template>

		<component-returns>
			<component-return id="return-notifications">
				<template #name>notifications</template>

				<template #type>Ref&lt;object[]&gt;</template>

				<p>The current list of notifications.</p>
			</component-return>
		</component-returns>

		<component-methods>
			<component-method id="method-add">
				<template #name>
					<code>add(notification)</code>
				</template>

				<p>
					Add a notification to the registry.
					<code>message</code>
					is required; all other fields are optional.
				</p>

				<table>
					<thead>
						<tr>
							<th>Field</th>
							<th>Type</th>
							<th>Required</th>
							<th>Purpose</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>id</code></td>
							<td><code>string</code></td>
							<td>No</td>
							<td>Unique identifier. Auto-generated if not provided.</td>
						</tr>
						<tr>
							<td><code>message</code></td>
							<td><code>string</code></td>
							<td>Yes</td>
							<td>The content of the notification.</td>
						</tr>
						<tr>
							<td><code>title</code></td>
							<td><code>string</code></td>
							<td>No</td>
							<td>A title to display with the notification.</td>
						</tr>
						<tr>
							<td><code>type</code></td>
							<td><code>string</code></td>
							<td>No</td>
							<td>
								One of
								<code>danger</code>
								,
								<code>warning</code>
								, or
								<code>info</code>
								. Defaults to
								<code>info</code>
								.
							</td>
						</tr>
						<tr>
							<td><code>date</code></td>
							<td><code>string</code></td>
							<td>No</td>
							<td>
								The date the notification was issued (
								<code>YYYY-MM-DD</code>
								).
							</td>
						</tr>
						<tr>
							<td><code>read</code></td>
							<td><code>boolean</code></td>
							<td>No</td>
							<td>
								Whether the notification has been read. Defaults to
								<code>false</code>
								.
							</td>
						</tr>
						<tr>
							<td><code>pinned</code></td>
							<td><code>boolean</code></td>
							<td>No</td>
							<td>
								Pin the notification to the top of the list. Pinned notifications cannot be marked
								as read.
							</td>
						</tr>
						<tr>
							<td><code>onRead</code></td>
							<td><code>function</code></td>
							<td>No</td>
							<td>
								Called when the notification is marked as read. Useful when syncing state with a
								backend.
							</td>
						</tr>
						<tr>
							<td><code>onRemove</code></td>
							<td><code>function</code></td>
							<td>No</td>
							<td>
								Called when the notification is removed. Useful when syncing state with a backend.
							</td>
						</tr>
					</tbody>
				</table>
			</component-method>

			<component-method id="method-remove">
				<template #name>
					<code>remove(id)</code>
				</template>

				<p>
					Remove a notification by ID. Calls the notification's
					<code>onRemove</code>
					callback if registered.
				</p>
			</component-method>

			<component-method id="method-mark-read">
				<template #name>
					<code>markRead(id)</code>
				</template>

				<p>
					Mark a single notification as read. Calls the notification's
					<code>onRead</code>
					callback if registered.
				</p>
			</component-method>

			<component-method id="method-mark-all-read">
				<template #name>
					<code>markAllRead()</code>
				</template>

				<p>
					Mark all non-pinned, unread notifications as read. Calls each
					<code>onRead</code>
					callback if registered.
				</p>
			</component-method>

			<component-method id="method-clear">
				<template #name>
					<code>clear()</code>
				</template>

				<p>Remove all notifications from the registry.</p>
			</component-method>
		</component-methods>
	</component-page>
</template>
