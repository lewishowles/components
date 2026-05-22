import { Temporal } from "temporal-polyfill";
import { describe, expect, test } from "vitest";

import { normaliseDate, normaliseDateToEpochMilliseconds } from "./normalise-date";

describe("normalise-date", () => {
	describe("normaliseDate", () => {
		test("Converts a Date instance to a PlainDateTime", () => {
			const date = normaliseDate(new Date(2025, 2, 29, 13, 15, 20));

			expect(date).toBeInstanceOf(Temporal.PlainDateTime);
			expect(date.toString()).toBe("2025-03-29T13:15:20");
		});

		test("Converts an epoch millisecond timestamp to a PlainDateTime", () => {
			const date = normaliseDate(1743254120000);

			expect(date).toBeInstanceOf(Temporal.PlainDateTime);
			expect(date.toString()).toBe("2025-03-29T13:15:20");
		});

		test("Converts a plain date string to a PlainDate", () => {
			const date = normaliseDate("2025-03-29");

			expect(date).toBeInstanceOf(Temporal.PlainDate);
		});

		test("Converts a date-time string to a PlainDateTime", () => {
			const date = normaliseDate("2025-03-29T13:15:20");

			expect(date).toBeInstanceOf(Temporal.PlainDateTime);
		});

		test("Converts a zoned date-time string to a ZonedDateTime", () => {
			const date = normaliseDate("2025-03-29[America/New_York]");

			expect(date).toBeInstanceOf(Temporal.ZonedDateTime);
		});

		test("Returns null for unsupported values", () => {
			const date = normaliseDate(null);

			expect(date).toBeNull();
		});
	});

	describe("normaliseDateToEpochMilliseconds", () => {
		test("Converts a supported date to epoch milliseconds", () => {
			const date = normaliseDateToEpochMilliseconds("2025-03-29T13:15:20");

			expect(date).toBe(1743254120000);
		});

		test("Returns null for unsupported values", () => {
			const date = normaliseDateToEpochMilliseconds(null);

			expect(date).toBeNull();
		});
	});
});
