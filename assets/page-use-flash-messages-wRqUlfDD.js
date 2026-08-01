import{Ct as e,M as t,O as n,V as r,c as i,h as a,m as o,s,v as c}from"./runtime-core.esm-bundler-DJDazOtI.js";var l=`<template>
	<button type="button" @click="saveProfile">Save profile</button>
	<flash-messages v-bind="{ namespace }" />
</template>

<script setup>
import { useFlashMessages } from "@lewishowles/components/composables";

const namespace = "profile-form";
const { sendMessage } = useFlashMessages();

function saveProfile() {
	sendMessage({
		namespace,
		type: "success",
		title: "Profile saved",
		message: "Your profile changes have been saved.",
	});
}
<\/script>`,u={__name:`page-use-flash-messages`,setup(u){return(u,d)=>{let f=t(`router-link`),p=t(`component-method`),m=t(`component-methods`),h=t(`code-block`),g=t(`component-tab`),_=t(`component-page`);return n(),i(_,null,{title:r(()=>[...d[0]||=[o(`useFlashMessages`,-1)]]),introduction:r(()=>[d[6]||=s(`p`,null,[s(`code`,null,`useFlashMessages`),o(` provides shared flash-message state for messages that should appear somewhere else in the page after an action completes. `)],-1),s(`p`,null,[d[2]||=o(` Messages are shown by `,-1),a(f,{to:{name:`flash-messages`}},{default:r(()=>[...d[1]||=[s(`code`,null,`flash-messages`,-1)]]),_:1}),d[3]||=o(` . Pass a `,-1),d[4]||=s(`code`,null,`namespace`,-1),d[5]||=o(` when the message should appear in a specific outlet, or omit it for page-level messages. `,-1)])]),default:r(()=>[a(m,null,{default:r(()=>[a(p,{id:`method-send-message`},{name:r(()=>[...d[7]||=[s(`code`,null,`sendMessage(message)`,-1)]]),default:r(()=>[d[8]||=s(`p`,null,[o(` Add a message. The message should include `),s(`code`,null,`type`),o(` , `),s(`code`,null,`title`),o(` , and `),s(`code`,null,`message`),o(` . It may also include `),s(`code`,null,`namespace`),o(` , `),s(`code`,null,`showIcon`),o(` , `),s(`code`,null,`live`),o(` , and `),s(`code`,null,`titleTag`),o(` . A unique `),s(`code`,null,`id`),o(` is added when the message is stored. `)],-1)]),_:1}),a(p,{id:`method-get-messages`},{name:r(()=>[...d[9]||=[s(`code`,null,`getMessages(namespace?)`,-1)]]),default:r(()=>[d[10]||=s(`p`,null,` Get messages for a namespace. When no namespace is provided, only messages without a namespace are returned. `,-1)]),_:1}),a(p,{id:`method-clear-messages`},{name:r(()=>[...d[11]||=[s(`code`,null,`clearMessages(namespace?)`,-1)]]),default:r(()=>[d[12]||=s(`p`,null,` Clear messages for a namespace. When no namespace is provided, only messages without a namespace are cleared. `,-1)]),_:1}),a(p,{id:`method-clear-all-messages`},{name:r(()=>[...d[13]||=[s(`code`,null,`_clearMessages()`,-1)]]),default:r(()=>[d[14]||=s(`p`,null,` Remove every flash message. Intended for internal and testing use only; it clears messages requested by any component. `,-1)]),_:1})]),_:1}),a(g,e(c({id:`tab-examples`,icon:`icon-code`})),{title:r(()=>[...d[15]||=[o(`Examples`,-1)]]),default:r(()=>[a(h,{code:l})]),_:1},16)]),_:1})}}};export{u as default};