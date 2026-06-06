<template>
	<component-page>
		<template #title>useModalDialog</template>

		<template #introduction>
			<p>
				<code>useModalDialog</code>
				provides a shared stack of modal dialogs. The most recently requested dialog is displayed by
				the
				<router-link v-bind="{ to: '/messaging/modal-controller' }">
					<code>modal-controller</code>
				</router-link>
				component, which should be included once near the root of the application.
			</p>

			<p>
				You will typically call
				<code>openModal</code>
				to show a dialog and let the controller handle rendering and stacking. Direct use is rarely
				needed beyond that.
			</p>
		</template>

		<component-returns>
			<component-return id="return-modals">
				<template #name>modals</template>

				<template #type>Readonly&lt;Ref&lt;object[]&gt;&gt;</template>

				<p>
					The current stack of modal dialogs, each an entry of
					<code>{ id, component, props }</code>
					. Read-only; manage the stack through the methods below.
				</p>
			</component-return>
		</component-returns>

		<component-methods>
			<component-method id="method-open-modal">
				<template #name>
					<code>openModal(component, props?)</code>
				</template>

				<p>
					Add a modal to the stack. Pass the component to render as the dialog content and an
					optional props object to pass to it.
				</p>
			</component-method>

			<component-method id="method-close-top-modal">
				<template #name>
					<code>closeTopModal()</code>
				</template>

				<p>Close the most recently opened modal by removing it from the top of the stack.</p>
			</component-method>

			<component-method id="method-clear-modals">
				<template #name>
					<code>_clearModals()</code>
				</template>

				<p>
					Remove every modal from the stack. Intended for internal and testing use only—it clears
					dialogs requested by any component, so avoid it in application code.
				</p>
			</component-method>
		</component-methods>
	</component-page>
</template>
