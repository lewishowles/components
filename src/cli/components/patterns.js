// Curated multi-component patterns for the pattern command.
//
// stability values:
//   "illustrative": hand-crafted starting point; adapt field names, labels,
//                    and validation to your requirements before use.
export const patterns = [
	{
		name: "data-table-example",
		label: "Data table example",
		category: "table",
		summary:
			"An async-loaded data table with search, sorting, selection, empty states, last-updated timestamp, and refresh button.",
		stability: "illustrative",
		template: `<loading-indicator v-if="isInitialLoading" large>
  Loading users…
</loading-indicator>

<template v-else-if="isReady">
  <data-table name="users" v-model="selectedUsers" v-bind="{ data: users, columns }" enable-selection>
    <template #search-label>Search users</template>
    <template #search-introduction>Find a user</template>
    <template #no-data-message>No users have been added yet.</template>
    <template #no-results-message="{ searchQuery }">
      No users match "{{ searchQuery }}".
    </template>
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
		name: "form-example",
		label: "Form example",
		category: "form",
		summary:
			"A complete form with validation, conditional fields, file upload, confirmation, and submit lifecycle handlers.",
		stability: "illustrative",
		template: `<template>
  <form-wrapper v-bind="form">
    <form-field name="full_name">
      Full name
    </form-field>

    <form-field name="email" type="email">
      Email address
    </form-field>

    <form-field
      name="is_vat_registered"
      type="select"
      :options="[
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ]"
    >
      Is your organisation VAT registered?
    </form-field>

    <form-field name="vat_number">
      VAT number
    </form-field>

    <form-field name="organisation">
      Organisation
    </form-field>

    <form-field name="supporting_documents" type="file" multiple>
      Supporting documents

      <template #help>Upload any documents that help us answer your message.</template>
    </form-field>

    <form-field name="message" type="textarea">
      Message
    </form-field>

    <template #submit-button-label>Send message</template>
    <template #tertiary-actions>
      <link-tag href="/contact">Cancel</link-tag>
    </template>
  </form-wrapper>
</template>

<script setup>
import { useForm } from "@lewishowles/components/composables";
import { ConfirmDialog, useModalDialog } from "@lewishowles/components";

const { openModal } = useModalDialog();

const { form } = useForm({
  rules: {
    full_name: [{ rule: "required", message: "Enter your full name." }],
    email: [
      { rule: "required", message: "Enter your email address." },
      { rule: "email", message: "Enter a valid email address." },
    ],
    is_vat_registered: [{ rule: "required", message: "Choose yes or no." }],
    vat_number: [
      {
        rule: "required_if",
        field: "is_vat_registered",
        value: "yes",
        message: "Enter your VAT number.",
      },
    ],
    message: [{ rule: "required", message: "Tell us how we can help." }],
  },
  onSubmit(formData) {
    return new Promise((resolve, reject) => {
      let confirmed = false;

      openModal(ConfirmDialog, {
        danger: true,
        onConfirm: () => {
          confirmed = true;
          console.log("Submitting", formData);
          resolve(formData);
        },
        onClose: () => {
          if (!confirmed) {
            reject(new Error("Submission cancelled"));
          }
        },
      });
    });
  },
  submitErrorsCallback: () => ({ cancelled: ["Submission cancelled."] }),
  onSuccess: (result, formData) =>
    console.log("Submitted successfully", result, formData),
  onError: (error, formData) => console.error("Submit failed", error, formData),
  onSettled: (result, error, formData) =>
    console.log("Submit settled", result, error, formData),
});
</script>`,
	},
];

// Patterns keyed by name for direct lookup.
export const patternsByName = Object.fromEntries(
	patterns.map((pattern) => [pattern.name, pattern]),
);
