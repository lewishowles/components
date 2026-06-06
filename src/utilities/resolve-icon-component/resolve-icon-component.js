import { isNonEmptyString } from "@lewishowles/helpers/string";
import { componentIcons } from "virtual:component-icons";

/**
 * Resolve a built-in icon tag to its component, while preserving custom global
 * component names.
 *
 * @param  {string}  icon
 *     The icon component tag to resolve.
 */
export function resolveIconComponent(icon) {
	if (!isNonEmptyString(icon)) {
		return icon;
	}

	return componentIcons[icon] ?? icon;
}
