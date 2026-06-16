import { PACKAGE_NAME } from "../utils/constants.js";
import { cancel, intro, isCancel, select } from "@clack/prompts";
import { highlight } from "cli-highlight";
import { readFileSync } from "node:fs";

import {
	buildTemplateAttributes,
	componentMetadata,
	lookupComponent,
	printComponents,
	printExamples,
} from "./index.js";

export function getHelpSection() {
	return {
		commands: [{ description: "Discover and copy component examples", name: "snippet" }],
		group: "Components",
	};
}

/**
 * Parses snippet command arguments into flags, a component name, and an
 * optional example name.
 *
 * @param  {string[]}  argv
 *     Arguments following the `snippet` subcommand.
 * @returns {object}
 */
export function parseSnippetArguments(argv) {
	const flags = { help: false, list: false };

	let example = null;
	let name = null;

	for (const argument of argv) {
		if (argument === "--list" || argument === "-l") {
			flags.list = true;
			continue;
		}

		if (argument === "--help" || argument === "-h") {
			flags.help = true;
			continue;
		}

		if (argument.startsWith("-")) {
			continue;
		}

		if (name === null) {
			name = argument;
		} else if (example === null) {
			example = argument;
		}
	}

	return { example, flags, name };
}

/**
 * Generates a copyable Vue template snippet for a named component example.
 * Exits with an error if the example is not found or has no snippet data.
 * Starts with a blank line so output is visually separate from the terminal
 * prompt.
 *
 * @param  {object}  component
 *     Component metadata record.
 * @param  {string}  exampleName
 *     The name of the example to generate.
 * @returns {string}
 */
export function generateSnippet(component, exampleName) {
	const example = component.examples.find((example) => example.name === exampleName);

	if (!example) {
		console.error(`Unknown example: ${exampleName}`);
		console.error(`Available: ${component.examples.map((example) => example.name).join(", ")}`);
		process.exit(1);
	}

	if (!example.snippet) {
		console.error(`Example "${exampleName}" has no snippet data.`);
		process.exit(1);
	}

	const { snippet } = example;

	if (snippet.source) {
		return `\n${highlight(readSourceSnippet(component, snippet.source), {
			language: "html",
			ignoreIllegals: true,
		})}`;
	}

	const attributes = buildTemplateAttributes(snippet);
	const attributeString = attributes.length ? " " + attributes.join(" ") : "";
	const slotContent = snippet.slots?.default?.value ?? null;

	const template =
		slotContent === null
			? `<${component.name}${attributeString} />`
			: `<${component.name}${attributeString}>\n  ${slotContent}\n</${component.name}>`;

	return `\n${highlight(template, { language: "html", ignoreIllegals: true })}`;
}

/**
 * Reads a source-backed snippet and returns the copyable source. Template-only
 * SFCs are reduced to their inner template content; richer SFCs are returned in
 * full so script and style setup stay intact.
 *
 * @param   {object}  component
 *     Component metadata record.
 * @param   {string}  source
 *     Source path relative to the component metadata base.
 * @returns {string}
 */
function readSourceSnippet(component, source) {
	if (!component._sourceBaseUrl) {
		console.error(`Component "${component.name}" cannot resolve source snippets.`);
		process.exit(1);
	}

	const sourceUrl = new URL(source, component._sourceBaseUrl);
	const sourceContent = readFileSync(sourceUrl, "utf8").trim();

	return normaliseSourceSnippet(sourceContent);
}

/**
 * Returns inner template content for template-only SFCs, otherwise returns the
 * original source unchanged.
 *
 * @param   {string}  source
 *     Raw snippet source.
 * @returns {string}
 */
function normaliseSourceSnippet(source) {
	const trimmedSource = source.trim();
	const templateMatch = trimmedSource.match(/^<template>\s*([\s\S]*?)\s*<\/template>$/);

	if (!templateMatch) {
		return trimmedSource;
	}

	return templateMatch[1].trim();
}

/**
 * Discovers or generates component snippets. With --list, prints available
 * components or examples. With a component and example name, prints the
 * generated template code. With no arguments and an interactive terminal,
 * prompts the user to pick a component and example.
 *
 * @param  {string[]}  rawArguments
 *     Arguments following the `snippet` subcommand.
 */
export async function runSnippet(rawArguments) {
	const { example, flags, name } = parseSnippetArguments(rawArguments);

	if (flags.help) {
		printComponents(componentMetadata);

		return;
	}

	if (flags.list && name === null) {
		printComponents(componentMetadata);

		return;
	}

	if (flags.list) {
		printExamples(lookupComponent(name));

		return;
	}

	if (name !== null && example !== null) {
		printSnippet(lookupComponent(name), example);

		return;
	}

	if (name !== null) {
		const component = lookupComponent(name);
		const resolvedExample = resolveSnippetExample(component);

		if (resolvedExample !== null) {
			printSnippet(component, resolvedExample);

			return;
		}

		printExamples(component);

		return;
	}

	if (!process.stdin.isTTY) {
		console.error(`Usage: npx ${PACKAGE_NAME} snippet [component] [example]\n`);
		process.exit(1);
	}

	const selected = await promptSnippet();

	if (selected === null) {
		cancel("No snippet examples available.");
		process.exit(1);
	}

	printSnippet(lookupComponent(selected.component), selected.example);
}

/**
 * Returns the only available example for a component, or null when the user
 * still needs to choose an example.
 *
 * @param   {object}  component
 *     Component metadata record.
 * @returns {string | null}
 */
function resolveSnippetExample(component) {
	if (component.examples?.length === 1) {
		return component.examples[0].name;
	}

	return null;
}

/**
 * Shows interactive prompts to pick a component and snippet example.
 *
 * @returns {Promise<{ component: string, example: string } | null>}
 *     The selected component and example names.
 */
async function promptSnippet() {
	const components = componentMetadata.filter((component) => component.examples?.length > 0);

	if (!components.length) {
		return null;
	}

	intro(PACKAGE_NAME);

	const componentChoice = await select({
		message: "Choose a component",
		options: components.map((component) => ({
			hint: component.summary,
			label: component.name,
			value: component.name,
		})),
	});

	if (isCancel(componentChoice)) {
		cancel("Cancelled.");
		process.exit(0);
	}

	const component = lookupComponent(componentChoice);

	const exampleChoice = await select({
		message: `Choose a ${component.name} example`,
		options: component.examples.map((example) => ({
			hint: example.summary,
			label: example.name,
			value: example.name,
		})),
	});

	if (isCancel(exampleChoice)) {
		cancel("Cancelled.");
		process.exit(0);
	}

	return { component: component.name, example: exampleChoice };
}

/**
 * Prints the generated template snippet for a named component example.
 *
 * @param  {object}  component
 *     Component metadata record.
 * @param  {string}  exampleName
 *     The name of the example to generate.
 */
function printSnippet(component, exampleName) {
	console.log(generateSnippet(component, exampleName));
}

export const _test = { normaliseSourceSnippet, resolveSnippetExample };
