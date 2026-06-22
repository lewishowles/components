import { codeToHtml } from "shiki/bundle/web";
import { isNonEmptyString } from "@lewishowles/helpers/string";

const codeTheme = "github-dark-default";

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
 * Render a code sample as highlighted HTML, with an escaped fallback for plain
 * text or unsupported languages.
 *
 * @param  {string}  code
 *     The code sample to render.
 * @param  {string|null}  language
 *     The requested language.
 * @returns {Promise<string>}
 */
export async function renderCodeHtml(code, language) {
	const resolvedLanguage = resolveLanguage(code, language);

	if (!isNonEmptyString(code) || resolvedLanguage === "text") {
		return renderPlainCodeHtml(code, resolvedLanguage);
	}

	try {
		return await codeToHtml(code, {
			lang: resolvedLanguage,
			theme: codeTheme,
		});
	} catch {
		return renderPlainCodeHtml(code, resolvedLanguage);
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
 * Normalise common language aliases for Shiki.
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
	return `<pre class="shiki ${codeTheme}" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code class="language-${language}">${escapeHtml(code)}</code></pre>`;
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
