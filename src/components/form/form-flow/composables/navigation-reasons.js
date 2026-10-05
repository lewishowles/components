// The reasons form-flow reports in its `screen-change` event, saying why the
// active screen changed.
export const navigationReasons = {
	AUTOMATIC: "automatic",
	BACK: "back",
	// The active conditional screen disappeared, so the flow moved to the next
	// or previous visible screen.
	CONDITIONAL_RECOVERY: "conditional-screen-recovery",
	CONTINUE: "continue",
	// Final validation found an error on another visible screen, so the flow
	// moved to that screen.
	FINAL_ERROR_RECOVERY: "final-error-recovery",
	// The first registered screen renders without a screen-change event or focus move.
	INITIAL_RENDER: "initial-render",
	REVIEW: "review",
};
