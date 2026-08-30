import{C as e,Ct as t,M as n,O as r,V as i,X as a,c as o,h as s,it as c,m as l,s as u,v as d}from"./runtime-core.esm-bundler-DpihAPF5.js";import{a as f,i as p,r as m}from"./index-Dib23QE6.js";var h=`<template>
	<form-wrapper v-model="formData" v-bind="{ rules }" @submit="saveProfile">
		<form-field name="name">
			Full name

			<template #help>Use the name you want shown on your account.</template>
		</form-field>

		<form-field
			name="email"
			type="email"
			v-bind="{
				inputAttributes: {
					autocomplete: 'email',
				},
			}"
		>
			Email address
		</form-field>

		<template #submit-button-label>Save profile</template>
	</form-wrapper>
</template>

<script setup>
// Current form values, exposed via v-model so a parent can observe submitted data.
const formData = defineModel({ default: () => ({}) });

// Form-level validation rules, keyed by field name, run by form-wrapper before submit.
const rules = {
	name: [{ rule: "required", message: "Enter your full name." }],
	email: [{ rule: "required", message: "Enter your email address." }],
};

/**
 * Save valid profile data.
 *
 * @param  {object}  values
 *     Submitted form values.
 */
function saveProfile(values) {
	void values;
	// Submit values to your API here.
}
<\/script>
`,g={__name:`playground-form-wrapper`,setup(t){let u=a(null);return(t,a)=>{let d=n(`component-playground`);return r(),o(d,e({copy:c(h),componentModel:u.value},{id:`playground-form-wrapper`}),{title:i(()=>[...a[1]||=[l(`Form wrapper`,-1)]]),default:i(()=>[s(p,{modelValue:u.value,"onUpdate:modelValue":a[0]||=e=>u.value=e},null,8,[`modelValue`])]),_:1},16)}}},_=`<template>
	<form-wrapper v-model="formData" v-bind="{ compact: true, rules }" @submit="saveSettings">
		<form-fieldset>
			<template #title>Personal details</template>
			<template #introduction>Basic information used to identify your account.</template>

			<form-field name="name">Full name</form-field>

			<form-field name="email" type="email">Email address</form-field>
		</form-fieldset>

		<form-fieldset>
			<template #title>Preferences</template>

			<form-field
				name="language"
				type="select"
				v-bind="{
					options: [
						{ value: 'en', label: 'English' },
						{ value: 'fr', label: 'French' },
						{ value: 'de', label: 'German' },
					],
				}"
			>
				Language
			</form-field>
		</form-fieldset>

		<template #submit-button-label>Save settings</template>
	</form-wrapper>
</template>

<script setup>
const formData = defineModel({ default: () => ({}) });

const rules = {
	name: [{ rule: "required", message: "Enter your full name." }],
	email: [{ rule: "required", message: "Enter your email address." }],
};

function saveSettings(values) {
	void values;
}
<\/script>
`,v={__name:`playground-compact-form-wrapper`,setup(t){let u=a(null);return(t,a)=>{let d=n(`component-playground`);return r(),o(d,e({copy:c(_),componentModel:u.value},{id:`playground-compact-form-wrapper`}),{title:i(()=>[...a[1]||=[l(`Compact form`,-1)]]),default:i(()=>[s(m,{modelValue:u.value,"onUpdate:modelValue":a[0]||=e=>u.value=e},null,8,[`modelValue`])]),_:1},16)}}},y=`<template>
	<form-wrapper v-model="formData" v-bind="{ initialData, recordId }">
		<template #pre-form>
			<div class="mb-6 flex gap-2">
				<button type="button" class="button--muted" @click="resolveInitialRecord">
					Load first record
				</button>
				<button type="button" class="button--muted" @click="loadNextRecord">
					Load next record
				</button>
			</div>
		</template>

		<form-field v-model="formData.username" v-bind="{ name: 'username' }">Username</form-field>

		<template #submit-button-label>Save</template>
	</form-wrapper>
</template>

<script setup>
import { computed, ref } from "vue";
// The data captured by the form.
const formData = defineModel({ default: () => ({}) });
// The source data.
const source = ref(null);
// The ID of the current "record".
const recordId = ref(1);
// The form waits for this getter's async source instead of seeding from v-model.
const initialData = computed(() => source.value);

/**
 * Resolve the first record after the form has already mounted.
 */
function resolveInitialRecord() {
	source.value = { username: "Alice" };
}

/**
 * Change the record identity before its replacement data becomes available.
 */
async function loadNextRecord() {
	recordId.value = 2;
	source.value = null;

	await Promise.resolve();

	source.value = { username: "Bob" };
}
<\/script>
`,b={__name:`playground-async-initial-data`,setup(t){let u=a({});return(t,a)=>{let d=n(`component-playground`);return r(),o(d,e({copy:c(y),componentModel:u.value},{id:`playground-async-initial-data`}),{title:i(()=>[...a[1]||=[l(`Async initial data`,-1)]]),default:i(()=>[s(f,{modelValue:u.value,"onUpdate:modelValue":a[0]||=e=>u.value=e},null,8,[`modelValue`])]),_:1},16)}}},x=`import { useForm } from "@lewishowles/components/composables";

const {
	fieldErrorsFor,
	isFieldRequired,
	isReadonly,
	registerField,
	updateFieldValue,
} = useForm({
	initialData: modelValue,
	rules: props.rules,
	onSubmit: (data) => emit("submit", data),
	errorSummaryElement,
	generalErrorsElement,
	submitButtonRef,
});

provide("form", {
	fieldErrorsFor,
	isFieldRequired,
	isReadonly,
	registerField,
	updateFieldValue,
});`,S=`const fieldErrors = { date: "The date must be in the future", email: ["The email address provided already exists"], };`,C=`<form-wrapper v-bind="{ readonly: true }">…</form-wrapper>`,w=`<form-wrapper v-bind="{ compact: true }">…</form-wrapper>`,T=`<form-wrapper v-bind="{ fieldTypes: { age: 'nullable-number' } }">…</form-wrapper>`,E=`import { computed } from "vue";
import { mapFormData } from "@lewishowles/components/composables";

const initialData = computed(() => {
	if (!record.value) {
		return null;
	}

	return mapFormData(record.value, {
		fields: { firstName: "first_name", age: "age" },
	});
});

<form-wrapper v-model="formData" v-bind="{ fieldTypes: { age: 'nullable-number' }, initialData }">…</form-wrapper>`,D=`const rules = {
	confirmPassword: [{ rule: "same", field: "password", message: "Passwords must match" }],
	endDate: [{ rule: "custom", validate: (value, formData) => !value || !formData.startDate || value > formData.startDate, message: "End date must be after the start date" }],
};

<form-wrapper v-bind="{ rules }">

</form-wrapper>
`,O=`import { z } from "zod";

const schema = z.object({
	email: z.string().min(1, "Enter your email address").email("Enter a valid email address"),
});

<form-wrapper v-bind="{ schema }">

</form-wrapper>
`,k=`[{ rule: "required", message: "Enter your name so we know what to call you" }]`,A=`[{ rule: "email", message: "We need an email address to set up your account" }]`,j=`[{ rule: "size", size: 11, message: "Your phone number should be 11 digits long" }]`,M=`[{ rule: "min", min: 11, message: "Your phone number should be at least 11 digits long" }]`,N=`[{ rule: "max", max: 11, message: "Your phone number should be no more than 11 digits long" }]`,P=`[{ rule: "between", min: 5, max: 8, message: "Your post code should be between 5 and 8 characters" }]`,F=`[{ rule: "in", options: ["a", "b", "c"], message: "Your choice should be a, b, or c" }]`,I=`[{ rule: "not_in", options: ["a", "b", "c"], message: "Your choice should not include a, b, or c" }]`,L=`[{ rule: "regexp", regexp: /[abc]+/, message: "Your ID should only contain the letters a, b, and c" }]`,R=`[{ rule: "same", field: "password", message: "Passwords must match" }]`,z=`[{ rule: "custom", validate: (value, formData) => value > formData.startDate, message: "End date must be after the start date" }]`,B=`[
	(v) => !!v || "Enter your name",
	(v) => /^[a-z]+$/i.test(v) || "Name must only contain letters",
]`,V={__name:`page-form-wrapper`,setup(a){return(a,c)=>{let f=n(`link-tag`),p=n(`code-block`),m=n(`component-prop`),h=n(`component-props`),_=n(`component-slot`),y=n(`component-slots`),V=n(`component-event`),H=n(`component-events`),U=n(`component-provide`),W=n(`component-provides`),G=n(`component-method`),K=n(`component-methods`),q=n(`component-styling-hook`),J=n(`component-styling-hooks`),Y=n(`component-playgrounds`),X=n(`component-page`);return r(),o(X,null,{title:i(()=>[...c[0]||=[l(`Form wrapper`,-1)]]),introduction:i(()=>[c[4]||=u(`p`,null,[u(`code`,null,`form-wrapper`),l(` is intended as a complete form, wrapped around individual fields. The wrapper automatically adds actions, owns form-level validation, and generates an error summary to maximise the accessibility of the form. `)],-1),u(`p`,null,[c[2]||=l(` We recommend a `,-1),s(f,e({href:`https://adamsilver.io/blog/how-to-highlight-required-and-optional-form-fields/`},{external:!0}),{default:i(()=>[...c[1]||=[l(` required by default, marked if optional technique `,-1)]]),_:1},16),c[3]||=l(` for form fields, meaning that optional fields should be marked as such. `,-1)]),c[5]||=u(`p`,null,[u(`code`,null,`form-wrapper`),l(` automatically includes `),u(`code`,null,`form-layout`),l(` around its `),u(`code`,null,`default`),l(` content. `)],-1),c[6]||=u(`p`,null,[l(` Internally, `),u(`code`,null,`form-wrapper`),l(` uses `),u(`code`,null,`useForm`),l(` to register child fields, run validation, build the error summary, and manage the submit lifecycle. Custom wrappers use the same composable and provide the same `),u(`code`,null,`form-wrapper`),l(` injection when they need `),u(`code`,null,`form-field`),l(` children to work. `)],-1)]),default:i(()=>[s(h,null,{default:i(()=>[s(m,{id:`prop-field-errors`},{name:i(()=>[...c[7]||=[l(`fieldErrors`,-1)]]),type:i(()=>[...c[8]||=[l(`Object`,-1)]]),"default-value":i(()=>[...c[9]||=[l(`{}`,-1)]]),default:i(()=>[c[10]||=u(`p`,null,[l(` Field-level errors managed by the parent, usually from an API response. Keys should match registered `),u(`code`,null,`form-field`),l(` names. Values can be either a single message or a list of messages. `)],-1),c[11]||=u(`p`,null,` These errors are shown in the error summary and passed to the relevant field so they use the same error display as validation messages. They are controlled by the parent and are not cleared automatically when field values change. `,-1),s(p,t(d({code:S})),null,16)]),_:1}),s(m,{id:`prop-submit-errors-callback`},{name:i(()=>[...c[12]||=[l(`submitErrorsCallback`,-1)]]),type:i(()=>[...c[13]||=[l(`Function`,-1)]]),"default-value":i(()=>[...c[14]||=[l(`null`,-1)]]),default:i(()=>[c[15]||=u(`p`,null,` An optional callback that maps a rejected submit Promise into an errors object. The callback only runs when the submit handler returns a rejecting Promise. If the handler catches the error itself, the callback will not run. `,-1),c[16]||=u(`p`,null,[l(` Keys matching registered `),u(`code`,null,`form-field`),l(` names are shown in the error summary and passed to the field, exactly like `),u(`code`,null,`fieldErrors`),l(` . Keys that don't match a registered field are treated as general submit errors and rendered near the submit button using the `),u(`code`,null,`submit-errors`),l(` slot. Return an empty value for errors the form should not handle. `)],-1)]),_:1}),s(m,{id:`prop-layout-classes`},{name:i(()=>[...c[17]||=[l(`layoutClasses`,-1)]]),type:i(()=>[...c[18]||=[l(`String`,-1)]]),"default-value":i(()=>[...c[19]||=[l(`""`,-1)]]),default:i(()=>[c[20]||=u(`p`,null,[l(` Additional classes passed to the inner `),u(`code`,null,`form-layout`),l(` . `)],-1)]),_:1}),s(m,{id:`prop-rules`},{name:i(()=>[...c[21]||=[l(`rules`,-1)]]),type:i(()=>[...c[22]||=[l(`Object`,-1)]]),"default-value":i(()=>[...c[23]||=[l(`{}`,-1)]]),default:i(()=>[c[24]||=u(`p`,null,` All validation lives here, keyed by field name. Each value is an array of rules run against the full form data on submit. Keeping validation in one place keeps it contained rather than spread across fields, and it also allows rules that rely on other fields. `,-1),s(p,t(d({code:D})),null,16),c[25]||=u(`p`,null,[l(` Each entry in a field's rules array can be either an object `),u(`code`,null,`{ rule, message?, ...ruleOptions }`),l(` or a function `),u(`code`,null,`(value, formData)`),l(` (see Function shorthand below). Available rules include: `)],-1),c[26]||=u(`h4`,{id:`rule-required`},`required`,-1),c[27]||=u(`p`,null,[l(` Requires a value to be set. Adds the `),u(`code`,null,`required`),l(` attribute to the field automatically. `)],-1),s(p,t(d({code:k})),null,16),c[28]||=u(`h4`,{id:`rule-email`},`email`,-1),c[29]||=u(`p`,null,[l(` Perform a minimal check to see if the value contains an `),u(`code`,null,`@`),l(` symbol. More complex verification isn't really necessary, and the only true way to test an email address is through verification. `)],-1),s(p,t(d({code:A})),null,16),c[30]||=u(`h4`,{id:`rule-size`},`size`,-1),c[31]||=u(`p`,null,[l(` Ensure that the provided value has at least size `),u(`code`,null,`size`),l(` . For strings, the number of characters is used, for arrays, the length of the array, for objects, the number of properties, for numbers, the number itself is used, and for numeric strings the integer value of the string is used. `)],-1),s(p,t(d({code:j})),null,16),c[32]||=u(`h4`,{id:`rule-min`},`min`,-1),c[33]||=u(`p`,null,[l(` Ensure that the provided value has at least size `),u(`code`,null,`min`),l(` . Values are evaluated as in the `),u(`code`,null,`size`),l(` rule. `)],-1),s(p,t(d({code:M})),null,16),c[34]||=u(`h4`,{id:`rule-max`},`max`,-1),c[35]||=u(`p`,null,[l(` Ensure that the provided value has at most size `),u(`code`,null,`max`),l(` . Values are evaluated as in the `),u(`code`,null,`size`),l(` rule. `)],-1),s(p,t(d({code:N})),null,16),c[36]||=u(`h4`,{id:`rule-between`},`between`,-1),c[37]||=u(`p`,null,[l(` Ensure that the provided value has between `),u(`code`,null,`min`),l(` and `),u(`code`,null,`max`),l(` size. Values are evaluated as in the `),u(`code`,null,`size`),l(` rule. `)],-1),s(p,t(d({code:P})),null,16),c[38]||=u(`h4`,{id:`rule-in`},`in`,-1),c[39]||=u(`p`,null,[l(` Ensure that the given value is included within `),u(`code`,null,`options`),l(` . `)],-1),s(p,t(d({code:F})),null,16),c[40]||=u(`h4`,{id:`rule-not-in`},`not_in`,-1),c[41]||=u(`p`,null,[l(` Ensure that the given value is not included within `),u(`code`,null,`options`),l(` . `)],-1),s(p,t(d({code:I})),null,16),c[42]||=u(`h4`,{id:`rule-regexp`},`regexp`,-1),c[43]||=u(`p`,null,[l(` Ensure that the provided value matches `),u(`code`,null,`regexp`),l(` . `)],-1),s(p,t(d({code:L})),null,16),c[44]||=u(`h4`,{id:`rule-same`},`same / different`,-1),c[45]||=u(`p`,null,[l(` Compare the value against another field's value. `),u(`code`,null,`same`),l(` requires them to match; `),u(`code`,null,`different`),l(` requires them to differ. `)],-1),s(p,t(d({code:R})),null,16),c[46]||=u(`h4`,{id:`rule-custom`},`custom`,-1),c[47]||=u(`p`,null,[l(` The escape hatch for any constraint the declarative rules can't express, including cross-field validation. `),u(`code`,null,`validate`),l(` receives the field's own value and the complete form data. `)],-1),s(p,t(d({code:z})),null,16),c[48]||=u(`h4`,{id:`rule-function`},`Function shorthand`,-1),c[49]||=u(`p`,null,[l(` A rule entry can also be a function `),u(`code`,null,`(value, formData)`),l(` instead of an object. The return value determines the outcome: `)],-1),c[50]||=u(`ul`,null,[u(`li`,null,[u(`code`,null,`true`),l(` or any truthy non-string: valid. `)]),u(`li`,null,`A non-empty string: invalid; the string is used as the error message.`),u(`li`,null,`A non-empty array of strings: invalid; each string becomes an error message.`)],-1),s(p,t(d({code:B})),null,16),c[51]||=u(`p`,null,` Form-level errors map to the named field, so they display beside the field and appear in the error summary; the error summary link still focuses the correct field. Within a field, errors follow the order of its rules array. Rules re-run on every submit, so resolved errors clear automatically. `,-1)]),_:1}),s(m,{id:`prop-schema`},{name:i(()=>[...c[52]||=[l(`schema`,-1)]]),type:i(()=>[...c[53]||=[l(`Object`,-1)]]),"default-value":i(()=>[...c[54]||=[l(`null`,-1)]]),default:i(()=>[c[55]||=u(`p`,null,[l(` A whole-object Standard Schema (e.g. Zod, Valibot), validated against the full form data in addition to `),u(`code`,null,`rules`),l(` . Both run together and merge into a single per-field result: schema errors first, then `),u(`code`,null,`rules`),l(` errors, with identical messages deduplicated. A field is invalid if either source reports an issue. `)],-1),s(p,t(d({code:O})),null,16),c[56]||=u(`p`,null,[l(` Each schema issue's `),u(`code`,null,`path[0]`),l(` maps it to its field; deeper nested paths aren't currently mapped. A whole-object schema can't express cross-field constraints ( `),u(`code`,null,`same`),l(` , `),u(`code`,null,`required_if`),l(` , `),u(`code`,null,`different`),l(` , `),u(`code`,null,`custom`),l(` ), so `),u(`code`,null,`rules`),l(` remains available alongside it for those cases. `)],-1)]),_:1}),s(m,{id:`prop-readonly`},{name:i(()=>[...c[57]||=[l(`readonly`,-1)]]),type:i(()=>[...c[58]||=[l(`Boolean`,-1)]]),"default-value":i(()=>[...c[59]||=[l(`false`,-1)]]),default:i(()=>[c[60]||=u(`p`,null,[l(` When `),u(`code`,null,`true`),l(` , all child `),u(`code`,null,`form-field`),l(` components become readonly. The `),u(`code`,null,`readonly`),l(` attribute is passed through to each field's underlying control. Use for review-mode or read-only forms where the user should not edit values. `)],-1),s(p,t(d({code:C})),null,16)]),_:1}),s(m,{id:`prop-compact`},{name:i(()=>[...c[61]||=[l(`compact`,-1)]]),type:i(()=>[...c[62]||=[l(`Boolean`,-1)]]),"default-value":i(()=>[...c[63]||=[l(`false`,-1)]]),default:i(()=>[c[64]||=u(`p`,null,[l(` When `),u(`code`,null,`true`),l(` , reduces vertical spacing in the form. The change cascades automatically to `),u(`code`,null,`form-layout`),l(` and `),u(`code`,null,`form-fieldset`),l(` . `)],-1),s(p,t(d({code:w})),null,16)]),_:1}),s(m,{id:`prop-field-types`},{name:i(()=>[...c[65]||=[l(`fieldTypes`,-1)]]),type:i(()=>[...c[66]||=[l(`Object`,-1)]]),"default-value":i(()=>[...c[67]||=[l(`{}`,-1)]]),default:i(()=>[c[68]||=u(`p`,null,[l(` Field type transformations applied to submitted form data, keyed by field name. Each value is one of `),u(`code`,null,`nullable-number`),l(` or `),u(`code`,null,`nullable-string`),l(` . `),u(`code`,null,`nullable-number`),l(` converts `),u(`code`,null,`""`),l(` / `),u(`code`,null,`null`),l(` / `),u(`code`,null,`undefined`),l(` to `),u(`code`,null,`null`),l(` , else `),u(`code`,null,`Number(value)`),l(` ( `),u(`code`,null,`NaN`),l(` → `),u(`code`,null,`null`),l(` ). `),u(`code`,null,`nullable-string`),l(` converts `),u(`code`,null,`""`),l(` to `),u(`code`,null,`null`),l(` , else keeps the value as-is. This coerces both the initial seed and submitted data, one declaration for both directions. `)],-1),s(p,t(d({code:T})),null,16)]),_:1}),s(m,{id:`prop-initial-data`},{name:i(()=>[...c[69]||=[l(`initialData`,-1)]]),type:i(()=>[...c[70]||=[l(`Object | Function`,-1)]]),"default-value":i(()=>[...c[71]||=[l(`null`,-1)]]),default:i(()=>[c[72]||=u(`p`,null,[l(` An object, ref, computed, or getter used to seed the form once it resolves truthy. When omitted, `),u(`code`,null,`modelValue`),l(` remains the source of any starting data. No `),u(`code`,null,`recordId`),l(` needed unless the form must later reseed for a different record. `)],-1),c[73]||=u(`p`,null,[l(` Rename fields inline, or with `),u(`code`,null,`mapFormData`),l(` for larger reshaping. `)],-1),s(p,t(d({code:E})),null,16)]),_:1}),s(m,{id:`prop-record-id`},{name:i(()=>[...c[74]||=[l(`recordId`,-1)]]),type:i(()=>[...c[75]||=[l(`String | Number`,-1)]]),"default-value":i(()=>[...c[76]||=[l(`null`,-1)]]),default:i(()=>[c[77]||=u(`p`,null,[l(` The stable identifier for the record that identifies the contents of this form. When the record ID changes to a new truthy value, a clean form waits for `),u(`code`,null,`initialData`),l(` to resolve and reseeds. A dirty form keeps its edits until they are saved or discarded. `)],-1),c[78]||=u(`p`,null,` Only needed when the same form later loads a different record. Pair it with a source that refetches when the id changes. `,-1)]),_:1})]),_:1}),s(y,null,{default:i(()=>[s(_,{id:`slot-pre-form`},{name:i(()=>[...c[79]||=[l(`pre-form`,-1)]]),default:i(()=>[c[80]||=u(`p`,null,[l(` Any elements to place before the form elements, and outside of the `),u(`code`,null,`form-layout`),l(` wrapper. For example, navigational items such as "Back to …" or "Forgot password". `)],-1)]),_:1}),s(_,{id:`slot-default`},{name:i(()=>[...c[81]||=[l(`default`,-1)]]),default:i(()=>[c[82]||=u(`p`,null,[l(` The `),u(`code`,null,`default`),l(` slot contains the content of the form itself, including any fields, layout elements, or information as necessary. `)],-1),c[83]||=u(`table`,null,[u(`thead`,null,[u(`tr`,null,[u(`th`,null,`Slot prop`),u(`th`,null,`Type`),u(`th`,null,`Description`)])]),u(`tbody`,null,[u(`tr`,null,[u(`td`,null,[u(`code`,null,`isSubmitting`)]),u(`td`,null,[u(`code`,null,`boolean`)]),u(`td`,null,`Whether a form submission is currently in progress.`)]),u(`tr`,null,[u(`td`,null,[u(`code`,null,`hasErrors`)]),u(`td`,null,[u(`code`,null,`boolean`)]),u(`td`,null,`Whether the form currently has validation errors.`)])])],-1)]),_:1}),s(_,{id:`slot-submit-button-label`},{name:i(()=>[...c[84]||=[l(`submit-button-label`,-1)]]),default:i(()=>[c[85]||=u(`p`,null,[l(` The label to use on the submit button. This should be representative of what is about to happen, such as "Create account" or "Update settings", not something generic, and as such `),u(`strong`,null,`no default label is provided`),l(` . `)],-1)]),_:1}),s(_,{id:`slot-secondary-actions`},{name:i(()=>[...c[86]||=[l(`secondary-actions`,-1)]]),default:i(()=>[c[87]||=u(`p`,null,` Additional actions to appear beside the submit button, such as "Save and exit" to come back to the form later. Any actions that relate to a particular field, such as "Add another", should appear with that field or group of fields, not in the actions of the form. `,-1)]),_:1}),s(_,{id:`slot-tertiary-actions`},{name:i(()=>[...c[88]||=[l(`tertiary-actions`,-1)]]),default:i(()=>[c[89]||=u(`p`,null,[l(` Additional actions to appear below the primary and secondary actions, such as "Cancel". Navigational actions, such as "Back to …" or "Forgot password" should appear above the form fields, such as in the `),u(`code`,null,`pre-form`),l(` slot. `)],-1)]),_:1}),s(_,{id:`slot-submit-errors`},{name:i(()=>[...c[90]||=[l(`submit-errors`,-1)]]),default:i(()=>[c[91]||=u(`p`,null,[l(` Overrides the default general error display near the form's actions. If not provided, a single error is rendered as a `),u(`code`,null,`<p>`),l(` and multiple errors as a `),u(`code`,null,`<ul>`),l(` . `)],-1),c[92]||=u(`table`,null,[u(`thead`,null,[u(`tr`,null,[u(`th`,null,`Slot prop`),u(`th`,null,`Type`),u(`th`,null,`Description`)])]),u(`tbody`,null,[u(`tr`,null,[u(`td`,null,[u(`code`,null,`errors`)]),u(`td`,null,[u(`code`,null,`string[]`)]),u(`td`,null,[l(` General errors produced by `),u(`code`,null,`submitErrorsCallback`),l(` whose keys don't match a registered field. `)])])])],-1)]),_:1}),s(_,{id:`slot-error-summary-title`},{name:i(()=>[...c[93]||=[l(`error-summary-title`,-1)]]),"default-value":i(()=>[...c[94]||=[l(`There is a problem`,-1)]]),default:i(()=>[c[95]||=u(`p`,null,`The title of the error summary that appears if any errors are found in the form.`,-1)]),_:1}),s(_,{id:`slot-actions-label`},{name:i(()=>[...c[96]||=[l(`actions-label`,-1)]]),default:i(()=>[c[97]||=u(`p`,null,` An optional visually hidden label for the action group, used by screen readers to identify the group's purpose. `,-1),c[98]||=u(`p`,null,` Provide a label when the form has multiple action groups that need to be distinguished (e.g. primary actions and a "danger zone"), or when actions appear far from the form fields. `,-1)]),_:1})]),_:1}),s(H,null,{default:i(()=>[s(V,{id:`event-submit`},{name:i(()=>[...c[99]||=[l(`submit`,-1)]]),default:i(()=>[c[100]||=u(`p`,null,[l(` Fired when the user submits the form and validation succeeds, containing submit-ready values. By submit-ready, we mean that the returned data only contains currently registered fields. When a field is unregistered, its value remains in `),u(`code`,null,`v-model`),l(` , but is excluded from submit unless a field with the same name is registered again. `)],-1)]),_:1}),s(V,{id:`event-v-model`},{name:i(()=>[...c[101]||=[l(`v-model`,-1)]]),default:i(()=>[c[102]||=u(`p`,null,[l(` The current value of the included form fields, in a flat object, keyed by the `),u(`code`,null,`name`),l(` value for each field. Values remain available here after a field is unregistered, even though they are excluded from submit payloads until a field with the same name is registered again. `)],-1)]),_:1})]),_:1}),s(W,null,{introduction:i(()=>[...c[103]||=[u(`p`,null,[l(` Methods and data are provided by `),u(`code`,null,`form-wrapper`),l(` under the `),u(`code`,null,`form-wrapper`),l(` namespace to allow a field to communicate and update its value. `)],-1)]]),default:i(()=>[s(U,{id:`provide-register-field`},{name:i(()=>[...c[104]||=[u(`code`,null,`registerField(field)`,-1)]]),default:i(()=>[c[105]||=u(`p`,null,`Add a field to a form's field list.`,-1),c[106]||=u(`table`,null,[u(`thead`,null,[u(`tr`,null,[u(`th`,null,`Parameter`),u(`th`,null,`Type`),u(`th`,null,`Description`)])]),u(`tbody`,null,[u(`tr`,null,[u(`td`,null,[u(`code`,null,`field.name`)]),u(`td`,null,[u(`code`,null,`string`)]),u(`td`,null,`Name of the field to register.`)]),u(`tr`,null,[u(`td`,null,[u(`code`,null,`field.id`)]),u(`td`,null,[u(`code`,null,`string`)]),u(`td`,null,`The ID of the field, helpful for linking errors to fields.`)]),u(`tr`,null,[u(`td`,null,[u(`code`,null,`field.triggerFocus`)]),u(`td`,null,[u(`code`,null,`function`)]),u(`td`,null,`Method to focus on this field, used by the error summary.`)])])],-1)]),_:1}),s(U,{id:`provide-unregister-field`},{name:i(()=>[...c[107]||=[u(`code`,null,`unregisterField(fieldName)`,-1)]]),default:i(()=>[c[108]||=u(`p`,null,[l(` Remove a field from a form's list of fields. This does not remove its value or parent-owned errors. Its value remains in `),u(`code`,null,`v-model`),l(` , but is excluded from submit payloads until a field with the same name is registered again. Error-summary links and focus-on-error only target currently registered fields, so conditionally removed fields are not targeted. `)],-1),c[109]||=u(`table`,null,[u(`thead`,null,[u(`tr`,null,[u(`th`,null,`Parameter`),u(`th`,null,`Type`),u(`th`,null,`Description`)])]),u(`tbody`,null,[u(`tr`,null,[u(`td`,null,[u(`code`,null,`fieldName`)]),u(`td`,null,[u(`code`,null,`string`)]),u(`td`,null,`The name of the field to unregister.`)])])],-1)]),_:1}),s(U,{id:`provide-update-field-value`},{name:i(()=>[...c[110]||=[u(`code`,null,`updateFieldValue(name, value)`,-1)]]),default:i(()=>[c[111]||=u(`p`,null,`Allow a field to update its value in the form.`,-1),c[112]||=u(`table`,null,[u(`thead`,null,[u(`tr`,null,[u(`th`,null,`Parameter`),u(`th`,null,`Type`),u(`th`,null,`Description`)])]),u(`tbody`,null,[u(`tr`,null,[u(`td`,null,[u(`code`,null,`name`)]),u(`td`,null,[u(`code`,null,`string`)]),u(`td`,null,`The name of the field to update.`)]),u(`tr`,null,[u(`td`,null,[u(`code`,null,`value`)]),u(`td`,null,[u(`code`,null,`unknown`)]),u(`td`,null,`The value to set.`)])])],-1)]),_:1}),s(U,{id:`provide-is-readonly`},{name:i(()=>[...c[113]||=[u(`code`,null,`isReadonly`,-1)]]),default:i(()=>[c[114]||=u(`p`,null,[l(` A reactive boolean that reflects the `),u(`code`,null,`readonly`),l(` prop. Used by `),u(`code`,null,`form-field`),l(` to cascade readonly state to underlying controls. Not intended for direct consumer use. `)],-1)]),_:1}),s(U,{id:`provide-is-compact`},{name:i(()=>[...c[115]||=[u(`code`,null,`isCompact`,-1)]]),default:i(()=>[c[116]||=u(`p`,null,[l(` A reactive boolean that reflects the `),u(`code`,null,`compact`),l(` prop. Consumed by `),u(`code`,null,`form-layout`),l(` and `),u(`code`,null,`form-fieldset`),l(` to reduce vertical spacing. Not intended for direct consumer use. `)],-1)]),_:1})]),_:1}),s(K,null,{default:i(()=>[s(G,{id:`method-use-form`},{name:i(()=>[...c[117]||=[u(`code`,null,`useForm`,-1)]]),default:i(()=>[c[118]||=u(`p`,null,[u(`code`,null,`useForm`),l(` is the composable behind `),u(`code`,null,`form-wrapper`),l(` . A custom wrapper calls it to provide the same `),u(`code`,null,`form-wrapper`),l(` injection that `),u(`code`,null,`form-field`),l(` uses. `)],-1),s(p,t(d({code:x})),null,16)]),_:1}),s(G,{id:`method-reset-submit-button`},{name:i(()=>[...c[119]||=[u(`code`,null,`resetSubmitButton`,-1)]]),default:i(()=>[c[120]||=u(`p`,null,[l(` Resets the submit button's loading state. Call this after your `),u(`code`,null,`@submit`),l(` handler completes if it does not return a Promise, for example when the async work is deferred or the result comes back via a separate channel. `)],-1)]),_:1}),s(G,{id:`expose-is-submitting`},{name:i(()=>[...c[121]||=[u(`code`,null,`isSubmitting`,-1)]]),default:i(()=>[c[122]||=u(`p`,null,[l(` A reactive boolean reflecting whether a form submission is currently in progress. Accessible via a `),u(`code`,null,`ref`),l(` on the component. `)],-1)]),_:1})]),_:1}),s(J,null,{default:i(()=>[s(q,{id:`hook-data-component`},{attribute:i(()=>[...c[123]||=[l(`data-component="form-wrapper"`,-1)]]),default:i(()=>[c[124]||=u(`p`,null,`Present on the root element. Use to scope styles to this component.`,-1)]),_:1})]),_:1}),s(Y,null,{default:i(()=>[s(g),s(v),s(b)]),_:1})]),_:1})}}};export{V as default};