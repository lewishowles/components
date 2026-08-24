// @vitest-environment node
import { describe, expect, test } from "vite-plus/test";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { URL, fileURLToPath } from "node:url";
import { getComponentManifest } from "../../support/component-manifest.js";
import { componentMetadata } from "./component-metadata.js";

// Scanned recursively for every component's *.metadata.js sidecar file.
const componentsDirectory = fileURLToPath(new URL(".", import.meta.url));

// Scanned recursively for every docs page-*.vue file the sidebar must link.
const docsViewsDirectory = fileURLToPath(new URL("../docs/views/", import.meta.url));

// Parsed for the routes already linked from the docs sidebar.
const appMenuPath = fileURLToPath(
	new URL(
		"../layout/app-layout/fragments/app-sidebar/fragments/app-menu/app-menu.vue",
		import.meta.url,
	),
);

// Component names with a metadata sidecar file, expected to be registered in componentMetadata.
const metadataFileNames = readdirSync(componentsDirectory, {
	withFileTypes: true,
	recursive: true,
})
	.filter((entry) => entry.isFile() && entry.name.endsWith(".metadata.js"))
	.map((entry) => entry.name.replace(/\.metadata\.js$/, ""))
	.sort();

// getComponentManifest() also lists private fragments and icons; metadata sidecar presence
// narrows it to the public components this guard checks.
const componentManifest = getComponentManifest();

// Checked against registeredMetadataNames to catch a public component with no metadata entry.
const publicComponentNames = new Set(
	componentManifest.filter(({ tag }) => metadataFileNames.includes(tag)).map(({ tag }) => tag),
);

// Checked against metadataFileNames and registeredMetadataNames to catch a metadata entry with
// no matching component source file.
const manifestComponentNames = new Set(componentManifest.map(({ tag }) => tag));

// The name field, not the file name, ties a componentMetadata entry back to its component.
const registeredMetadataNames = new Set(componentMetadata.map(({ name }) => name));

// Excludes page-home, the / landing route, which needs no sidebar link.
const documentationRoutes = readdirSync(docsViewsDirectory, {
	withFileTypes: true,
	recursive: true,
})
	.filter(
		(entry) => entry.isFile() && entry.name.startsWith("page-") && entry.name.endsWith(".vue"),
	)
	.map((entry) => {
		const pagePath = join(entry.parentPath ?? entry.path, entry.name);
		const relativePagePath = relative(docsViewsDirectory, pagePath);

		return {
			relativePagePath,
			route: getRoutePath(pagePath),
		};
	})
	.filter(({ relativePagePath }) => relativePagePath !== "page-home/page-home.vue");

// Deliberately narrow: matches only <app-menu-link to="..."> as currently authored, so this
// fails loudly rather than silently under-checking if the sidebar template shape changes.
const appMenuLinks = new Set(
	[...readFileSync(appMenuPath, "utf8").matchAll(/<app-menu-link to="([^"]+)"/g)].map(
		([, route]) => route,
	),
);

describe("component registration", () => {
	test("registers every public component", () => {
		const missingMetadataEntries = [...publicComponentNames].filter(
			(name) => !registeredMetadataNames.has(name),
		);

		expect(
			missingMetadataEntries,
			`Public components missing componentMetadata entries: ${missingMetadataEntries.join(", ")}`,
		).toEqual([]);
	});

	test("matches every metadata entry to a public component", () => {
		const unresolvedMetadataEntries = [
			...metadataFileNames.filter((name) => !manifestComponentNames.has(name)),
			...[...registeredMetadataNames].filter((name) => !manifestComponentNames.has(name)),
		].filter((name, index, names) => names.indexOf(name) === index);

		expect(
			unresolvedMetadataEntries,
			`Metadata entries without matching public components: ${unresolvedMetadataEntries.join(", ")}`,
		).toEqual([]);
	});

	test("links every documentation route in the app menu", () => {
		const missingDocumentationRoutes = documentationRoutes
			.filter(({ route }) => !appMenuLinks.has(route))
			.map(({ relativePagePath, route }) => `${relativePagePath} (${route})`);

		expect(
			missingDocumentationRoutes,
			`Documentation pages missing app-menu links: ${missingDocumentationRoutes.join(", ")}`,
		).toEqual([]);
	});
});

/**
 * Derive the route a docs page must be linked at, mirroring the page-*.vue to route conversion
 * in src/router/index.js. Keep both in sync if that conversion changes.
 *
 * @param  {string}  pagePath
 *     Absolute path to a docs page file.
 * @returns  {string}
 *     Route path the docs router generates for the page.
 */
function getRoutePath(pagePath) {
	const relativePagePath = relative(docsViewsDirectory, pagePath);
	const pathParts = relativePagePath.split("/");
	const filename = pathParts.pop();

	const name = filename
		.replace(/^page-/, "")
		.replace(/\.vue$/, "")
		.toLowerCase();

	if (pathParts.length <= 1) {
		return `/${name}`;
	}

	const category = pathParts.at(-2);

	return `/${category}/${name}`;
}
