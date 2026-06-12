// Whether to use terminal colours.
export const useColour = process.stdout.isTTY && !process.env.NO_COLOR;

// Terminal colour helpers, or plain text when colours are disabled.
export const c = {
	bold: (text) => (useColour ? `\x1b[1m${text}\x1b[0m` : text),
	cyan: (text) => (useColour ? `\x1b[36m${text}\x1b[0m` : text),
	dim: (text) => (useColour ? `\x1b[2m${text}\x1b[0m` : text),
	green: (text) => (useColour ? `\x1b[32m${text}\x1b[0m` : text),
	yellow: (text) => (useColour ? `\x1b[33m${text}\x1b[0m` : text),
};
