import { describe, test, expect } from "vitest";
import useFormSupplementary from "./use-form-supplementary";

describe("useFormSupplementary", () => {
	test("An appropriate introduction ID should be generated", () => {
		const baseId = "id-abc";
		const { introductionId } = useFormSupplementary(baseId);

		expect(introductionId.value).toBe("id-abc-introduction");
	});

	test("An appropriate help ID should be generated", () => {
		const baseId = "id-abc";
		const { helpId } = useFormSupplementary(baseId);

		expect(helpId.value).toBe("id-abc-help");
	});

	test("An appropriate error ID should be generated", () => {
		const baseId = "id-abc";
		const { errorId } = useFormSupplementary(baseId);

		expect(errorId.value).toBe("id-abc-error");
	});

	describe("updateDescribedBy", () => {
		test("Accounts for present introduction", () => {
			const baseId = "id-abc";
			const { describedBy, updateDescribedBy } = useFormSupplementary(baseId);

			updateDescribedBy({ haveIntroduction: true, haveHelp: false, haveError: false });
			expect(describedBy.value).toBe("id-abc-introduction");
		});

		test("Accounts for present help", () => {
			const baseId = "id-abc";
			const { describedBy, updateDescribedBy } = useFormSupplementary(baseId);

			updateDescribedBy({ haveIntroduction: false, haveHelp: true, haveError: false });
			expect(describedBy.value).toBe("id-abc-help");
		});

		test("Accounts for present error", () => {
			const baseId = "id-abc";
			const { describedBy, updateDescribedBy } = useFormSupplementary(baseId);

			updateDescribedBy({ haveIntroduction: false, haveHelp: false, haveError: true });
			expect(describedBy.value).toBe("id-abc-error");
		});

		test("Can combine introduction and help", () => {
			const baseId = "id-abc";
			const { describedBy, updateDescribedBy } = useFormSupplementary(baseId);

			updateDescribedBy({ haveIntroduction: true, haveHelp: true, haveError: false });
			expect(describedBy.value).toBe("id-abc-introduction id-abc-help");
		});

		test("Can combine introduction and error", () => {
			const baseId = "id-abc";
			const { describedBy, updateDescribedBy } = useFormSupplementary(baseId);

			updateDescribedBy({ haveIntroduction: true, haveHelp: false, haveError: true });
			expect(describedBy.value).toBe("id-abc-introduction id-abc-error");
		});

		test("Can combine help and error", () => {
			const baseId = "id-abc";
			const { describedBy, updateDescribedBy } = useFormSupplementary(baseId);

			updateDescribedBy({ haveIntroduction: false, haveHelp: true, haveError: true });
			expect(describedBy.value).toBe("id-abc-help id-abc-error");
		});

		test("Can combine introduction, help and error", () => {
			const baseId = "id-abc";
			const { describedBy, updateDescribedBy } = useFormSupplementary(baseId);

			updateDescribedBy({ haveIntroduction: true, haveHelp: true, haveError: true });
			expect(describedBy.value).toBe("id-abc-introduction id-abc-help id-abc-error");
		});
	});
});
