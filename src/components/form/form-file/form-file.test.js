import { createDeepMount, createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";

import FormFile from "./form-file.vue";

const defaultProps = { id: "id-abc" };
const mount = createMount(FormFile, { props: defaultProps });
const deepMount = createDeepMount(FormFile, { props: defaultProps });

describe("form-file", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("haveFile", () => {
			test("should be false when no file is selected", () => {
				const wrapper = mount();

				expect(wrapper.vm.haveFile).toBe(false);
			});

			test("should be true when a file is selected", async () => {
				const wrapper = mount();

				await wrapper.setProps({ modelValue: new File(["content"], "test.txt") });

				expect(wrapper.vm.haveFile).toBe(true);
			});

			test("should be true when multiple files are selected", async () => {
				const wrapper = mount({ multiple: true });

				await wrapper.setProps({
					modelValue: [new File(["content"], "first.txt"), new File(["content"], "second.txt")],
				});

				expect(wrapper.vm.haveFile).toBe(true);
			});
		});
	});

	describe("Methods", () => {
		describe("handleChange", () => {
			test("should set the model to the selected file", () => {
				const wrapper = mount();
				const file = new File(["content"], "test.txt");

				wrapper.vm.handleChange({ target: { files: [file] } });

				expect(wrapper.emitted("update:modelValue")[0]).toEqual([file]);
			});

			test("should set the model to null when no file is selected", async () => {
				const wrapper = mount();

				await wrapper.setProps({ modelValue: new File(["content"], "test.txt") });

				wrapper.vm.handleChange({ target: { files: [] } });

				expect(wrapper.emitted("update:modelValue").at(-1)).toEqual([null]);
			});

			test("should set the model to all selected files when multiple is enabled", () => {
				const wrapper = mount({ multiple: true });
				const files = [new File(["content"], "first.txt"), new File(["content"], "second.txt")];

				wrapper.vm.handleChange({ target: { files } });

				expect(wrapper.emitted("update:modelValue").at(-1)).toEqual([files]);
			});

			test("should set the model to null when multiple selection is empty", async () => {
				const wrapper = mount({ multiple: true });
				const files = [new File(["content"], "first.txt")];

				await wrapper.setProps({ modelValue: files });

				wrapper.vm.handleChange({ target: { files: [] } });

				expect(wrapper.emitted("update:modelValue").at(-1)).toEqual([null]);
			});
		});

		describe("removeFile", () => {
			test("should clear the model", async () => {
				const wrapper = mount();

				await wrapper.setProps({ modelValue: new File(["content"], "test.txt") });
				await wrapper.vm.removeFile();

				expect(wrapper.emitted("update:modelValue").at(-1)).toEqual([null]);
			});
		});
	});

	describe("Render contracts", () => {
		test("adds the multiple attribute when enabled", () => {
			const wrapper = deepMount({ multiple: true });

			expect(wrapper.find("input").attributes("multiple")).toBeDefined();
		});

		test("keeps generated input attributes authoritative", () => {
			const wrapper = deepMount({
				props: {
					inputAttributes: {
						id: "custom-id",
						type: "text",
						multiple: true,
						required: true,
						"aria-describedby": "custom-help",
						"aria-errormessage": "custom-error",
						"aria-invalid": "false",
					},
				},
				slots: { help: "Help text" },
			});

			const input = wrapper.find("input");

			expect(input.attributes("id")).toBe("id-abc");
			expect(input.attributes("type")).toBe("file");
			expect(input.attributes("multiple")).toBeUndefined();
			expect(input.attributes("required")).toBeUndefined();
			expect(input.attributes("aria-describedby")).toBe("id-abc-help custom-help");
			expect(input.attributes("aria-errormessage")).toBeUndefined();
			expect(input.attributes("aria-invalid")).toBeUndefined();
		});

		test("shows a remove button once a file is selected", async () => {
			const wrapper = deepMount();

			await wrapper.setProps({ modelValue: new File(["content"], "test.txt") });

			expect(wrapper.find('[data-part="remove"]').exists()).toBe(true);
		});

		test("hides the remove button when no file is selected", () => {
			const wrapper = deepMount();

			expect(wrapper.find('[data-part="remove"]').exists()).toBe(false);
		});

		test("labels the remove button with the number of selected files", async () => {
			const wrapper = deepMount({ multiple: true });

			await wrapper.setProps({
				modelValue: [new File(["content"], "first.txt"), new File(["content"], "second.txt")],
			});

			expect(wrapper.find('[data-part="remove"]').text()).toContain("Remove 2 files");
		});

		test("uses the filename when multiple mode has one file", async () => {
			const wrapper = deepMount({ multiple: true });

			await wrapper.setProps({ modelValue: [new File(["content"], "first.txt")] });

			expect(wrapper.find('[data-part="remove"]').text()).toContain("Remove first.txt");
		});

		test("passes the current files to the remove button label slot", async () => {
			const wrapper = deepMount({
				props: { multiple: true },
				slots: {
					"remove-button-label": ({ files }) => `Clear ${files.length} files`,
				},
			});

			await wrapper.setProps({
				modelValue: [new File(["content"], "first.txt"), new File(["content"], "second.txt")],
			});

			expect(wrapper.find('[data-part="remove"]').text()).toContain("Clear 2 files");
		});
	});
});
