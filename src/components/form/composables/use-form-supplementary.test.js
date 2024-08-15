import { describe, it, expect } from "vitest";
import useFormSupplementary from "./use-form-supplementary";

describe("useFormSupplementary", () => {
	it("should generate appropriate error and help IDs", () => {
		const baseId = "id-abc";
		const { errorId, helpId } = useFormSupplementary(baseId);

		expect(errorId.value).toBe("id-abc-error");
		expect(helpId.value).toBe("id-abc-help");
	});

	it("should update describedBy correctly", () => {
		const baseId = "id-abc";
		const { describedBy, updateDescribedBy } = useFormSupplementary(baseId);

		updateDescribedBy({ haveHelp: true, haveError: false });
		expect(describedBy.value).toBe("id-abc-help");

		updateDescribedBy({ haveHelp: false, haveError: true });
		expect(describedBy.value).toBe("id-abc-error");

		updateDescribedBy({ haveHelp: true, haveError: true });
		expect(describedBy.value).toBe("id-abc-help id-abc-error");

		updateDescribedBy({ haveHelp: false, haveError: false });
		expect(describedBy.value).toBe(null);
	});
});
