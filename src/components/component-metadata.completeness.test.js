// @vitest-environment node
import { describe, expect, test } from "vite-plus/test";
import { createCheckerByJson } from "vue-component-meta";
import { readFileSync, readdirSync } from "node:fs";
import { URL, fileURLToPath } from "node:url";
import { join } from "node:path";
import { componentMetadata } from "./component-metadata.js";

const root = fileURLToPath(new URL("../..", import.meta.url));

// Vue adds these props to every component, so they aren't ours to document.
const globalPropNames = new Set(["class", "style", "key", "ref", "ref_key", "ref_for"]);

// These belong to v-model or to test hooks, so they aren't part of the public API.
const internalPropNames = new Set([
	"componentName",
	"modelValue",
	"onUpdate:modelValue",
	"dataTest",
]);

const checker = createCheckerByJson(root, {
	include: ["src/components/**/*.vue"],
	compilerOptions: {
		allowJs: true,
		checkJs: false,
		paths: {
			"@/*": ["./src/*"],
		},
	},
});

// Map each component name to its .vue file. Fragments and examples aren't real
// components, so they're left out.
const componentsDir = fileURLToPath(new URL(".", import.meta.url));

const componentFileMap = buildComponentFileMap(componentsDir);

// The first lookup starts TypeScript up and takes a few seconds. The rest are quick.
describe("component-metadata completeness", { timeout: 30000 }, () => {
	for (const component of componentMetadata) {
		const filePath = componentFileMap[component.name];

		// Some components have no matching .vue file, usually because they're
		// aliased or named unusually. Skip those.
		if (!filePath) {
			continue;
		}

		test(`${component.name}: all props covered`, () => {
			const meta = checker.getComponentMeta(filePath);

			const extractedPropNames = meta.props
				.filter((prop) => !prop.global)
				.filter((prop) => !globalPropNames.has(prop.name))
				.filter((prop) => !internalPropNames.has(prop.name))
				.map((prop) => prop.name);

			const metadataPropNames = new Set(component.props?.map((p) => p.name) ?? []);

			const missing = extractedPropNames.filter((name) => !metadataPropNames.has(name));

			expect(
				missing,
				`Props in ${component.name}.vue but not in metadata: ${missing.join(", ")}`,
			).toEqual([]);
		});
	}
});

/**
 * Work out the real value a consumer gets from a prop's default, for the
 * plain cases: a string, number, boolean, null, or undefined.
 *
 * vue-component-meta hands us each default as raw source text, so a string
 * default turns up with its quotes still attached and needs unwrapping
 * before we can compare it. Anything fancier (arrays, objects, function
 * calls, strings with ${...} in them) is reported as not simple and left
 * for the structured-defaults audit.
 *
 * @param  {string | undefined}  raw
 *     The default text from vue-component-meta, or undefined when the prop
 *     has no default.
 * @returns {object}
 *     `{ isSimple: true, value }` when the value could be read, otherwise
 *     `{ isSimple: false }`.
 */
