import { describe, expect, test } from "vitest";
import useOptions from "./use-options";

describe("use-options", () => {
	test("Initialises a composable", () => {
		const response = useOptions();

		expect(response).toBeTypeOf("object");
	});

	describe("Computed", () => {
		describe("options", () => {
			describe("Anything but a non-empty array or non-empty object of options results in an empty array", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (non-empty)", "string"],
					["string (empty)", ""],
					["array (empty)", []],
					["object (empty)", {}],
					["null", null],
					["undefined", undefined],
				])("%s", ([, input]) => {
					const { options } = useOptions(input);

					expect(options.value).toEqual([]);
				});
			});

			test("A simple object has its key value pairs converted", () => {
				const { options } = useOptions({ a: "one", b: "two", c: "three" });

				expect(options.value).toEqual([
					{
						id: expect.any(String),
						label: "one",
						value: "a",
						first: true,
						last: false,
					},
					{
						id: expect.any(String),
						label: "two",
						value: "b",
						first: false,
						last: false,
					},
					{
						id: expect.any(String),
						label: "three",
						value: "c",
						first: false,
						last: true,
					},
				]);
			});

			test("An array of strings is converted", () => {
				const { options } = useOptions(["one", "two", "three"]);

				expect(options.value).toEqual([
					{
						id: expect.any(String),
						label: "one",
						value: "one",
						first: true,
						last: false,
					},
					{
						id: expect.any(String),
						label: "two",
						value: "two",
						first: false,
						last: false,
					},
					{
						id: expect.any(String),
						label: "three",
						value: "three",
						first: false,
						last: true,
					},
				]);
			});

			test("An array of numbers is converted", () => {
				const { options } = useOptions([1, 2, 3]);

				expect(options.value).toEqual([
					{
						id: expect.any(String),
						label: 1,
						value: 1,
						first: true,
						last: false,
					},
					{
						id: expect.any(String),
						label: 2,
						value: 2,
						first: false,
						last: false,
					},
					{
						id: expect.any(String),
						label: 3,
						value: 3,
						first: false,
						last: true,
					},
				]);
			});

			test("An array of objects with a \"label\" and a \"value\" is converted", () => {
				const { options } = useOptions([
					{ label: "one", value: 1 },
					{ label: "two", value: 2 },
					{ label: "three", value: 3 },
				]);

				expect(options.value).toEqual([
					{
						id: expect.any(String),
						label: "one",
						value: 1,
						first: true,
						last: false,
					},
					{
						id: expect.any(String),
						label: "two",
						value: 2,
						first: false,
						last: false,
					},
					{
						id: expect.any(String),
						label: "three",
						value: 3,
						first: false,
						last: true,
					},
				]);
			});

			test("An array of objects with defined \"labelKey\" and a \"valueKey\" is converted", () => {
				const { options } = useOptions([
					{ sport: "Tennis", score: 1 },
					{ sport: "Curling", score: 2 },
					{ sport: "Ice Hockey", score: 3 },
				], { labelKey: "sport", valueKey: "score" });

				expect(options.value).toEqual([
					{
						id: expect.any(String),
						label: "Tennis",
						value: 1,
						first: true,
						last: false,
					},
					{
						id: expect.any(String),
						label: "Curling",
						value: 2,
						first: false,
						last: false,
					},
					{
						id: expect.any(String),
						label: "Ice Hockey",
						value: 3,
						first: false,
						last: true,
					},
				]);
			});

			test("Multiple option types can be combined", () => {
				const { options } = useOptions([
					{ label: "one", value: 1 },
					"two",
					3,
				]);

				expect(options.value).toEqual([
					{
						id: expect.any(String),
						label: "one",
						value: 1,
						first: true,
						last: false,
					},
					{
						id: expect.any(String),
						label: "two",
						value: "two",
						first: false,
						last: false,
					},
					{
						id: expect.any(String),
						label: 3,
						value: 3,
						first: false,
						last: true,
					},
				]);
			});

			test("An object not containing a `label` property is ignored", () => {
				const { options } = useOptions([
					{ key: "one", value: 1 },
					{ key: "two", value: 2 },
					{ key: "three", value: 3 },
				]);

				expect(options.value).toEqual([]);
			});

			test("An object not containing a `value` property is ignored", () => {
				const { options } = useOptions([
					{ label: "one", score: 1 },
					{ label: "two", score: 2 },
					{ label: "three", score: 3 },
				]);

				expect(options.value).toEqual([]);
			});

			test("An object not containing a defined \"labelKey\" property is ignored", () => {
				const { options } = useOptions([
					{ label: "one", score: 1 },
					{ label: "two", score: 2 },
					{ label: "three", score: 3 },
				], { labelKey: "sport" });

				expect(options.value).toEqual([]);
			});

			test("An object not containing a defined \"valueKey\" property is ignored", () => {
				const { options } = useOptions([
					{ label: "one", value: 1 },
					{ label: "two", value: 2 },
					{ label: "three", value: 3 },
				], { valueKey: "score" });

				expect(options.value).toEqual([]);
			});
		});
	});
});
