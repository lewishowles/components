import { PACKAGE_NAME } from "../utils/constants.js";
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
	const attributes = buildTemplateAttributes(snippet);
	const attributeString = attributes.length ? " " + attributes.join(" ") : "";
	const slotContent = snippet.slots?.default?.value ?? null;

	if (slotContent === null) {
		return `<${component.name}${attributeString} />`;
	}

	return `<${component.name}${attributeString}>\n  ${slotContent}\n</${component.name}>`;
}

/**
 * Discovers or generates component snippets. With --list, prints available
 * components or examples. With a component and example name, prints the
 * generated template code.
 *
 * @param  {string[]}  rawArguments
 *     Arguments following the `snippet` subcommand.
 */
export function runSnippet(rawArguments) {
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
		printExamples(lookupComponent(name));

		return;
	}

	console.error(`Usage: npx ${PACKAGE_NAME} snippet [component] [example]\n`);
	process.exit(1);
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
