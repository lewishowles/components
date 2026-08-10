import{Ct as e,M as t,O as n,V as r,c as i,h as a,m as o,s,v as c}from"./runtime-core.esm-bundler-D8JxCXTF.js";var l=`<template>
	<form-wrapper v-if="isReady" v-model="formData" @submit="saveProfile">
		<form-field name="name">Full name</form-field>
		<form-field name="email" type="email">Email address</form-field>

		<template #submit-button-label>Save profile</template>
	</form-wrapper>
</template>

<script setup>
import { computed } from "vue";
import { useFormData } from "@lewishowles/components/composables";
import { useUser } from "@/queries/use-user";

const { data: profile } = useUser();
const isReady = computed(() => Boolean(profile.value));

const formData = useFormData(profile, (data) => ({
	email: data.email,
	name: data.name,
}));
<\/script>`,u=`const formData = useFormData(profile, {
	fields: { name: "firstName", email: "emailAddress" },
	fieldTypes: { age: "nullable-number" },
});`,d={__name:`page-use-form-data`,setup(d){return(d,f)=>{let p=t(`router-link`),m=t(`component-return`),h=t(`component-returns`),g=t(`component-method`),_=t(`component-methods`),v=t(`code-block`),y=t(`component-tab`),b=t(`component-page`);return n(),i(b,null,{title:r(()=>[...f[0]||=[o(`useFormData`,-1)]]),introduction:r(()=>[s(`p`,null,[f[2]||=s(`code`,null,`useFormData`,-1),f[3]||=o(` prepares the `,-1),f[4]||=s(`code`,null,`formData`,-1),f[5]||=o(` ref that is passed to `,-1),a(p,{to:{name:`form-wrapper`}},{default:r(()=>[...f[1]||=[s(`code`,null,`form-wrapper`,-1)]]),_:1}),f[6]||=o(` or `,-1),f[7]||=s(`code`,null,`useForm`,-1),f[8]||=o(` . It initialises values from an async data source, such as the `,-1),f[9]||=s(`code`,null,`data`,-1),f[10]||=o(` ref from a Pinia Colada query. It populates the form once when the source first becomes available. `,-1)]),f[11]||=s(`p`,null,[o(` When using this composable, gate the form on the query's `),s(`code`,null,`isReady`),o(` so fields mount only after data is available. `)],-1)]),default:r(()=>[a(h,null,{default:r(()=>[a(m,{id:`return-form-data`},{name:r(()=>[...f[12]||=[o(`formData`,-1)]]),type:r(()=>[...f[13]||=[o(`Ref<object>`,-1)]]),default:r(()=>[f[14]||=s(`p`,null,[o(` The form data object, initialised as `),s(`code`,null,`{}`),o(` and populated with the mapped value once the source resolves. `)],-1)]),_:1})]),_:1}),a(_,null,{default:r(()=>[a(g,{id:`method-use-form-data`},{name:r(()=>[...f[15]||=[s(`code`,null,`useFormData(source, mapper)`,-1)]]),default:r(()=>[f[16]||=s(`p`,null,[o(` The second argument accepts either a mapper function, or a declarative `),s(`code`,null,`{ fields, fieldTypes }`),o(` options object. `)],-1),f[17]||=s(`table`,null,[s(`thead`,null,[s(`tr`,null,[s(`th`,null,`Parameter`),s(`th`,null,`Type`),s(`th`,null,`Purpose`)])]),s(`tbody`,null,[s(`tr`,null,[s(`td`,null,[s(`code`,null,`source`)]),s(`td`,null,[s(`code`,null,`Ref`)]),s(`td`,null,[o(` The async data source to watch. Typically the `),s(`code`,null,`data`),o(` ref from a Pinia Colada query. `)])]),s(`tr`,null,[s(`td`,null,[s(`code`,null,`mapper`)]),s(`td`,null,[s(`code`,null,`function | object`)]),s(`td`,null,[o(` A function that maps the resolved source value to the initial form data object, or an options object `),s(`code`,null,`{ fields, fieldTypes }`),o(` for declarative field selection and type normalisation. `)])]),s(`tr`,null,[s(`td`,null,[s(`code`,null,`mapper.fields`)]),s(`td`,null,[s(`code`,null,`string[] | object`)]),s(`td`,null,[o(` An array of keys to pick from the source, or an object mapping form field names to source keys for renaming, e.g. `),s(`code`,null,`{ name: "firstName" }`),o(` . `)])]),s(`tr`,null,[s(`td`,null,[s(`code`,null,`mapper.fieldTypes`)]),s(`td`,null,[s(`code`,null,`object`)]),s(`td`,null,[o(` Field type transformations keyed by form field name. `),s(`code`,null,`nullable-number`),o(` converts `),s(`code`,null,`null`),o(` / `),s(`code`,null,`undefined`),o(` to `),s(`code`,null,`""`),o(` and otherwise stringifies the value; `),s(`code`,null,`nullable-string`),o(` converts `),s(`code`,null,`null`),o(` / `),s(`code`,null,`undefined`),o(` to `),s(`code`,null,`""`),o(` and otherwise keeps the value as-is. Fields without a listed type pass through unchanged. `)])])])],-1)]),_:1})]),_:1}),a(y,e(c({id:`tab-examples`,icon:`icon-code`})),{title:r(()=>[...f[18]||=[o(`Examples`,-1)]]),default:r(()=>[a(v,{code:l}),a(v,{code:u})]),_:1},16)]),_:1})}}};export{d as default};