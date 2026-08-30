import { isNonEmptyString } from "@lewishowles/helpers/string";

// Exclude plain text because MicroLighter has no grammar for it.
const syntaxSelector = "pre > code:not(.language-text)";

// The pending shared scan, which groups updates from multiple code blocks.
let highlightTimer;
// The active MicroLighter scan, when one is still loading grammars or painting
// ranges.
let highlightPromise;
// Whether an update arrived while a shared scan was active.
let highlightQueued = false;
// The latest docs content region to scan after the active scan completes.
let queuedContentRoot;
// The lazily loaded MicroLighter module.
let highlighterPromise;

/**
 * Lazily load and memoise the MicroLighter module.
 *
 * @returns {Promise<typeof import("microlighter")>}
 */
function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = import("microlighter");
	}

	return highlighterPromise;
}

/**
 * Normalise code text from either a prop or indented Vue slot content.
 *
 * @param  {string|null}  code
 *     The code sample to normalise.
 * @returns {string}
 */
export function normaliseCodeText(code) {
	if (!isNonEmptyString(code)) {
		return "";
	}

	const lines = code.replace(/\r\n/g, "\n").split("\n");

	while (lines[0]?.trim() === "") {
		lines.shift();
	}

	while (lines.at(-1)?.trim() === "") {
		lines.pop();
	}

	const indentation = lines
		.filter((line) => line.trim() !== "")
		.map((line) => line.match(/^\s*/)[0].length)
		.reduce((minimum, length) => Math.min(minimum, length), Infinity);

	if (!Number.isFinite(indentation) || indentation === 0) {
		return lines.join("\n");
	}

	return lines.map((line) => line.slice(indentation)).join("\n");
}

/**
 * Render escaped code synchronously as the permanent code block content.
 *
 * @param  {string}  code
 *     The code sample to render.
 * @param  {string|null}  language
 *     The requested language.
 * @returns {string}
 */
export function renderFallbackHtml(code, language) {
	const resolvedLanguage = resolveLanguage(code, language);

	return renderPlainCodeHtml(code, resolvedLanguage);
}

/**
 * Queue one shared docs-content scan after a code block updates.
 *
 * @param  {HTMLElement|null}  codeContainer
 *     The rendered code block container.
 * @returns {void}
 */
export function queueCodeHighlight(codeContainer) {
	if (typeof CSS === "undefined" || !CSS.highlights || !codeContainer) {
		return;
	}

	const contentRoot = codeContainer.closest("main") ?? codeContainer.ownerDocument;

	clearTimeout(highlightTimer);

	highlightTimer = setTimeout(() => {
		if (highlightPromise) {
			highlightQueued = true;
			queuedContentRoot = contentRoot;

			return;
		}

		startHighlight(contentRoot);
	}, 0);
}

/**
 * Run one shared scan and schedule the latest queued update after it completes.
 *
 * @param  {ParentNode}  contentRoot
 *     The docs content region containing code blocks.
 * @returns {void}
 */
function startHighlight(contentRoot) {
	highlightPromise = highlightCodeBlocks(contentRoot);

	void highlightPromise.then(runQueuedHighlight, runQueuedHighlight);
}

/**
 * Run one queued scan after the active scan completes.
 *
 * @returns {void}
 */
function runQueuedHighlight() {
	highlightPromise = undefined;

	if (!highlightQueued) {
		return;
	}

	highlightQueued = false;

	const contentRoot = queuedContentRoot;

	queuedContentRoot = undefined;

	startHighlight(contentRoot);
}

/**
 * Highlight every supported code block in the current docs content region.
 *
 * @param  {ParentNode}  contentRoot
 *     The docs content region containing code blocks.
 * @returns {Promise<void>}
 */
async function highlightCodeBlocks(contentRoot) {
	if (typeof CSS === "undefined" || !CSS.highlights || !contentRoot.querySelector(syntaxSelector)) {
		return;
	}

	try {
		const { highlightAll } = await getHighlighter();

		await highlightAll({ root: contentRoot, selector: syntaxSelector });
	} catch {
		// Escaped code remains readable when syntax enhancement cannot load.
	}
}

/**
 * Resolve the language from an explicit prop or a few common docs patterns.
 *
 * @param  {string}  code
 *     The code sample to inspect.
 * @param  {string|null}  language
 *     The explicitly provided language.
 * @returns {string}
 */
function resolveLanguage(code, language) {
	if (isNonEmptyString(language)) {
		return normaliseLanguage(language);
	}

	const trimmedCode = code.trim();

	if (trimmedCode.startsWith("<")) {
		return trimmedCode.includes("<script") || trimmedCode.includes("<template") ? "vue" : "html";
	}

	if (/^(const|let|var|function|import|export|\[|\{)/.test(trimmedCode)) {
		return "javascript";
	}

	return "text";
}

/**
 * Normalise common language aliases for MicroLighter.
 *
 * @param  {string}  language
 *     The provided code language.
 * @returns {string}
 */
function normaliseLanguage(language) {
	const normalisedLanguage = language.toLowerCase();

	if (["sh", "shell"].includes(normalisedLanguage)) {
		return "bash";
	}

	if (normalisedLanguage === "js") {
		return "javascript";
	}

	if (normalisedLanguage === "ts") {
		return "typescript";
	}

	return normalisedLanguage;
}

/**
 * Render an escaped plain code block.
 *
 * @param  {string}  code
 *     The code sample to render.
 * @param  {string}  language
 *     The resolved language.
 * @returns {string}
 */
function renderPlainCodeHtml(code, language) {
	return `<pre tabindex="0"><code class="language-${language}">${escapeHtml(code)}</code></pre>`;
}

/**
 * Escape plain fallback code before rendering it as HTML.
 *
 * @param  {string}  code
 *     The code sample to escape.
 * @returns {string}
 */
function escapeHtml(code) {
	return code
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}
