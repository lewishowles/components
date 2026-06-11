<template>
	<component-page>
		<template #title>Notification handler</template>

		<template #introduction>
			<p>
				<code>notification-handler</code>
				displays and allows an end-user to manage notifications. Notification data is managed via
				<code>useNotifications()</code>
				— a module-scoped composable that acts as the shared registry for the application.
			</p>
			<p>
				<link-tag
					href="https://lewishowles.notion.site/Notification-handler-1b92b9e312118050bb76d8d9200d50a8"
					:external="true"
				>
					Learn more about the planning of this component
				</link-tag>
				and the decisions made in Notion.
			</p>
		</template>

		<component-props>
			<component-prop id="prop-locale">
				<template #name>locale</template>

				<template #type>String</template>

				<template #default-value>null</template>

				<p>
					The locale to use when displaying dates. To reset to the user's locale settings, set the
					locale to undefined.
				</p>
			</component-prop>

			<component-prop id="prop-date-format">
				<template #name>dateFormat</template>

				<template #type>Object</template>

				<template #default-value>{ year: "numeric", day: "numeric", month: "long" }</template>

				<p>
					The date format to use in the display of the date. To reset to the user's locale settings,
					set the format to null.
				</p>
			</component-prop>

			<component-prop id="prop-align">
				<template #name>align</template>

				<template #type>String</template>

				<template #default-value>end</template>

				<p>
					The alignment of the pop up notifications panel. Anything but
					<code>start</code>
					will be treated as
					<code>end</code>
					.
				</p>
			</component-prop>

			<component-prop id="prop-allow-mark-all-read">
				<template #name>allowMarkAllRead</template>

				<template #type>Boolean</template>

				<template #default-value>true</template>

				<p>
					Whether to display the “Mark all read” button. Deactivating means the user will be
					required to mark notifications as read individually.
				</p>
			</component-prop>

			<component-prop id="prop-allow-reload">
				<template #name>allowReload</template>

				<template #type>Boolean</template>

				<template #default-value>true</template>

				<p>
					Whether to display the “Reload” button. Deactivating means new notifications will only be
					shown when something triggers a re-load in the parent component.
				</p>
			</component-prop>

			<component-prop id="prop-loading">
				<template #name>loading</template>

				<template #type>Boolean</template>

				<template #default-value>false</template>

				<p>
					Whether the notifications are currently loading (or re-loading). This will show a loading
					indicator to the user to provide feedback.
				</p>
			</component-prop>

			<component-prop id="prop-hide-notifications-when-read">
				<template #name>hideNotificationsWhenRead</template>

				<template #type>Boolean</template>

				<template #default-value>false</template>

				<p>
					Whether to hide notifications when they are marked as read. If false, notifications will
					remain, but will appear less prominent. If true, any notifications that are already read
					when initialised will not be shown.
				</p>
			</component-prop>

			<component-prop id="prop-read-notification-count">
				<template #name>readNotificationCount</template>

				<template #type>Number</template>

				<template #default-value>null</template>

				<p>
					The number of read notifications to display at maximum. Unread notifications are always
					shown.
				</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-notification-read-template">
				<template #name>notification-read-template</template>

				<p>
					A general slot to allow custom designs for notifications marked as
					<code>{ read: true }</code>
					(where
					<code>hideNotificationsWhenRead</code>
					is
					<code>false</code>
					).
				</p>

				<table>
					<thead>
						<tr>
							<th>Slot prop</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>notification</code></td>
							<td><code>object</code></td>
							<td>The notification details, as provided to the component</td>
						</tr>
					</tbody>
				</table>
			</component-slot>

			<component-slot id="slot-notification-unread-template">
				<template #name>notification-unread-template</template>

				<p>
					A general slot to allow custom designs for notifications marked as
					<code>{ read: false }</code>
					.
				</p>

				<table>
					<thead>
						<tr>
							<th>Slot prop</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>notification</code></td>
							<td><code>object</code></td>
							<td>The notification details, as provided to the component</td>
						</tr>
						<tr>
							<td><code>markNotificationRead</code></td>
							<td><code>function</code></td>
							<td>
								Mark the notification read, as if the user had pressed the &quot;Mark read&quot;
								button
							</td>
						</tr>
					</tbody>
				</table>
			</component-slot>

			<component-slot id="slot-notification-type-template">
				<template #name>notification-&lt;type&gt;-template</template>

				<p>
					A general slot to allow custom designs for notifications of a given
					<code>&lt;type&gt;</code>
					(one of
					<code>danger</code>
					,
					<code>warning</code>
					, and
					<code>info</code>
					). Takes precedence over the
					<code>notification-read</code>
					and
					<code>notification-unread</code>
					slots.
				</p>

				<table>
					<thead>
						<tr>
							<th>Slot prop</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>notification</code></td>
							<td><code>object</code></td>
							<td>The notification details, as provided to the component</td>
						</tr>
						<tr>
							<td><code>markNotificationRead</code></td>
							<td><code>function</code></td>
							<td>
								Mark the notification read, as if the user had pressed the &quot;Mark read&quot;
								button
							</td>
						</tr>
					</tbody>
				</table>
			</component-slot>

			<component-slot id="slot-notification-pinned-template">
				<template #name>notification-pinned-template</template>

				<p>
					A general slot to allow custom designs for notifications that are
					<code>{ pinned: true }</code>
					. Takes precedence over the
					<code>notification-read</code>
					,
					<code>notification-unread</code>
					and
					<code>notification-&lt;type&gt;</code>
					slots.
				</p>

				<table>
					<thead>
						<tr>
							<th>Slot prop</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>notification</code></td>
							<td><code>object</code></td>
							<td>The notification details, as provided to the component</td>
						</tr>
						<tr>
							<td><code>markNotificationRead</code></td>
							<td><code>function</code></td>
							<td>
								Mark the notification read, as if the user had pressed the &quot;Mark read&quot;
								button
							</td>
						</tr>
					</tbody>
				</table>
			</component-slot>

			<component-slot id="slot-notification-id-template">
				<template #name>notification-&lt;id&gt;-template</template>

				<p>
					A general slot to allow custom designs for notifications that are
					<code>{ pinned: true }</code>
					. Takes precedence over the
					<code>notification-read</code>
					,
					<code>notification-unread</code>
					and
					<code>notification-&lt;type&gt;</code>
					slots.
				</p>

				<table>
					<thead>
						<tr>
							<th>Slot prop</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>notification</code></td>
							<td><code>object</code></td>
							<td>The notification details, as provided to the component</td>
						</tr>
						<tr>
							<td><code>markNotificationRead</code></td>
							<td><code>function</code></td>
							<td>
								Mark the notification read, as if the user had pressed the &quot;Mark read&quot;
								button
							</td>
						</tr>
					</tbody>
				</table>
			</component-slot>

			<component-slot id="slot-notification-actions">
				<template #name>notification-actions</template>

				<p>
					A slot intended to allow actions to be added to individual notifications as required. The
					contents of this slot appear
					<em>after</em>
					any &quot;Mark as read&quot; and &quot;View more&quot; actions.
				</p>

				<table>
					<thead>
						<tr>
							<th>Slot prop</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>notification</code></td>
							<td><code>object</code></td>
							<td>The notification details, as provided to the component</td>
						</tr>
					</tbody>
				</table>
			</component-slot>

			<component-slot id="slot-show-notifications-label">
				<template #name>show-notifications-label</template>

				<template #default-value>Show notifications</template>

				<p>
					The label to use for the button that opens the notifications panel. This label is hidden
					from view, but is required for accessibility purposes.
				</p>
			</component-slot>

			<component-slot id="slot-no-notifications-label">
				<template #name>no-notifications-label</template>

				<template #default-value>No new notifications</template>

				<p>
					The text to show when no notifications are being displayed, either because none were
					provided, none were viable, or all notification have been marked as read and should not be
					shown.
				</p>
			</component-slot>

			<component-slot id="slot-mark-all-read-label">
				<template #name>mark-all-read-label</template>

				<template #default-value>Mark all notifications read</template>

				<p>The label to use for the button that marks all unread notifications read.</p>
			</component-slot>

			<component-slot id="slot-reload-label">
				<template #name>reload-label</template>

				<template #default-value>Reload notifications</template>

				<p>The label to use for the button that attempts to re-load notifications.</p>
			</component-slot>

			<component-slot id="slot-loading-label">
				<template #name>loading-label</template>

				<template #default-value>Loading notifications</template>

				<p>The label to use when the loading indicator is shown.</p>
			</component-slot>

			<component-slot id="slot-mark-read-label">
				<template #name>mark-read-label</template>

				<template #default-value>Mark read</template>

				<p>The label to use for the button that marks an individual notification as read.</p>
			</component-slot>

			<component-slot id="slot-view-more-label">
				<template #name>view-more-label</template>

				<template #default-value>View more</template>

				<p>
					The label to use for the button the link to view more information, if a notification has
					an associated URL.
				</p>
			</component-slot>
		</component-slots>

		<component-events>
			<component-event id="event-notifications-reload">
				<template #name>notifications:reload</template>

				<p>
					The user has requested that the notifications be reloaded. A loading indicator is not
					automatically shown to the user, to allow for the consuming component to better control
					the interaction, and should be displayed via the loading prop.
				</p>
			</component-event>
		</component-events>

		<component-methods>
			<component-method id="expose-notifications">
				<template #name>
					<code>notifications</code>
				</template>

				<p>
					A reactive list of the filtered notifications currently being displayed. Accessible via a
					<code>ref</code>
					on the component.
				</p>
			</component-method>

			<component-method id="expose-unread-count">
				<template #name>
					<code>unreadCount</code>
				</template>

				<p>
					A reactive number reflecting how many notifications are currently unread. Accessible via a
					<code>ref</code>
					on the component.
				</p>
			</component-method>

			<component-method id="expose-mark-all-read">
				<template #name>
					<code>markAllRead</code>
				</template>

				<p>
					Mark all unread notifications as read, mirroring the "Mark all notifications read" button.
					Accessible via a
					<code>ref</code>
					on the component.
				</p>
			</component-method>
		</component-methods>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="notification-handler"</template>
				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-list">
				<template #attribute>data-part="list"</template>
				<p>The notifications list container.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-notification-handler />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundNotificationHandler from "./fragments/playground-notification-handler.vue";
</script>
