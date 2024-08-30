#!/bin/bash

#
# Scaffold component
#
# Scaffold a new component for the component library, creating basic versions of
# the files required to get up and running quickly.
#
# Usage: ./support/scaffold-component.sh <component-name> [folder-name]
#
# Parameters:
#   <component-name>  (required)
#     The name of the component in kebab-case. Remember that to follow Vue
#     component naming conventions and avoid confusion with native elements, all
#     component names should contain at least two words.
#   [folder-name]  (optional)
#     The name of the folder where the component will be created.
#
# Example:
#   ./support/scaffold-component.sh data-table data
#
# Recommended alias:
#   scaffold:component
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/colours.sh"

if [ -z "$1" ]; then
	echo -e "\nPlease provide a ${BLUE}component-name${RESET_COLOUR} for the component."
	echo -e "Usage: ${PURPLE}./support/scaffold-component.sh${RESET_COLOUR} ${BLUE}<component-name>${RESET_COLOUR} [folder-name]"
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

# Generate our scaffold files from templates.
templates=(
	"component.vue"
	"component.md"
	"component.cy.js"
	"component.test.js"
	"component-preview.vue"
)

output_files=(
	"${COMPONENT_NAME}.vue"
	"${COMPONENT_NAME}.md"
	"${COMPONENT_NAME}.cy.js"
	"${COMPONENT_NAME}.test.js"
	"${COMPONENT_NAME}-preview.vue"
)

for i in "${!templates[@]}"; do
	TEMPLATE_FILE="$SCRIPT_DIR/templates/${templates[$i]}"
	OUTPUT_FILE="${output_files[$i]}"

	sed "s/{{COMPONENT_NAME}}/$COMPONENT_NAME/g; s/{{PASCAL_CASE_NAME}}/$PASCAL_CASE_NAME/g" "$TEMPLATE_FILE" > "$OUTPUT_FILE"
done

# Add the new icon to src/components/index.js
INDEX_FILE="../../index.js"

sed -i '' "/import ConditionalWrapper/a\\
import $PASCAL_CASE_NAME from \"./$FOLDER_PATH/$COMPONENT_NAME/$COMPONENT_NAME.vue\";\\
" "$INDEX_FILE"

sed -i '' "/BaseIcon,/a\\
	$PASCAL_CASE_NAME,\\
" "$INDEX_FILE"

# Print the success message
echo -e "\nComponent ${PURPLE}$COMPONENT_NAME${RESET_COLOUR} scaffolded successfully in ${BLUE}$BASE_PATH/$COMPONENT_NAME${RESET_COLOUR}.\n"
echo -e "${PURPLE}$COMPONENT_NAME${RESET_COLOUR}"
echo "  ↳ $COMPONENT_NAME.vue"
echo "  ↳ $COMPONENT_NAME.md"
echo "  ↳ $COMPONENT_NAME-preview.vue"
echo "  ↳ $COMPONENT_NAME.cy.js"
echo "  ↳ $COMPONENT_NAME.test.js"
echo "  ↳ [updated] /src/components/index.js"

