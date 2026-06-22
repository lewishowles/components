import { getPathValue } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { isNumber } from "@lewishowles/helpers/number";

/**
 * The accessors for an internalised data-table row. The table standardises each
 * row into `{ configuration, content, raw }` when it ingests data; these
 * helpers read that shape so neither the component nor its composables need to
 * know it directly.
 */

/**
 * The unique ID for a row, assigned when the data is internalised.
 *
 * @param  {object}  row
 *     The standardised row data.
 */
export function getRowId(row) {
	return getPathValue(row, "configuration.id", null);
}

/**
 * The raw row, as it was provided to the table. This lets custom cell templates
 * work with the original data rather than the internal structure.
 *
 * @param  {object}  row
 *     The standardised row data.
 */
export function getRawRow(row) {
	return getPathValue(row, "raw", null);
}

/**
 * The display content for a column within a row, as a string. Non-string,
 * non-numeric content becomes an empty string.
 *
 * @param  {object}  row
 *     The standardised row data.
 * @param  {string}  columnKey
 *     The key for the column.
 */
export function getRowContent(row, columnKey) {
	const cell = getPathValue(row, `content.${columnKey}.content`);

	if (!isNonEmptyString(cell) && !isNumber(cell)) {
		return "";
	}

	return cell;
}
