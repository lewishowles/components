<template>
	<div class="guides-horizontal">
		<div class="guides-vertical">
			<div class="p-2">
				<div class="border border-grey-200 bg-white p-20">
					<h1 class="mb-6 inline-block rounded-sm bg-linear-to-r from-[#be185d] to-[#6a21a7] px-4 py-2 font-mono text-lg text-white">
						<slot name="title" />
					</h1>

					<div class="space-y-24">
						<slot />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
.guides-horizontal, .guides-vertical {
	position: relative;

	&::before, &::after {
		border-style: double;
		border-color: var(--color-grey-200);
		content: "";
		position: absolute;
	}
}

.guides-horizontal {
	&::before, &::after {
		border-top-width: 3px;
		right: -1rem;
		left: -1rem;
	}

	&::before {
		top: 0;
	}

	&::after {
		bottom: 0;
	}
}

.guides-vertical {
	&::before, &::after {
		border-left-width: 3px;
		top: -1rem;
		bottom: -1rem;
	}

	&::before {
		left: 0;
	}

	&::after {
		right: 0;
	}
}
</style>
