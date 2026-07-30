import { afterEach, describe, expect, test } from "vite-plus/test";
import { useModalDialog } from "./use-modal-dialog.js";

describe("useModalDialog", () => {
	afterEach(() => {
		const { _clearModals } = useModalDialog();

		_clearModals();
	});

	test("should initialise", () => {
		const response = useModalDialog();

		expect(response).toBeTypeOf("object");
	});

	describe("Methods", () => {
		describe("openModal", () => {
			test('should allow a modal to be "opened"', () => {
				const { modals, openModal } = useModalDialog();

				expect(modals.value.length).toBe(0);

				openModal({ name: "my-component" }, { title: "prop title" });

				expect(modals.value.length).toBe(1);

				expect(modals.value).toEqual([
					{
						id: expect.any(Number),
						component: { name: "my-component" },
						props: { title: "prop title" },
					},
				]);
			});
		});

		describe("closeTopModal", () => {
			test("should close the last remaining modal", () => {
				const { modals, openModal, closeTopModal } = useModalDialog();

				openModal({ name: "my-component" }, { title: "prop title" });

				expect(modals.value.length).toBe(1);

				closeTopModal();

				expect(modals.value.length).toBe(0);

				expect(modals.value).toEqual([]);
			});

			test("should close the most recent modal", () => {
				const { modals, openModal, closeTopModal } = useModalDialog();

				openModal({ name: "first-in" }, { title: "First in" });
				openModal({ name: "second-in" }, { title: "Second in" });
				openModal({ name: "last-in" }, { title: "Last in" });

				expect(modals.value.length).toBe(3);

				closeTopModal();

				expect(modals.value.length).toBe(2);

				expect(modals.value).toEqual([
					{
						id: expect.any(Number),
						component: { name: "first-in" },
						props: { title: "First in" },
					},
					{
						id: expect.any(Number),
						component: { name: "second-in" },
						props: { title: "Second in" },
					},
				]);

				closeTopModal();

				expect(modals.value.length).toBe(1);

				expect(modals.value).toEqual([
					{
						id: expect.any(Number),
						component: { name: "first-in" },
						props: { title: "First in" },
					},
				]);
			});
		});

		describe("closeModal", () => {
			test("should remove the requested background modal and preserve stack order", () => {
				const { closeModal, modals, openModal } = useModalDialog();

				openModal({ name: "first-in" });
				openModal({ name: "second-in" });
				openModal({ name: "last-in" });

				const [firstModal, backgroundModal, lastModal] = modals.value;

				closeModal(backgroundModal.id);

				expect(modals.value).toEqual([firstModal, lastModal]);
			});

			test("should do nothing when the modal is unknown or already closed", () => {
				const { closeModal, modals, openModal } = useModalDialog();

				openModal({ name: "my-component" });

				const [modal] = modals.value;

				closeModal(-1);

				expect(modals.value).toEqual([modal]);

				closeModal(modal.id);
				closeModal(modal.id);

				expect(modals.value).toEqual([]);
			});
		});

		describe("_clearModals", () => {
			test("should clear all modals", () => {
				const { openModal, modals, _clearModals } = useModalDialog();

				openModal({ name: "first-in" }, { title: "First in" });
				openModal({ name: "second-in" }, { title: "Second in" });
				openModal({ name: "last-in" }, { title: "Last in" });

				expect(modals.value.length).toBe(3);

				_clearModals();

				expect(modals.value.length).toBe(0);

				expect(modals.value).toEqual([]);
			});
		});
	});
});
