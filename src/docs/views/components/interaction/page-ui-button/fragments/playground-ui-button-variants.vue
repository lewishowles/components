<template>
	<component-playground id="playground-ui-button-variants">
		<template #title>Variants</template>

		<template #introduction>
			<p>Compare each button variant with its disabled state.</p>
		</template>

		<div class="overflow-x-auto">
			<table class="min-w-max border-separate border-spacing-x-3 border-spacing-y-2 text-sm">
				<caption class="sr-only">UI Button variants in enabled and disabled states.</caption>

				<thead>
					<tr>
						<th scope="col">
							<span class="sr-only">Variant</span>
						</th>

						<th class="text-start font-normal" scope="col">Enabled</th>
						<th class="text-start font-normal" scope="col">Disabled</th>
					</tr>
				</thead>

				<tbody>
					<tr>
						<th class="text-start font-normal" scope="row">Primary</th>
						<td><ui-button class="button--primary">Primary</ui-button></td>
						<td><ui-button class="button--primary" disabled>Primary</ui-button></td>
					</tr>

					<tr>
						<th class="text-start font-normal" scope="row">Muted</th>
						<td><ui-button class="button--muted">Muted</ui-button></td>
						<td><ui-button class="button--muted" disabled>Muted</ui-button></td>
					</tr>

					<tr>
						<th class="text-start font-normal" scope="row">Toggle</th>
						<td><ui-button class="button--toggle">Toggle</ui-button></td>
						<td><ui-button class="button--toggle" disabled>Toggle</ui-button></td>
					</tr>

					<tr>
						<th class="text-start font-normal" scope="row">Ghost</th>
						<td><ui-button class="button--ghost">Ghost</ui-button></td>
						<td><ui-button class="button--ghost" disabled>Ghost</ui-button></td>
					</tr>

					<tr>
						<th class="text-start font-normal" scope="row">Danger</th>
						<td><ui-button class="button--danger">Danger</ui-button></td>
						<td><ui-button class="button--danger" disabled>Danger</ui-button></td>
					</tr>
				</tbody>
			</table>
		</div>
	</component-playground>
</template>
