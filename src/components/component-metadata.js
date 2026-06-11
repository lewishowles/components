import { linkTagMetadata } from "@/components/interaction/link-tag/link-tag.metadata.js";
import { pillBadgeMetadata } from "@/components/messaging/pill-badge/pill-badge.metadata.js";
import { uiButtonMetadata } from "@/components/interaction/ui-button/ui-button.metadata.js";

// Components with shared metadata for docs, snippets, and future CLI commands.
export const componentMetadata = [linkTagMetadata, pillBadgeMetadata, uiButtonMetadata];

// Components keyed by kebab-case tag name for direct lookup.
export const componentMetadataByName = Object.fromEntries(
	componentMetadata.map((component) => [component.name, component]),
);
