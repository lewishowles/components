<template>
	<component-page>
		<template #title> useCombobox </template>

		<template #introduction>
			<p>
				<code>useCombobox</code> provides the groundwork for implementing a combobox interaction
				pattern, including ARIA attribute management and keyboard handling.
			</p>

			<p>
				It owns the state and behaviour only—you provide the markup. Spread the returned attribute
				objects onto your input, listbox, and option elements, register each option so it
				participates in keyboard navigation, and forward keydown events to
				<code>handleKeydown</code>.
			</p>
		</template>

		<component-parameters>
			<component-parameter id="parameter-listbox-id">
				<template #name> listboxId </template>

				<template #type> string </template>

				<template #default-value> auto-generated </template>

				<p>
					The ID used to link the input's <code>aria-controls</code> to the listbox's
					<code>id</code>. A unique ID is generated automatically if one is not provided.
				</p>
			</component-parameter>

			<component-parameter id="parameter-on-select">
				<template #name> onSelect </template>

				<template #type> function </template>

				<p>
					Called with the selected option's ID when an option is chosen, either by clicking or by
					pressing <code>Enter</code> on the highlighted option.
				</p>
			</component-parameter>
		</component-parameters>

		<component-returns>
			<component-return id="return-is-open">
				<template #name> isOpen </template>

				<template #type> Ref&lt;boolean&gt; </template>

				<p>Whether the listbox popup is currently open.</p>
			</component-return>

			<component-return id="return-active-id">
				<template #name> activeId </template>

				<template #type> Ref&lt;string | null&gt; </template>

				<p>
					The ID of the currently highlighted option, or <code>null</code> when none is highlighted.
					Drives <code>aria-activedescendant</code> and each option's <code>aria-selected</code>.
				</p>
			</component-return>

			<component-return id="return-option-ids">
				<template #name> optionIds </template>

				<template #type> ComputedRef&lt;string[]&gt; </template>

				<p>The registered option IDs in display order, used for keyboard navigation.</p>
			</component-return>

			<component-return id="return-input-attributes">
				<template #name> inputAttributes </template>

				<template #type> ComputedRef&lt;object&gt; </template>

				<p>
					ARIA attributes to spread onto the input element:
					<code>role="combobox"</code>, <code>aria-autocomplete</code>, <code>aria-controls</code>,
					<code>aria-expanded</code>, and <code>aria-activedescendant</code>.
				</p>
			</component-return>

			<component-return id="return-listbox-attributes">
				<template #name> listboxAttributes </template>

				<template #type> ComputedRef&lt;object&gt; </template>

				<p>
					ARIA attributes to spread onto the listbox element: <code>role="listbox"</code> and the
					shared <code>id</code>.
				</p>
			</component-return>
		</component-returns>

		<component-methods>
			<component-method id="method-register-option">
				<template #name>
					<code>registerOption(id, groupId?)</code>
				</template>

				<p>
					Register an option so it participates in keyboard navigation. Options are navigated in
					registration order. Duplicate and empty IDs are ignored. An optional
					<code>groupId</code> may be supplied for grouped lists.
				</p>
			</component-method>

			<component-method id="method-unregister-option">
				<template #name>
					<code>unregisterOption(id)</code>
				</template>

				<p>
					Remove an option from keyboard navigation. If it was the highlighted option, the active
					highlight is cleared.
				</p>
			</component-method>

			<component-method id="method-open">
				<template #name>
					<code>open()</code>
				</template>

				<p>Open the listbox popup.</p>
			</component-method>

			<component-method id="method-close">
				<template #name>
					<code>close()</code>
				</template>

				<p>Close the listbox popup and clear the active highlight.</p>
			</component-method>

			<component-method id="method-select-option">
				<template #name>
					<code>selectOption(id?)</code>
				</template>

				<p>
					Select an individual option, which in turn calls <code>onSelect</code> and closes the
					popup. Selects the currently highlighted option when no ID is provided.
				</p>
			</component-method>

			<component-method id="method-get-option-attributes">
				<template #name>
					<code>getOptionAttributes(id)</code>
				</template>

				<p>
					Use on individual options. Returns a computed object of ARIA attributes for an individual
					option:
					<code>role="option"</code>, its <code>id</code>, and <code>aria-selected</code>.
				</p>
			</component-method>

			<component-method id="method-handle-keydown">
				<template #name>
					<code>handleKeydown(event)</code>
				</template>

				<p>
					Attach to the input to handle keydown events, implementing the combobox keyboard
					functionality: arrow keys open and navigate the list, <code>Enter</code> selects,
					<code>Escape</code> closes, and cursor keys return to text editing.
				</p>
			</component-method>
		</component-methods>
	</component-page>
</template>
