#!/bin/bash

#
# Scaffold icon
#
# Scaffold a new icon for the component library, creating basic versions of
# the files required to get up and running quickly. Since icons are a little
# different to regular components, this setup differs too.
#
# Usage:
# ./support/scaffold-component.sh icon-name
#

if [ -z "$1" ]; then
    echo "Please provide a name for the icon."
    exit 1
fi

ICON_NAME="$1"

# The base path is where the icon will be created.
BASE_PATH="src/components/icon"

mkdir -p "$BASE_PATH/$ICON_NAME"
cd "$BASE_PATH/$ICON_NAME"

# Generate a PascalCase version of our name
PASCAL_CASE_NAME=$(echo "$ICON_NAME" | awk -F- '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1' OFS='')

# Vue component
echo '<template>
	<base-icon>

	</base-icon>
</template>' > "$ICON_NAME.vue"

# Cypress test suite
echo "import $PASCAL_CASE_NAME from \"./$ICON_NAME.vue\";
import { createMount } from \"@cypress/support/mount\";

const defaultProps = { class: \"stroke-blue-800\" };
const mount = createMount($PASCAL_CASE_NAME, { props: defaultProps });

describe(\"$ICON_NAME\", () => {
	it(\"Renders an icon\", () => {
		mount();

		cy.get(\"svg\").shouldBeVisible();
	});
});
" > "$ICON_NAME.cy.js"

# Unit test suite
echo "import { createMount } from \"@unit/support/mount\";
import { describe, expect, test } from \"vitest\";
import $PASCAL_CASE_NAME from \"./$ICON_NAME.vue\";

const mount = createMount($PASCAL_CASE_NAME);

describe(\"$ICON_NAME\", () => {
	describe(\"Initialisation\", () => {
		test(\"should exist as a Vue component\", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf(\"object\");
		});
	});
});" > "$ICON_NAME.test.js"

# Add the new icon to src/components/index.js
INDEX_FILE="../../index.js"

sed -i '' "/import BaseIcon/a\\
import $PASCAL_CASE_NAME from \"./icon/$ICON_NAME/$ICON_NAME.vue\";\\
" "$INDEX_FILE"

sed -i '' "/BaseIcon,/a\\
	$PASCAL_CASE_NAME,\\
" "$INDEX_FILE"

# Add the new icon to src/components/icon/icon.md
INDEX_FILE="../../icon/icon.md"

sed -i '' "/- icon-chevron-down.vue/a\\
- $ICON_NAME.vue\\
" "$INDEX_FILE"

PURPLE='\033[1;35m'
BLUE='\033[1;34m'
RESET_COLOUR='\033[0m'

# Print the success message
echo -e "\nIcon ${PURPLE}$ICON_NAME${RESET_COLOUR} scaffolded successfully in ${BLUE}$BASE_PATH/$ICON_NAME${RESET_COLOUR}.\n"
echo -e "${PURPLE}$ICON_NAME${RESET_COLOUR}"
echo "  ↳ $ICON_NAME.vue"
echo "  ↳ $ICON_NAME.cy.js"
echo "  ↳ $ICON_NAME.test.js"
echo "  ↳ [updated] /src/components/index.js"
echo "  ↳ [updated] /src/components/icon/icon.md"
