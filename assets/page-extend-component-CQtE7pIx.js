import{Ct as e,M as t,O as n,V as r,c as i,h as a,m as o,s,v as c}from"./runtime-core.esm-bundler-D8JxCXTF.js";var l=`<!-- src/components/form/form-wrapper/form-wrapper.vue -->
<script setup>
import { extendComponent } from "@lewishowles/components/utilities";
import { parseApiFieldErrors } from "@/helpers/api";
import { FormWrapper } from "@lewishowles/components";

const ExtendedComponent = extendComponent(FormWrapper, {
	props: { fieldErrorsCallback: parseApiFieldErrors },
});
<\/script>

<template>
	<extended-component v-bind="$attrs">
		<template v-for="(_, slot) in $slots" #[slot]="slotProps">
			<slot :name="slot" v-bind="slotProps ?? {}" />
		</template>
	</extended-component>
</template>`,u=`import { extendComponent } from "@lewishowles/components/utilities";
import { parseApiFieldErrors } from "@/helpers/api";

import { FormWrapper } from "@lewishowles/components";

export default extendComponent(FormWrapper, {
	name: "form-wrapper",
	props: { fieldErrorsCallback: parseApiFieldErrors },
});`,d=`<form-wrapper v-model="form" @submit="save">
	<form-field name="email">Email</form-field>

	<template #submit-button-label>Create account</template>
</form-wrapper>`,f=`import FormWrapper from "@/components/form/form-wrapper";

<form-wrapper v-model="form" @submit="save">
	<form-field name="email">Email</form-field>

	<template #submit-button-label>Create account</template>
</form-wrapper>`,p={__name:`page-extend-component`,setup(p){return(p,m)=>{let h=t(`router-link`),g=t(`component-parameter`),_=t(`component-parameters`),v=t(`component-return`),y=t(`component-returns`),b=t(`code-block`),x=t(`component-tab`),S=t(`component-page`);return n(),i(S,null,{title:r(()=>[...m[0]||=[o(`extendComponent`,-1)]]),introduction:r(()=>[m[4]||=s(`p`,null,[s(`code`,null,`extendComponent`),o(` creates a wrapper around an existing component that forwards all props, attributes, slots, `),s(`code`,null,`v-model`),o(` bindings, and exposed methods automatically, while allowing default props and slots to be provided. `)],-1),s(`p`,null,[m[2]||=o(` It is intended for wrapping a library component in your own application to inject project-specific defaults, such as a shared error-parsing callback on `,-1),a(h,{to:{name:`form-wrapper`}},{default:r(()=>[...m[1]||=[s(`code`,null,`form-wrapper`,-1)]]),_:1}),m[3]||=o(` , without having to re-declare its interface. Anything the caller provides takes precedence over the defaults, so the wrapper can be a simple drop-in replacement. `,-1)])]),default:r(()=>[a(_,null,{default:r(()=>[a(g,{id:`parameter-base-component`},{name:r(()=>[...m[5]||=[o(`baseComponent`,-1)]]),type:r(()=>[...m[6]||=[o(`object`,-1)]]),default:r(()=>[m[7]||=s(`p`,null,`The component to extend.`,-1)]),_:1}),a(g,{id:`parameter-options`},{name:r(()=>[...m[8]||=[o(`options`,-1)]]),type:r(()=>[...m[9]||=[o(`object`,-1)]]),default:r(()=>[m[10]||=s(`p`,null,`Optional configuration for the wrapper.`,-1),m[11]||=s(`table`,null,[s(`thead`,null,[s(`tr`,null,[s(`th`,null,`Option`),s(`th`,null,`Type`),s(`th`,null,`Description`)])]),s(`tbody`,null,[s(`tr`,null,[s(`td`,null,[s(`code`,null,`name`)]),s(`td`,null,[s(`code`,null,`string`)]),s(`td`,null,[o(` An optional name for the resulting component. Defaults to `),s(`code`,null,`extended-{name}`),o(` based on the base component. `)])]),s(`tr`,null,[s(`td`,null,[s(`code`,null,`props`)]),s(`td`,null,[s(`code`,null,`object`)]),s(`td`,null,`Default props to apply, overridable by the caller.`)]),s(`tr`,null,[s(`td`,null,[s(`code`,null,`slots`)]),s(`td`,null,[s(`code`,null,`object`)]),s(`td`,null,`Default slots, as render functions, overridable by the caller.`)])])],-1)]),_:1})]),_:1}),a(y,null,{default:r(()=>[a(v,{id:`return-component`},{name:r(()=>[...m[12]||=[o(`component`,-1)]]),type:r(()=>[...m[13]||=[o(`object`,-1)]]),default:r(()=>[m[14]||=s(`p`,null,[o(` A new component that renders the base component with the provided defaults applied, and all caller-provided props, attributes, slots, `),s(`code`,null,`v-model`),o(` bindings, and exposed methods forwarded automatically. `)],-1)]),_:1})]),_:1}),a(x,e(c({id:`tab-example`,icon:`icon-code`})),{title:r(()=>[...m[15]||=[o(`Example`,-1)]]),default:r(()=>[m[16]||=s(`h3`,null,`With auto-imports (recommended)`,-1),m[17]||=s(`p`,null,[o(` If your project uses `),s(`code`,null,`unplugin-vue-components`),o(` or similar auto-import tooling, the simplest approach is to create a local `),s(`code`,null,`.vue`),o(` wrapper. `)],-1),a(b,{code:l}),m[18]||=s(`p`,null,`Then use it anywhere, and auto-imports will resolve it:`,-1),a(b,{code:d}),m[19]||=s(`p`,null,` The local wrapper takes precedence over the library component because auto-imports scan local components before applying custom resolvers. `,-1),m[20]||=s(`h3`,null,`Without auto-imports`,-1),m[21]||=s(`p`,null,` If your project doesn't use auto-imports, define the wrapper as a JavaScript module and import it explicitly where needed. `,-1),a(b,e(c({code:u,file:`src/components/form/form-wrapper/form-wrapper.js`})),null,16),m[22]||=s(`p`,null,`Then import and use it:`,-1),a(b,{code:f})]),_:1},16)]),_:1})}}};export{p as default};