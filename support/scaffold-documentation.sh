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
#	 The name of the component in kebab-case that this documentation page will
#	 represent
#   --folder [folder-name]  (optional)
#	 The name of the folder where the component will be created in the root
#	 components documentation folder.
#   --props [prop:type=default,...]  (optional)
#	 List of component props, optionally including type and default value.
#   --slots [slot1,slot2,...]  (optional)
#	 List of named slots available for the component.
#   --methods [method1,method2,...]  (optional)
#	 List of available public methods for the component.
#   --events [event1,event2,...]  (optional)
#	 List of events emitted by the component.
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
	echo -e "Usage: ${PURPLE}./support/scaffold-documentation.sh${RESET_COLOUR} ${BLUE}<component-name>${RESET_COLOUR} [--folder <folder-name>] [--props <prop1,prop2,...>] [--slots <slot1,slot2,...>] [--methods <method1,method2,...>] [--events <event1,event2,...>]"
	exit 1
fi

# Determine the passed parameters
COMPONENT_NAME="$1"
shift

FOLDER_PATH=""
PROPS=""
SLOTS=""
METHODS=""
EVENTS=""

while [[ "$#" -gt 0 ]]; do
	case $1 in
		--folder) FOLDER_PATH="$2"; shift ;;
		--props) PROPS="$2"; shift ;;
		--slots) SLOTS="$2"; shift ;;
		--methods) METHODS="$2"; shift ;;
		--events) EVENTS="$2"; shift ;;
		*)
			echo -e "\nUnknown parameter passed: $1"
			echo -e "Usage: ${PURPLE}./support/scaffold-documentation.sh${RESET_COLOUR} ${BLUE}<component-name>${RESET_COLOUR} [--folder <folder-name>] [--props <prop1,prop2,...>] [--slots <slot1,slot2,...>] [--methods <method1,method2,...>] [--events <event1,event2,...>]"
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
TEMPLATES=(
	"documentation-page/documentation-page.vue"
	"documentation-page/documentation-playground.vue"
)

OUTPUT_FILES=(
	"page-${COMPONENT_NAME}.vue"
	"fragments/playground-${COMPONENT_NAME}.vue"
)

# Check if any output files already exist
for OUTPUT_FILE in "${OUTPUT_FILES[@]}"; do
	if [ -e "$OUTPUT_FILE" ]; then
		echo -e "\n${RED}Error:${RESET_COLOUR} File ${PURPLE}$OUTPUT_FILE${RESET_COLOUR} already exists."
		exit 1
	fi
done

# Generate props section if props are provided
COMPONENT_PROPS=""

if [[ -n "$PROPS" ]]; then
	PROP_TEMPLATE_FILE="$SCRIPT_DIR/templates/documentation-page/fragment-component-prop.txt"
	PROP_TEMPLATE_CONTENT=$(cat "$PROP_TEMPLATE_FILE")

	COMPONENT_PROPS+="\n\t\t<component-props>\n"
	IFS=',' read -ra PROP_ARRAY <<< "$PROPS"

	for PROP in "${PROP_ARRAY[@]}"; do
		# Extract the pieces of our prop.
		# This retrieves everything before the semicolon, i.e. the prop name.
		PROP_NAME="${PROP%%:*}"
		# This retrieves everything after it, i.e. the Type and default value.
		PROP_TYPE_DEFAULT="${PROP#*:}"
		# This splits the second half at an equals sign, retrieving everything
		# before the equals, i.e. the Type.
		PROP_TYPE="${PROP_TYPE_DEFAULT%%=*}"
		# And this retrieves everything after the equals, i.e. the default value.
		PROP_DEFAULT_VALUE="${PROP_TYPE_DEFAULT#*=}"

		# If no type was provided, we reset the type and default value for
		# safety.
		[[ "$PROP_TYPE" == "$PROP_DEFAULT_VALUE" ]] && PROP_TYPE="" && PROP_DEFAULT_VALUE=""

		KEBAB_CASE_PROP_NAME=$(echo "$PROP_NAME" | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]')
		PROP_CONTENT=$(echo "$PROP_TEMPLATE_CONTENT" | sed -E "s/{{PROP_NAME}}/$PROP_NAME/g; s/{{KEBAB_CASE_PROP_NAME}}/$KEBAB_CASE_PROP_NAME/g; s/{{PROP_TYPE}}/${PROP_TYPE:-String}/g; s/{{PROP_DEFAULT_VALUE}}/${PROP_DEFAULT_VALUE:-null}/g")

		COMPONENT_PROPS+="$PROP_CONTENT"$'\n\n'
	done
	COMPONENT_PROPS+="\t\t</component-props>\n\n"
fi

