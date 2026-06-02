import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS class strings, resolving conflicts so that later classes
 * win. Accepts any combination of strings, arrays, and conditional objects —
 * the same formats as Vue's `:class` binding.
 *
 * @param  {...any}  inputs
 *     Class values to merge.
 */
export function cn(...inputs) {
	return twMerge(clsx(inputs));
}
