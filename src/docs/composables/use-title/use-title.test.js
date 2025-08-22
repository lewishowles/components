import { beforeEach, describe, expect, test } from "vitest";
import { nextTick } from "vue";
import useTitle from "./use-title";

describe("useTitle", () => {
	const baseTitle = "Components | A library of beautiful components";

	beforeEach(() => {
		const { setTitle } = useTitle();

		setTitle(baseTitle);
	});

	test("should initialise", () => {
		const response = useTitle();

		expect(response).toBeTypeOf("object");
	});

	test("should set a new title with setTitle", async() => {
		const { title, setTitle } = useTitle();

		setTitle("New page");

		expect(title.value).toBe("New page | Components | A library of beautiful components");

		await nextTick();

		expect(document.title).toBe("New page | Components | A library of beautiful components");
	});

	test("should not set title if input is empty", () => {
		const { title, setTitle } = useTitle();

		setTitle("");

		expect(title.value).toBe(baseTitle);
	});
});