# Generate slots section if slots are provided
COMPONENT_SLOTS=""

if [ -n "$SLOTS" ]; then
	SLOT_TEMPLATE_FILE="$SCRIPT_DIR/templates/documentation-page/fragment-component-slot.txt"
	SLOT_TEMPLATE_CONTENT=$(cat "$SLOT_TEMPLATE_FILE")

	COMPONENT_SLOTS+="\n\t\t<component-slots>\n";

	IFS=',' read -ra SLOT_ARRAY <<< "$SLOTS"

	for SLOT_NAME in "${SLOT_ARRAY[@]}"; do
		SLOT_CONTENT=$(echo "$SLOT_TEMPLATE_CONTENT" | sed "s/{{SLOT_NAME}}/$SLOT_NAME/g")
		COMPONENT_SLOTS+="$SLOT_CONTENT"$'\n\n'
	done

	COMPONENT_SLOTS+="\t\t</component-slots>\n\n";
fi

# Generate methods section if methods are provided
COMPONENT_METHODS=""

if [ -n "$METHODS" ]; then
	METHOD_TEMPLATE_FILE="$SCRIPT_DIR/templates/documentation-page/fragment-component-method.txt"
	METHOD_TEMPLATE_CONTENT=$(cat "$METHOD_TEMPLATE_FILE")

	COMPONENT_METHODS+="\n\t\t<component-methods>\n";

	IFS=',' read -ra METHOD_ARRAY <<< "$METHODS"

	for METHOD_NAME in "${METHOD_ARRAY[@]}"; do
		KEBAB_CASE_METHOD_NAME=$(echo "$METHOD_NAME" | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]')
		METHOD_CONTENT=$(echo "$METHOD_TEMPLATE_CONTENT" | sed "s/{{METHOD_NAME}}/$METHOD_NAME/g; s/{{KEBAB_CASE_METHOD_NAME}}/$KEBAB_CASE_METHOD_NAME/g")
		COMPONENT_METHODS+="$METHOD_CONTENT"$'\n\n'
	done

	COMPONENT_METHODS+="\t\t</component-methods>\n\n";
fi

# Generate events section if events are provided
COMPONENT_EVENTS=""

if [ -n "$EVENTS" ]; then
	EVENT_TEMPLATE_FILE="$SCRIPT_DIR/templates/documentation-page/fragment-component-event.txt"
	EVENT_TEMPLATE_CONTENT=$(cat "$EVENT_TEMPLATE_FILE")

	COMPONENT_EVENTS+="\n\t\t<component-events>\n";

	IFS=',' read -ra EVENT_ARRAY <<< "$EVENTS"

	for EVENT_NAME in "${EVENT_ARRAY[@]}"; do
		EVENT_CONTENT=$(echo "$EVENT_TEMPLATE_CONTENT" | sed "s/{{EVENT_NAME}}/$EVENT_NAME/g")
		COMPONENT_EVENTS+="$EVENT_CONTENT"$'\n\n'
	done

	COMPONENT_EVENTS+="\t\t</component-events>\n\n";
fi

# Process templates
for i in "${!TEMPLATES[@]}"; do
	TEMPLATE_FILE="$SCRIPT_DIR/templates/${TEMPLATES[$i]}"
	OUTPUT_FILE="${OUTPUT_FILES[$i]}"

	# Replace placeholders in the template
	perl -pe "
		s|{{COMPONENT_NAME}}|$COMPONENT_NAME|g;
		s|{{PASCAL_CASE_NAME}}|$PASCAL_CASE_NAME|g;
		s|{{SENTENCE_CASE_NAME}}|$SENTENCE_CASE_NAME|g;
		s|{{COMPONENT_PROPS}}|$COMPONENT_PROPS|g;
		s|{{COMPONENT_SLOTS}}|$COMPONENT_SLOTS|g;
		s|{{COMPONENT_METHODS}}|$COMPONENT_METHODS|g;
		s|{{COMPONENT_EVENTS}}|$COMPONENT_EVENTS|g;
	" "$TEMPLATE_FILE" > "$OUTPUT_FILE"
done

for OUTPUT_FILE in "${OUTPUT_FILES[@]}"; do
	code -r "$OUTPUT_FILE"
done

# Print the success message
echo -e "\nDocumentation ${PURPLE}page-$COMPONENT_NAME${RESET_COLOUR} scaffolded successfully in ${BLUE}$BASE_PATH/$COMPONENT_NAME${RESET_COLOUR}.\n"
echo -e "${PURPLE}page-$COMPONENT_NAME${RESET_COLOUR}"
echo "  ↳ page-$COMPONENT_NAME.vue"
echo "  ↳ ./fragments/playground-$COMPONENT_NAME.vue"
