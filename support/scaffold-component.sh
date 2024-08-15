#!/bin/bash

if [ -z "$1" ]; then
    echo "Please provide a name for the component."
    exit 1
fi

COMPONENT_NAME="$1"
FOLDER_PATH="${2:-}"

# The base path is where the component will be created.
BASE_PATH="src/components"

# If a folder path is provided, append it to the base path
if [ -n "$FOLDER_PATH" ]; then
    BASE_PATH="$BASE_PATH/$FOLDER_PATH"
fi

mkdir -p "$BASE_PATH/$COMPONENT_NAME"
cd "$BASE_PATH/$COMPONENT_NAME"

# Generate a PascalCase version of our name
PASCAL_CASE_NAME=$(echo "$COMPONENT_NAME" | awk -F- '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1' OFS='')

# Index
echo "import $PASCAL_CASE_NAME from \"./$COMPONENT_NAME.vue\";

export default { $PASCAL_CASE_NAME };" > index.js

# Vue component
echo '<template>

</template>

<script setup>
import { ref } from "vue";

const props = defineProps({

});
</script>' > "$COMPONENT_NAME.vue"

# Cypress test suite
echo "import $PASCAL_CASE_NAME from \"./$COMPONENT_NAME.vue\";
import { createMount } from \"@cypress/support/mount\";

const mount = createMount($PASCAL_CASE_NAME);

describe(\"$COMPONENT_NAME\", () => {
	it(\"renders\", () => {
		mount();
	});
});" > "$COMPONENT_NAME.cy.js"

# Unit test suite
echo "import { createMount } from \"@unit/support/mount\";
import { describe, expect, test } from \"vitest\";
import $PASCAL_CASE_NAME from \"./$COMPONENT_NAME.vue\";

const mount = createMount($PASCAL_CASE_NAME);

describe(\"$COMPONENT_NAME\", () => {
	describe(\"Initialisation\", () => {
		test(\"should exist as a Vue component\", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf(\"object\");
		});
	});
});" > "$COMPONENT_NAME.test.js"

# Preview
echo "<template>
	<preview-wrapper>
		<template #title>
			$COMPONENT_NAME
		</template>

		<preview-section>
			<template #title>
				Section
			</template>

			<$COMPONENT_NAME />
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import PreviewSection from \"@/preview/preview-section.vue\";
import PreviewWrapper from \"@/preview/preview-wrapper.vue\";
</script>
" > "$COMPONENT_NAME-preview.vue"

PURPLE='\033[1;35m'
BLUE='\033[1;34m'
RESET_COLOUR='\033[0m'

# Print the success message
echo -e "\nComponent ${PURPLE}$COMPONENT_NAME${RESET_COLOUR} scaffolded successfully in ${BLUE}$BASE_PATH/$COMPONENT_NAME${RESET_COLOUR}.\n"
echo -e "${PURPLE}$COMPONENT_NAME${RESET_COLOUR}"
echo "  ↳ index.js"
echo "  ↳ $COMPONENT_NAME.vue"
echo "  ↳ $COMPONENT_NAME-preview.vue"
echo "  ↳ $COMPONENT_NAME.cy.js"
echo "  ↳ $COMPONENT_NAME.test.js"

