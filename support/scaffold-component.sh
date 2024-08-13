#!/bin/bash

if [ -z "$1" ]; then
	echo "Please provide a name for the component."
	exit 1
fi

# The base path is where the component will be created.
BASE_PATH="src/components"

mkdir -p "$BASE_PATH/$1"
cd "$BASE_PATH/$1"

# Generate a PascalCase version of our name
PASCAL_CASE_NAME=$(echo "$1" | awk -F- '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1' OFS='')

# Index
echo "import $PASCAL_CASE_NAME from \"./$1.vue\";

export default { $PASCAL_CASE_NAME };" > index.js

# Vue component
echo '<template>

</template>

<script setup>
import { ref } from "vue";

const props = defineProps({

});
</script>' > "$1.vue"

# Cypress test suite
echo "import $PASCAL_CASE_NAME from \"./$1.vue\";
import { createMount } from \"@cypress/support/mount\";

const mount = createMount($PASCAL_CASE_NAME);

describe(\"$1\", () => {
	it(\"renders\", () => {
		mount();
	});
});" > "$1.cy.js"

# Unit test suite
echo "import { createMount } from \"@unit/support/mount\";
import { describe, expect, test } from \"vitest\";
import $PASCAL_CASE_NAME from \"./$1.vue\";

const mount = createMount($PASCAL_CASE_NAME);

describe(\"$1\", () => {
	describe(\"Initialisation\", () => {
		test(\"should exist as a Vue component\", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf(\"object\");
		});
	});
});" > "$1.test.js"

PURPLE='\033[1;35m'
BLUE='\033[1;34m'
RESET_COLOUR='\033[0m'

# Print the success message with colors
echo -e "\nComponent ${PURPLE}$1${RESET_COLOUR} scaffolded successfully in ${BLUE}$BASE_PATH/$1${RESET_COLOUR}.\n"
echo -e "${PURPLE}$1${RESET_COLOUR}"
echo "  ↳ index.js"
echo "  ↳ $1.vue"
echo "  ↳ $1.cy.js"
echo "  ↳ $1.test.js"
