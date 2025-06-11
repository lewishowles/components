<template>
	<component-page>
		<template #title>
			Data table
		</template>

		<template #introduction>
			<p><code>data-table</code> can display complex data with minimal effort. From hiding columns to controlling their order, managing data is simple and means that the minimum amount of data manipulation needs to be done beforehand.</p>
			<p>When it comes to whether to format data before passing it to the table, versus formatting it using cell templates, the latter is recommended. If the data is passed to the table in a more raw form, it may be easier for a table to be sortable out of the box (for example, with integers versus formatted currency strings). You then have ultimate control over formatting for each cell, in a way that's more flexible than passing pre-formatted data through.</p>
		</template>

		<component-props>
			<component-prop id="prop-data">
				<template #name>
					data
				</template>

				<template #type>
					Array
				</template>

				<template #default-value>
					[]
				</template>

				<p>An array of objects containing the data to display in the table. Each object represents a single row, containing a key for each column of the table, which itself contains the content for that column.</p>
			</component-prop>

			<component-prop id="prop-columns">
				<template #name>
					columns
				</template>

				<template #type>
					Object
				</template>

				<template #default-value>
					{}
				</template>

				<p>Any additional configuration for columns.</p>

				<p><strong>Note:</strong> Any column without configuration will not be displayed. This is to make it easier to hide unnecessary columns, and to help enforce proper labelling of column data.</p>

				<h4>Available configuration keys</h4>

				<table>
					<thead>
						<tr>
							<th>Key</th>
							<th>Type</th>
							<th>Default</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>label</code></td>
							<td><code>string</code></td>
							<td><code>&quot;&quot;</code></td>
							<td>The label to display in the column header.</td>
						</tr>
						<tr>
							<td><code>hidden</code></td>
							<td><code>boolean</code></td>
							<td><code>false</code></td>
							<td>Whether this column is hidden, allowing hidden columns to be more explicitly defined where helpful.</td>
						</tr>
						<tr>
							<td><code>searchable</code></td>
							<td><code>boolean</code></td>
							<td><code>true</code></td>
							<td>Whether this column is included in searches. If false, search will ignore this column entirely.</td>
						</tr>
						<tr>
							<td><code>sortable</code></td>
							<td><code>boolean</code></td>
							<td><code>true</code></td>
							<td>Whether this column can be sorted.</td>
						</tr>
						<tr>
							<td><code>align</code></td>
							<td><code>string</code></td>
							<td><code>left</code></td>
							<td>The alignment of the column. Anything but &quot;right&quot; will be treated as &quot;left&quot;.</td>
						</tr>
						<tr>
							<td><code>headingClasses</code></td>
							<td><code>string</code></td>
							<td><code>&quot;&quot;</code></td>
							<td>Classes to apply only to this column's heading.</td>
						</tr>
						<tr>
							<td><code>cellClasses</code></td>
							<td><code>string</code></td>
							<td><code>&quot;&quot;</code></td>
							<td>Classes to apply only to this column's cells.</td>
						</tr>
						<tr>
							<td><code>columnClasses</code></td>
							<td><code>string</code></td>
							<td><code>&quot;&quot;</code></td>
							<td>Classes to apply to both this column's heading and cells.</td>
						</tr>
					</tbody>
				</table>
			</component-prop>

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

				<p>A unique name for this table. This will be used to store the user's preferences for how dense the table is, for example. Without a name, this option will not be available. The name will be used directly in <code>localStorage</code>, prefixed with <code>data-table:</code>, so should be safe for users.</p>
			</component-prop>

			<component-prop id="prop-enable-search">
				<template #name>
					enableSearch
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					true
				</template>

				<p>Whether to enable the table search. When enabled, anything typed into the search box will search the text for each cell case-insensitively, and hide any rows where none of the cells match.</p>
			</component-prop>

			<component-prop id="prop-enable-sort">
				<template #name>
					enableSort
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					true
				</template>

				<p>Whether to enable the table sort. When enabled, columns marked as sortable (the default) can be ordered ascending or descending.</p>
			</component-prop>

			<component-prop id="prop-enable-selection">
				<template #name>
					enableSelection
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					false
				</template>

				<p>Whether to enable selection. When enabled, a new column is added to the start of the table to include selection checkboxes, and v-model on the table returns the selected rows' data.</p>
			</component-prop>

			<component-prop id="prop-searchable-content-callback">
				<template #name>
					searchableContentCallback
				</template>

				<template #type>
					Function
				</template>

				<template #default-value>
					null
				</template>

				<p>If defined, this method is called with a <code>columnKey</code> for the current column, and <code>rowData</code> for the current row. This method is called as the table is building up its internal content. If the method returns a string, this is used as the searchable content for that column in that row, <strong>overriding</strong> the content of the cell. If anything else is returned, such as undefined, the original content is used instead.</p>

				<table>
					<thead>
						<tr>
							<th>Parameter</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>columnKey</code></td>
							<td><code>string</code></td>
							<td>The key representing this column, which is provided as part of column configuration.</td>
						</tr>
						<tr>
							<td><code>rowData</code></td>
							<td><code>object</code></td>
							<td>The data for the current row, including all columns.</td>
						</tr>
					</tbody>
				</table>
			</component-prop>

			<component-prop id="prop-sortable-content-callback">
				<template #name>
					sortableContentCallback
				</template>

				<template #type>
					Function
				</template>

				<template #default-value>
					null
				</template>

				<p>If defined, this method is called with a <code>columnKey</code> for the current column, and <code>rowData</code> for the current row. This method is called as the table is building up its internal content. If the method returns a string, this is used as the searchable content for that column in that row, <strong>overriding</strong> the content of the cell. If anything else is returned, such as undefined, the original content is used instead.</p>

				<p>The returned content is used in a <code>sort</code> method, so the returned content should make sense when sorted in that way.</p>

				<table>
					<thead>
						<tr>
							<th>Parameter</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>columnKey</code></td>
							<td><code>string</code></td>
							<td>The key representing this column, which is provided as part of column configuration.</td>
						</tr>
						<tr>
							<td><code>rowData</code></td>
							<td><code>object</code></td>
							<td>The data for the current row, including all columns.</td>
						</tr>
					</tbody>
				</table>
			</component-prop>

			<component-prop id="prop-search-placeholder">
				<template #name>
					searchPlaceholder
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>The placeholder to apply to the search input.</p>
			</component-prop>

			<component-prop id="prop-heading-classes">
				<template #name>
					headingClasses
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>Classes to apply to all headings in the table. Cell padding will always apply.</p>
			</component-prop>

			<component-prop id="prop-cell-classes">
				<template #name>
					cellClasses
				</template>

				<template #type>
					String
				</template>

				<template #default-value>
					null
				</template>

				<p>Classes to apply to all standard cells in the table. Cell padding will always apply.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-table-title">
				<template #name>
					table-title
				</template>

				<p>Any title to display with this table.</p>
			</component-slot>

			<component-slot id="slot-table-introduction">
				<template #name>
					table-introduction
				</template>

				<p>Any introduction to display with this table.</p>
			</component-slot>

			<component-slot id="slot-search-label">
				<template #name>
					search-label
				</template>

				<p>The label to use for the search box.</p>
			</component-slot>

			<component-slot id="slot-reset-search-label">
				<template #name>
					reset-search-label
				</template>

				<template #default-value>
					"Reset search"
				</template>

				<p>The label to use for the "Reset search" button.</p>
			</component-slot>

			<component-slot id="slot-no-data-message">
				<template #name>
					no-data-message
				</template>

				<template #default-value>
					"No data to display."
				</template>

				<p>The message to display when no data could be found for the table.</p>
			</component-slot>

			<component-slot id="slot-no-results-message">
				<template #name>
					no-results-message
				</template>

				<template #default-value>
					"No results could be found for term &lt;span class=&quot;font-bold&quot;&gt;&quot;{{ searchQuery }}&quot;&lt;/span&gt;."
				</template>

				<p>The message to display when no data could be found for the current search term.</p>

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
							<td><code>searchQuery</code></td>
							<td><code>string</code></td>
							<td>The current search query in the table.</td>
						</tr>
					</tbody>
				</table>
			</component-slot>

			<component-slot id="slot-columnName_heading">
				<template #name>
					&lt;columnName&gt;_heading
				</template>

				<template #default-value>
					The heading provided within `configuration`, or the column key.
				</template>

				<p>Provides the ability to override the label for a particular column, by its key from the original data. Provided to the slot are is the key for that column.</p>

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
							<td><code>key</code></td>
							<td>string</td>
							<td>The key for this column, as determined by the original data provided.</td>
						</tr>
						<tr>
							<td><code>label</code></td>
							<td>string</td>
							<td>The current label for the column, as determined by any column configuration.</td>
						</tr>
					</tbody>
				</table>
			</component-slot>

			<component-slot id="slot-columnName">
				<template #name>
					&lt;columnName&gt;
				</template>

				<template #default-value>
					The cell content as text.
				</template>

				<p>Provides the ability to override the display for a particular column, by its key from the original data. Provided to the slot are the content of the cell itself, as well as the rest of its row, allowing cells to be combined where necessary.</p>

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
							<td><code>cell</code></td>
							<td>string</td>
							<td>The original content of the cell, as provided in <code>data</code>.</td>
						</tr>
						<tr>
							<td><code>row</code></td>
							<td>object</td>
							<td>The content of the entire row that the cell belongs to.</td>
						</tr>
					</tbody>
				</table>
			</component-slot>

			<component-slot id="slot-select-all-rows-label">
				<template #name>
					select-all-rows-label
				</template>

				<template #default-value>
					"Select all rows"
				</template>

				<p>The hidden label for the "select" checkbox that represents all rows.</p>
			</component-slot>

			<component-slot id="slot-select-row-label">
				<template #name>
					select-row-label
				</template>

				<template #default-value>
					"Select row"
				</template>

				<p>The hidden label for each &quot;select&quot; checkbox, used when <code>enableSelection</code> is true.</p>

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
							<td><code>row</code></td>
							<td>object</td>
							<td>The data for the current row.</td>
						</tr>
					</tbody>
				</table>
			</component-slot>

			<component-slot id="slot-configure-label">
				<template #name>
					configure-label
				</template>

				<template #default-value>
					"Configure"
				</template>

				<p>The label for the "Configure" dropdown, including display options and column visibility.</p>
			</component-slot>

			<component-slot id="slot-display-options-label">
				<template #name>
					display-options-label
				</template>

				<template #default-value>
					"Display options"
				</template>

				<p>The label for the "Display" options in the configure dropdown.</p>
			</component-slot>

			<component-slot id="slot-display-option-compact-label">
				<template #name>
					display-option-compact-label
				</template>

				<template #default-value>
					"Compact"
				</template>

				<p>The label for the "Compact" display option.</p>
			</component-slot>

			<component-slot id="slot-display-option-standard-label">
				<template #name>
					display-option-standard-label
				</template>

				<template #default-value>
					"Standard"
				</template>

				<p>The label for the "Standard" display option.</p>
			</component-slot>

			<component-slot id="slot-display-option-relaxed-label">
				<template #name>
					display-option-relaxed-label
				</template>

				<template #default-value>
					"Relaxed"
				</template>

				<p>The label for the "Relaxed" display option.</p>
			</component-slot>

			<component-slot id="slot-column-visibility-label">
				<template #name>
					column-visibility-label
				</template>

				<template #default-value>
					"Columns"
				</template>

				<p>The label for the "Columns" options in the configure dropdown.</p>
			</component-slot>

			<component-slot id="slot-selected-row-count-label">
				<template #name>
					selected-row-count-label
				</template>

				<template #default-value>
					`{{ selectedCount }} rows selected`
				</template>

				<p>The label for the number of rows currently selected. This is only shown if <code>enableSelection</code> is enabled.</p>

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
							<td><code>selectedCount</code></td>
							<td>string</td>
							<td>The count of rows currently selected.</td>
						</tr>
					</tbody>
				</table>
			</component-slot>

			<component-slot id="slot-showing-items-label">
				<template #name>
					showing-items-label
				</template>

				<template #default-value>
					`Showing {{ first }}&ndash;{{ last }} of {{ total }} items`
				</template>

				<p>A display of the current items being shown, giving the user an indication of where they are in the list.</p>

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
							<td><code>first</code></td>
							<td>number</td>
							<td>The first item being displayed.</td>
						</tr>
						<tr>
							<td><code>last</code></td>
							<td>number</td>
							<td>The last item being displayed.</td>
						</tr>
						<tr>
							<td><code>count</code></td>
							<td>number</td>
							<td>The total number of items in the list.</td>
						</tr>
					</tbody>
				</table>
			</component-slot>
		</component-slots>

		<component-methods>
			<component-method id="method-set-search-query">
				<template #name>
					<code>setSearchQuery</code>
				</template>

				<p>Set the table's current search query, overriding any current search. This could be used in conjunction with a cell template to allow the user to find all similar rows, for example.</p>

				<table>
					<thead>
						<tr>
							<th>Parameter</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>searchQuery</code></td>
							<td>string</td>
							<td>The new search query to set.</td>
						</tr>
					</tbody>
				</table>
			</component-method>
		</component-methods>

		<component-playgrounds>
			<playground-data-table />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundDataTable from "./fragments/playground-data-table.vue";
</script>
