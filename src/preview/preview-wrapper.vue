<template>
	<div class="min-h-screen p-20">
		<div class="guides-horizontal mx-auto max-w-screen-xl">
			<div class="guides-vertical">
				<div class="p-10">
					<div class="guides-horizontal guides-horizontal--faded">
						<div class="guides-vertical guides-vertical--faded">
							<h1 class="inline-block rounded-md bg-blue-50 px-2 py-1 text-xl font-bold text-blue-800">
								<slot name="title" />
							</h1>

							<slot />
						</div>
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

.guides-horizontal--faded, .guides-vertical--faded {
	&::before, &::after {
		background: theme("colors.purple.200");
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
