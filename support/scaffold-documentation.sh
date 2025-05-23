#!/bin/bash

#
# Scaffold component
#
# Scaffold a new component for the component library, creating basic versions of
# the files required to get up and running quickly.
#
# Usage: ./support/scaffold-documentation.sh <component-name> --folder [folder-name]
#
# Parameters:
#   <component-name>  (required)
#     The name of the component in kebab-case that this documentation page will
#     represent
#   --folder [folder-name]  (optional)
#     The name of the folder where the component will be created in the root
#     components documentation folder.
#
# Example:
#   ./support/scaffold-documentation.sh data-table --folder data
#
# Recommended alias:
#   scaffold:documentation
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/colours.sh"

if [ -z "$1" ]; then
	echo -e "\nPlease provide a ${BLUE}component-name${RESET_COLOUR} for the component."
	echo -e "Usage: ${PURPLE}./support/scaffold-documentation.sh${RESET_COLOUR} ${BLUE}<component-name>${RESET_COLOUR} [--folder <folder-name>]"
	exit 1
fi

# Determine the passed parameters
COMPONENT_NAME="$1"
shift

FOLDER_PATH=""

while [[ "$#" -gt 0 ]]; do
	case $1 in
		--folder)
			FOLDER_PATH="$2"
			shift
			;;
		*)
			echo -e "\nUnknown parameter passed: $1"
			echo -e "Usage: ${PURPLE}./support/scaffold-documentation.sh${RESET_COLOUR} ${BLUE}<component-name>${RESET_COLOUR} [--folder <folder-name>]"
			exit 1
			;;
	esac
    shift
done

# The base path is where the component will be created.
BASE_PATH="src/views/components"

# If a folder path is provided, append it to the base path
if [ -n "$FOLDER_PATH" ]; then
    BASE_PATH="$BASE_PATH/$FOLDER_PATH"
fi

mkdir -p "$BASE_PATH/page-$COMPONENT_NAME"
cd "$BASE_PATH/page-$COMPONENT_NAME"
mkdir -p "fragments"

# Generate a PascalCase version of our name, used within component templates.
PASCAL_CASE_NAME=$(echo "$COMPONENT_NAME" | awk -F- '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1' OFS='')
# Generate a Sentence case version of our name, used for titles.
SENTENCE_CASE_NAME="$(echo "$COMPONENT_NAME" | tr '-' ' ' | awk '{ $1=toupper(substr($1,1,1)) tolower(substr($1,2)); print }')"

# Generate our scaffold files from templates.
templates=(
	"documentation-page.vue"
	"documentation-playground.vue"
)

output_files=(
	"page-${COMPONENT_NAME}.vue"
	"fragments/playground-${COMPONENT_NAME}.vue"
)

for i in "${!templates[@]}"; do
	TEMPLATE_FILE="$SCRIPT_DIR/templates/${templates[$i]}"
	OUTPUT_FILE="${output_files[$i]}"

	sed "s/{{COMPONENT_NAME}}/$COMPONENT_NAME/g; s/{{PASCAL_CASE_NAME}}/$PASCAL_CASE_NAME/g; s/{{SENTENCE_CASE_NAME}}/$SENTENCE_CASE_NAME/g" "$TEMPLATE_FILE" > "$OUTPUT_FILE"

	code -r $OUTPUT_FILE
done

# Print the success message
echo -e "\nDocumentation ${PURPLE}$COMPONENT_NAME${RESET_COLOUR} scaffolded successfully in ${BLUE}$BASE_PATH/$COMPONENT_NAME${RESET_COLOUR}.\n"
echo -e "${PURPLE}page-$COMPONENT_NAME${RESET_COLOUR}"
echo "  ↳ page-$COMPONENT_NAME.vue"
echo "  ↳ ./fragments/playground-$COMPONENT_NAME.vue"
