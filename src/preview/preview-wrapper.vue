<template>
	<div class="min-h-screen p-20">
		<div class="guides-horizontal mx-auto max-w-(--breakpoint-xl)">
			<div class="guides-vertical">
				<div class="p-10">
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
		background: theme("colors.grey.300");
		content: "";
		position: absolute;
	}
}

.guides-horizontal {
	&::before, &::after {
		height: 1px;
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
		width: 1px;
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
