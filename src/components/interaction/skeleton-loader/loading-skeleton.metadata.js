// Metadata for docs and CLI consumers that need to describe or generate loading-skeleton usage.
export const loadingSkeletonMetadata = {
	name: "loading-skeleton",
	category: "interaction",
	summary: "An accessible wrapper for skeleton loading placeholders.",
	props: [],
	slots: [
		{
			name: "default",
			summary: "Skeleton placeholder content.",
		},
		{
			name: "label",
			summary: "Accessible loading label.",
		},
	],
	examples: [],
};
