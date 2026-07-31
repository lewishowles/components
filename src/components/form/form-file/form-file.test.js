import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";

import FormFile from "./form-file.vue";

const defaultProps = { id: "id-abc" };
const mount = createMount(FormFile, { props: defaultProps });

describe("form-file", () => {
	describe("Computed", () => {
		describe("haveFile", () => {
			test("reports no file when the model is empty", () => {
				const wrapper = mount();

				expect(wrapper.vm.haveFile).toBe(false);
			});

			test("reports a selected file", async () => {
				const wrapper = mount();

				await wrapper.setProps({ modelValue: new File(["content"], "test.txt") });

				expect(wrapper.vm.haveFile).toBe(true);
			});

			test("reports multiple selected files", async () => {
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
			test("sets the model to the selected file", () => {
				const wrapper = mount();
				const file = new File(["content"], "test.txt");

				wrapper.vm.handleChange({ target: { files: [file] } });

				expect(wrapper.emitted("update:modelValue")[0]).toEqual([file]);
			});

			test("sets the model to null when no file is selected", async () => {
				const wrapper = mount();

				await wrapper.setProps({ modelValue: new File(["content"], "test.txt") });

				wrapper.vm.handleChange({ target: { files: [] } });

				expect(wrapper.emitted("update:modelValue").at(-1)).toEqual([null]);
			});

			test("sets the model to all files selected in multiple mode", () => {
				const wrapper = mount({ multiple: true });
				const files = [new File(["content"], "first.txt"), new File(["content"], "second.txt")];

				wrapper.vm.handleChange({ target: { files } });

				expect(wrapper.emitted("update:modelValue").at(-1)).toEqual([files]);
			});

			test("sets the model to null when a multiple selection is empty", async () => {
				const wrapper = mount({ multiple: true });
				const files = [new File(["content"], "first.txt")];

				await wrapper.setProps({ modelValue: files });

				wrapper.vm.handleChange({ target: { files: [] } });

				expect(wrapper.emitted("update:modelValue").at(-1)).toEqual([null]);
			});
		});

		describe("removeFile", () => {
			test("clears the model", async () => {
				const wrapper = mount();

				await wrapper.setProps({ modelValue: new File(["content"], "test.txt") });
				await wrapper.vm.removeFile();

				expect(wrapper.emitted("update:modelValue").at(-1)).toEqual([null]);
			});
		});
	});
});
