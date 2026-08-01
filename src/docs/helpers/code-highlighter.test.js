import { describe, expect, test } from "vite-plus/test";
import { normaliseCodeText, renderCodeHtml, renderFallbackHtml } from "./code-highlighter";

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
});

describe("renderCodeHtml", () => {
	test("should highlight javascript using the bundled highlighter", async () => {
		const html = await renderCodeHtml("const value = 1;", "javascript");

		expect(html).toContain("shiki");
		expect(html).toContain("catppuccin-macchiato");
	});

	test("should highlight html and vue samples", async () => {
		const htmlOutput = await renderCodeHtml("<div>hello</div>", "html");
		const vueOutput = await renderCodeHtml("<template><div /></template>", "vue");

		expect(htmlOutput).toContain("shiki");
		expect(vueOutput).toContain("shiki");
	});

	test("should fall back to escaped plain text for an unsupported language", async () => {
		const html = await renderCodeHtml("print('hi')", "python");

		expect(html).toContain("language-python");
		expect(html).toContain("print(&#039;hi&#039;)");
	});
});