function normaliseSimpleDefault(raw) {
	if (raw === undefined) {
		return { isSimple: false };
	}

	const expression = raw.trim();

	// true, false, null and undefined stand for themselves.
	const literalValues = { true: true, false: false, null: null, undefined: undefined };

	if (Object.hasOwn(literalValues, expression)) {
		return { isSimple: true, value: literalValues[expression] };
	}

	// A number: whole or decimal, with an optional sign and exponent.
	if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(expression)) {
		return { isSimple: true, value: Number(expression) };
	}

	// A string in single, double, or backtick quotes and nothing else around it.
	const stringLiteral = expression.match(
		/^(?:"((?:[^"\\]|\\[\s\S])*)"|'((?:[^'\\]|\\[\s\S])*)'|`((?:[^`\\]|\\[\s\S])*)`)$/,
	);

	// A string with ${...} in it has no single fixed value, so skip it.
	if (!stringLiteral || expression.includes("${")) {
		return { isSimple: false };
	}

	const content = stringLiteral[1] ?? stringLiteral[2] ?? stringLiteral[3];

	// The escape sequences we expect to see in a real default.
	const escapes = { n: "\n", r: "\r", t: "\t", "\\": "\\", '"': '"', "'": "'", "`": "`" };

	// Hit an escape we don't recognise? Stop, rather than guess at the value.
	if ([...content.matchAll(/\\([\s\S])/g)].some(([, escape]) => !Object.hasOwn(escapes, escape))) {
		return { isSimple: false };
	}

	const value = content.replace(/\\([nrt\\"'`])/g, (_match, escape) => escapes[escape]);

	return { isSimple: true, value };
}

// Each simple default in the metadata should match what the Vue component
// actually falls back to. Structured and function defaults are checked elsewhere.
describe("component-metadata simple defaults", { timeout: 30000 }, () => {
	for (const component of componentMetadata) {
		const filePath = componentFileMap[component.name];

		if (!filePath) {
			continue;
		}

		test(`${component.name}: simple defaults match Vue source`, () => {
			const meta = checker.getComponentMeta(filePath);

			for (const metadataProp of component.props ?? []) {
				const sourceProp = meta.props.find((prop) => prop.name === metadataProp.name);
				const { isSimple, value } = normaliseSimpleDefault(sourceProp?.default);

				if (!isSimple) {
					continue;
				}

				const label = `${component.name}.${metadataProp.name}: metadata default must match Vue source`;
				const hasDefault = Object.hasOwn(metadataProp, "default");

				// The metadata can leave the default out when the source default is
				// undefined, or null on a required prop (decision nte_Ddx8hXM1Lde3ckD3hViRjA).
				// If it does include one, it still has to be right.
				if (value === undefined || (value === null && metadataProp.required === true)) {
					if (hasDefault) {
						expect(metadataProp.default, label).toBe(value);
					}

					continue;
				}

				expect(hasDefault, `${label}; default key is required`).toBe(true);
				expect(metadataProp.default, label).toBe(value);

				// The stored default should be the value itself, not a string with
				// the source quotes still on it.
				if (typeof metadataProp.default === "string") {
					expect(metadataProp.default, `${label}; remove source-code quotes`).not.toMatch(
						/^(["'`])[\s\S]*\1$/,
					);
				}
			}
		});
	}
});

describe("component-metadata shape", () => {
	for (const component of componentMetadata) {
		test(`${component.name}: shape is valid`, () => {
			for (const key of ["name", "category", "summary"]) {
				expect(
					typeof component[key] === "string" && component[key].length > 0,
					`${component.name}: ${key} must be a non-empty string`,
				).toBe(true);
			}

			if (component.props !== undefined) {
				validateItems(component, "props", ["name", "type", "summary"]);
			}

			if (component.slots !== undefined) {
				validateItems(component, "slots", ["name", "summary"]);
			}

			if (component.methods !== undefined) {
				validateItems(component, "methods", ["name", "summary"]);
			}

			if (component.events !== undefined) {
				validateItems(component, "events", ["name", "summary"]);
			}

			if (component.parts !== undefined) {
				validateItems(component, "parts", ["name", "summary"]);
			}

			if (component.examples !== undefined) {
				validateItems(component, "examples", ["name", "label", "summary"]);
			}
		});
	}
});

describe("component-metadata parts completeness", () => {
	for (const component of componentMetadata) {
		const filePath = componentFileMap[component.name];

		if (!filePath) {
			continue;
		}

		const source = readFileSync(filePath, "utf8");

		// Only look at the template, so selector strings in <script> don't count.
		const templateMatch = source.match(/^<template>([\s\S]*)<\/template>/);

		if (!templateMatch) {
			throw new Error(`Could not read template from ${component.name}.vue`);
		}

		const templateSource = templateMatch[1];

		const uniqueParts = [
			...new Set([...templateSource.matchAll(/data-part="([^"]+)"/g)].map((match) => match[1])),
		];

		if (uniqueParts.length === 0) {
			continue;
		}

		test(`${component.name}: all data-part values documented`, () => {
			const metadataPartNames = new Set((component.parts ?? []).map((part) => part.name));
			const missing = uniqueParts.filter((name) => !metadataPartNames.has(name));

			expect(
				missing,
				`data-part values in ${component.name}.vue not in metadata.parts: ${missing.join(", ")}`,
			).toEqual([]);
		});
	}
});

/**
 * Check that a metadata list exists, is an array, and that every entry has a
 * non-empty string for each of the given keys.
 *
 * @param  {object}  component
 *     The component metadata entry being checked.
 * @param  {string}  field
 *     Which list to look at, for example "props" or "slots".
 * @param  {string[]}  requiredKeys
 *     The keys every entry must have as a non-empty string.
 */
function validateItems(component, field, requiredKeys) {
	expect(Array.isArray(component[field]), `${component.name}: ${field} must be an array`).toBe(
		true,
	);

	for (const [index, item] of component[field].entries()) {
		for (const key of requiredKeys) {
			expect(
				typeof item[key] === "string" && item[key].length > 0,
				`${component.name}: ${field}[${index}].${key} must be a non-empty string`,
			).toBe(true);
		}
	}
}

/**
 * Walk a directory tree for .vue files and map each component name to its
 * full path. Fragments and examples are skipped, since those are internal
 * components with no metadata entry.
 *
 * @param  {string}  dir
 *     The directory to start from.
 * @returns {Record<string, string>}
 *     Component name to absolute file path.
 */
function buildComponentFileMap(dir) {
	const map = {};

	for (const entry of readdirSync(dir, { withFileTypes: true, recursive: true })) {
		if (!entry.isFile() || !entry.name.endsWith(".vue")) {
			continue;
		}

		const parentPath = entry.parentPath ?? entry.path;

		if (parentPath.includes("/fragments/") || parentPath.includes("/examples/")) {
			continue;
		}

		const name = entry.name.replace(".vue", "");

		map[name] = join(parentPath, entry.name);
	}

	return map;
}
