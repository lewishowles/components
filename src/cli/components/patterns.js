// Curated multi-component patterns for the pattern command.
//
// stability values:
//   "illustrative": hand-crafted starting point; adapt field names, labels,
//                    and validation to your requirements before use.
export const patterns = [
	{
		name: "contact-form",
		label: "Contact form",
		category: "form",
		summary: "Name, email address, and message with a submit button.",
		stability: "illustrative",
		template: `<form-wrapper v-bind="form" :rules="{ name: [{ rule: 'required' }], email: [{ rule: 'required' }, { rule: 'email' }], message: [{ rule: 'required' }] }">
  <form-field name="name">
    Full name
  </form-field>

  <form-field name="email" type="email">
    Email address
  </form-field>

  <form-field name="message" type="textarea">
    Message
  </form-field>

  <template #submit-button-label>Send message</template>
</form-wrapper>`,
	},
	{
		name: "data-table-list",
		label: "Data table list",
		category: "table",
		summary:
			"An async-loaded data table with a loading state, last-updated timestamp, and refresh button.",
		stability: "illustrative",
		template: `<loading-indicator v-if="isInitialLoading" large>
  Loading users…
</loading-indicator>

<template v-else-if="isReady">
  <data-table name="users" :data="users" :columns="columns">
    <template #search-label>Search users</template>
    <template #search-introduction>Find a user</template>
    <template #no-data-message>No users to display</template>
  </data-table>

  <div class="mt-10 flex items-center justify-end gap-4 text-sm">
    <p class="flex shrink-0 flex-col items-end">
      <span>Last updated</span>
      <relative-date :date="lastFetched" />
    </p>

    <ui-button class="button--muted" icon-start="icon-reload" reactive @click="refetch">
      Refresh
    </ui-button>
  </div>
</template>`,
	},
	{
		name: "login-form",
		label: "Login form",
		category: "form",
		summary: "Email address and password with a submit button.",
		stability: "illustrative",
		template: `<form-wrapper v-bind="form" :rules="{ email: [{ rule: 'required' }, { rule: 'email' }], password: [{ rule: 'required' }] }">
  <form-field name="email" type="email">
    Email address
  </form-field>

  <form-field name="password" type="password">
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
		template: `<form-wrapper v-bind="form" :rules="{ displayName: [{ rule: 'required' }], email: [{ rule: 'required' }, { rule: 'email' }] }">
  <form-field name="displayName">
    Display name
  </form-field>

  <form-field name="email" type="email">
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
