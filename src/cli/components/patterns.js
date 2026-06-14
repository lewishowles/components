// Curated multi-component patterns for the pattern command.
//
// stability values:
//   "illustrative" — hand-crafted starting point; adapt field names, labels,
//                    and validation to your requirements before use.
export const patterns = [
	{
		name: "contact-form",
		label: "Contact form",
		category: "form",
		summary: "Name, email address, and message with a submit button.",
		stability: "illustrative",
		template: `<form-wrapper v-model="form" @submit="handleSubmit">
  <form-field name="name" :validation="[{ rule: 'required' }]">
    Full name
  </form-field>

  <form-field name="email" type="email" :validation="[{ rule: 'required' }, { rule: 'email' }]">
    Email address
  </form-field>

  <form-field name="message" type="textarea" :validation="[{ rule: 'required' }]">
    Message
  </form-field>

  <template #submit-button-label>Send message</template>
</form-wrapper>`,
	},
	{
		name: "login-form",
		label: "Login form",
		category: "form",
		summary: "Email address and password with a submit button.",
		stability: "illustrative",
		template: `<form-wrapper v-model="form" @submit="handleSubmit">
  <form-field name="email" type="email" :validation="[{ rule: 'required' }, { rule: 'email' }]">
    Email address
  </form-field>

  <form-field name="password" type="password" :validation="[{ rule: 'required' }]">
    Password
  </form-field>

  <template #submit-button-label>Sign in</template>
</form-wrapper>`,
	},
	{
		name: "settings-form",
		label: "Settings form",
		category: "form",
		summary: "A named settings section with a save button and cancel link.",
		stability: "illustrative",
		template: `<form-wrapper v-model="form" @submit="handleSubmit">
  <form-field name="displayName" :validation="[{ rule: 'required' }]">
    Display name
  </form-field>

  <form-field name="email" type="email" :validation="[{ rule: 'required' }, { rule: 'email' }]">
    Email address
  </form-field>

  <template #submit-button-label>Save changes</template>
  <template #secondary-actions>
    <link-tag href="/settings">Cancel</link-tag>
  </template>
</form-wrapper>`,
	},
];

// Patterns keyed by name for direct lookup.
export const patternsByName = Object.fromEntries(
	patterns.map((pattern) => [pattern.name, pattern]),
);
