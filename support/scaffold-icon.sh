#!/bin/bash

#
# Scaffold icon
#
# Scaffold a new icon for the component library, creating basic versions of
# the files required to get up and running quickly. Since icons are a little
# different to regular components, this setup differs too.
#
# Parameters:
#   <icon-name>  (required)
#     The name of the icon in kebab-case. To meet Vue component naming
#     conventions and ensure all components consist of at least two words to
#     avoid confusion with native elements, it is recommended that icons start
#     with "icon-".
#
# Example:
#   ./support/scaffold-icon.sh icon- data
#
# Recommended alias:
#   scaffold:icon
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/colours.sh"

if [ -z "$1" ]; then
	echo -e "\nPlease provide an ${BLUE}icon-name${RESET_COLOUR} for the icon"
	echo -e "Usage: ${PURPLE}./support/scaffold-icon.sh${RESET_COLOUR} ${BLUE}<icon-name>${RESET_COLOUR}"
	exit 1
fi

ICON_NAME="$1"

# The base path is where the icon will be created.
BASE_PATH="src/components/icon"

mkdir -p "$BASE_PATH/$ICON_NAME"
cd "$BASE_PATH/$ICON_NAME"

# Generate a PascalCase version of our name
PASCAL_CASE_NAME=$(echo "$ICON_NAME" | awk -F- '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1' OFS='')

# Generate our scaffold files from templates.
templates=(
	"icon.vue"
	"icon.cy.js"
	"icon.test.js"
)

output_files=(
	"${ICON_NAME}.vue"
	"${ICON_NAME}.cy.js"
	"${ICON_NAME}.test.js"
)

for i in "${!templates[@]}"; do
	TEMPLATE_FILE="$SCRIPT_DIR/templates/${templates[$i]}"
	OUTPUT_FILE="${output_files[$i]}"

	sed "s/{{ICON_NAME}}/$ICON_NAME/g; s/{{PASCAL_CASE_NAME}}/$PASCAL_CASE_NAME/g" "$TEMPLATE_FILE" > "$OUTPUT_FILE"
done

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

# Print the success message
echo -e "\nIcon ${PURPLE}$ICON_NAME${RESET_COLOUR} scaffolded successfully in ${BLUE}$BASE_PATH/$ICON_NAME${RESET_COLOUR}.\n"
echo -e "${PURPLE}$ICON_NAME${RESET_COLOUR}"
echo "  ↳ $ICON_NAME.vue"
echo "  ↳ $ICON_NAME.cy.js"
echo "  ↳ $ICON_NAME.test.js"
echo "  ↳ [updated] /src/components/index.js"
echo "  ↳ [updated] /src/components/icon/icon.md"
