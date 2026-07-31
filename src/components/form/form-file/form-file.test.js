import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";

import FormFile from "./form-file.vue";

const defaultProps = { id: "id-abc" };
const mount = createMount(FormFile, { props: defaultProps });

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
});
