import { describe, expect, test, vi } from "vite-plus/test";
import { normaliseCodeText, queueCodeHighlight, renderFallbackHtml } from "./code-highlighter";

const mockHighlightAll = vi.hoisted(() => vi.fn());

vi.mock("microlighter", () => ({ highlightAll: mockHighlightAll }));

describe("normaliseCodeText", () => {
	test("should return an empty string for empty input", () => {
		expect(normaliseCodeText("")).toBe("");
		expect(normaliseCodeText(null)).toBe("");
	});

	test("should trim leading and trailing blank lines", () => {
		expect(normaliseCodeText("\n\nconst a = 1;\n\n")).toBe("const a = 1;");
	});

	test("should dedent to the smallest common indentation", () => {
		const code = "\t\tconst a = 1;\n\t\tconst b = 2;";

		expect(normaliseCodeText(code)).toBe("const a = 1;\nconst b = 2;");
	});
});

describe("renderFallbackHtml", () => {
	test("should escape HTML in the fallback output", () => {
		const html = renderFallbackHtml("<script>alert('hi')</script>", "html");

		expect(html).toContain("&lt;script&gt;");
		expect(html).not.toContain("<script>alert");
	});

	test("should detect vue language from script/template markup", () => {
		const html = renderFallbackHtml("<template><div /></template>", null);

		expect(html).toContain("language-vue");
	});

	test("should detect html language for other tag-led markup", () => {
		const html = renderFallbackHtml("<div>hello</div>", null);

		expect(html).toContain("language-html");
	});

	test("should detect javascript language from common statement keywords", () => {
		const html = renderFallbackHtml("const value = 1;", null);

		expect(html).toContain("language-javascript");
	});

	test("should fall back to plain text for unrecognised code", () => {
		const html = renderFallbackHtml("just some words", null);

		expect(html).toContain("language-text");
	});

	test("should use MicroLighter language aliases in permanent code markup", () => {
		const bash = renderFallbackHtml("echo hello", "sh");
		const javascript = renderFallbackHtml("const value = 1;", "js");
		const typescript = renderFallbackHtml("const value: string = 'one';", "ts");

		expect(bash).toContain("language-bash");
		expect(javascript).toContain("language-javascript");
		expect(typescript).toContain("language-typescript");
	});
});

describe("queueCodeHighlight", () => {
	test("should queue the latest root until the active scan completes", async () => {
		vi.stubGlobal("CSS", { highlights: new Map() });
		vi.useFakeTimers();

		const firstRoot = document.createElement("main");
		const firstCodeBlock = document.createElement("div");

		firstCodeBlock.innerHTML =
			'<pre><code class="language-javascript">const first = true;</code></pre>';
		firstRoot.append(firstCodeBlock);

		const secondRoot = document.createElement("main");
		const secondCodeBlock = document.createElement("div");

		secondCodeBlock.innerHTML =
			'<pre><code class="language-javascript">const second = true;</code></pre>';
		secondRoot.append(secondCodeBlock);

		let resolveFirstHighlight;

		const firstHighlight = new Promise((resolve) => {
			resolveFirstHighlight = resolve;
		});

		mockHighlightAll.mockImplementationOnce(() => firstHighlight).mockResolvedValueOnce();

		queueCodeHighlight(firstCodeBlock);
		await vi.advanceTimersByTimeAsync(0);

		queueCodeHighlight(secondCodeBlock);
		await vi.advanceTimersByTimeAsync(0);

		expect(mockHighlightAll).toHaveBeenCalledTimes(1);

		resolveFirstHighlight();
		await firstHighlight;
		await Promise.resolve();
		await Promise.resolve();

		expect(mockHighlightAll).toHaveBeenCalledTimes(2);
		expect(mockHighlightAll).toHaveBeenLastCalledWith({
			root: secondRoot,
			selector: "pre > code:not(.language-text)",
		});

		vi.useRealTimers();
		vi.unstubAllGlobals();
		mockHighlightAll.mockReset();
	});
});
