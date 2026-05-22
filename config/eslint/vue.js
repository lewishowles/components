import pluginVue from "eslint-plugin-vue";

export default [
	...pluginVue.configs["flat/recommended"],
	{
		rules: {
			"vue/define-macros-order": [
				"error",
				{
					order: ["defineProps", "defineEmits"],
					defineExposeLast: true,
				},
			],
			"vue/html-indent": "off",
			"vue/html-self-closing": "off",
			"vue/max-attributes-per-line": "off",
			"vue/singleline-html-element-content-newline": "off",
		},
	},
];
