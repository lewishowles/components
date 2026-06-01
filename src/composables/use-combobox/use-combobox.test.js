import { describe, expect, test, vi } from "vite-plus/test";
import { useCombobox } from "./use-combobox.js";

/**
 * Create a synthetic keyboard event for handleKeydown tests.
 *
 * @param  {string}  key
 *     The key to simulate.
 * @param  {object}  [modifiers]
 *     Additional event properties, such as { altKey: true }.
 */
function createKeyEvent(key, modifiers = {}) {
	return { key, preventDefault: vi.fn(), ...modifiers };
}

describe("use-combobox", () => {
	describe("Initialisation", () => {
		test("isOpen initialises as false", () => {
			const { isOpen } = useCombobox();

			expect(isOpen.value).toBe(false);
		});

		test("activeId initialises as null", () => {
			const { activeId } = useCombobox();

			expect(activeId.value).toBeNull();
		});

		test("No options are registered initially", () => {
			const { optionIds } = useCombobox();

			expect(optionIds.value).toHaveLength(0);
		});
	});

	describe("Computed", () => {
		describe("inputAttributes", () => {
			test("Has the correct static values", () => {
				const { inputAttributes } = useCombobox();

				expect(inputAttributes.value.role).toBe("combobox");
				expect(inputAttributes.value["aria-autocomplete"]).toBe("list");
			});

			test("aria-controls matches the listbox id", () => {
				const { inputAttributes, listboxAttributes } = useCombobox();

				expect(inputAttributes.value["aria-controls"]).toBe(listboxAttributes.value.id);
			});

			test("aria-expanded reflects isOpen", () => {
				const { inputAttributes, open } = useCombobox();

				expect(inputAttributes.value["aria-expanded"]).toBe(false);

				open();

				expect(inputAttributes.value["aria-expanded"]).toBe(true);
			});

			test("aria-activedescendant is undefined when no option is active", () => {
				const { inputAttributes } = useCombobox();

				expect(inputAttributes.value["aria-activedescendant"]).toBeUndefined();
			});

			test("aria-activedescendant reflects the active option", () => {
				const { handleKeydown, inputAttributes, open, registerOption } = useCombobox();

				registerOption("opt-1");
				open();
				handleKeydown(createKeyEvent("ArrowDown"));

				expect(inputAttributes.value["aria-activedescendant"]).toBe("opt-1");
			});
		});

		describe("listboxAttributes", () => {
			test("Has role listbox", () => {
				const { listboxAttributes } = useCombobox();

				expect(listboxAttributes.value.role).toBe("listbox");
			});

			test("Has a stable id across reads", () => {
				const { listboxAttributes } = useCombobox();

				expect(listboxAttributes.value.id).toBe(listboxAttributes.value.id);
			});
		});

		describe("getOptionAttributes", () => {
			test("Returns the correct static attributes", () => {
				const { getOptionAttributes } = useCombobox();
				const attrs = getOptionAttributes("opt-1").value;

				expect(attrs.id).toBe("opt-1");
				expect(attrs.role).toBe("option");
			});

			test("aria-selected is false when the option is not active", () => {
				const { getOptionAttributes } = useCombobox();

				expect(getOptionAttributes("opt-1").value["aria-selected"]).toBe(false);
			});

			test("aria-selected is true for the active option", () => {
				const { getOptionAttributes, handleKeydown, open, registerOption } = useCombobox();

				registerOption("opt-1");
				open();
				handleKeydown(createKeyEvent("ArrowDown"));

				expect(getOptionAttributes("opt-1").value["aria-selected"]).toBe(true);
			});

			test("aria-selected is false for inactive options", () => {
				const { getOptionAttributes, handleKeydown, open, registerOption } = useCombobox();

				registerOption("opt-1");
				registerOption("opt-2");
				open();
				handleKeydown(createKeyEvent("ArrowDown"));

				expect(getOptionAttributes("opt-2").value["aria-selected"]).toBe(false);
			});
		});
	});

	describe("Methods", () => {
		describe("registerOption", () => {
			test("Adds an option to optionIds", () => {
				const { optionIds, registerOption } = useCombobox();

				registerOption("opt-1");

				expect(optionIds.value).toContain("opt-1");
			});

			test("Maintains registration order", () => {
				const { optionIds, registerOption } = useCombobox();

				registerOption("opt-1");
				registerOption("opt-2");
				registerOption("opt-3");

				expect(optionIds.value).toEqual(["opt-1", "opt-2", "opt-3"]);
			});

			test("Ignores duplicate option IDs", () => {
				const { optionIds, registerOption } = useCombobox();

				registerOption("opt-1");
				registerOption("opt-1");

				expect(optionIds.value.filter((id) => id === "opt-1")).toHaveLength(1);
			});

			test("Ignores an empty id", () => {
				const { optionIds, registerOption } = useCombobox();

				registerOption("");

				expect(optionIds.value).toHaveLength(0);
			});
		});

		describe("unregisterOption", () => {
			test("Removes the option from optionIds", () => {
				const { optionIds, registerOption, unregisterOption } = useCombobox();

				registerOption("opt-1");
				unregisterOption("opt-1");

				expect(optionIds.value).not.toContain("opt-1");
			});

			test("Clears activeId when the active option is removed", () => {
				const { activeId, handleKeydown, open, registerOption, unregisterOption } = useCombobox();

				registerOption("opt-1");
				open();
				handleKeydown(createKeyEvent("ArrowDown"));

				expect(activeId.value).toBe("opt-1");

				unregisterOption("opt-1");

				expect(activeId.value).toBeNull();
			});

			test("Preserves activeId when a different option is removed", () => {
				const { activeId, handleKeydown, open, registerOption, unregisterOption } = useCombobox();

				registerOption("opt-1");
				registerOption("opt-2");
				open();
				handleKeydown(createKeyEvent("ArrowDown"));
				unregisterOption("opt-2");

				expect(activeId.value).toBe("opt-1");
			});
		});

		describe("open", () => {
			test("Sets isOpen to true", () => {
				const { isOpen, open } = useCombobox();

				open();

				expect(isOpen.value).toBe(true);
			});
		});

		describe("close", () => {
			test("Sets isOpen to false", () => {
				const { close, isOpen, open } = useCombobox();

				open();
				close();

				expect(isOpen.value).toBe(false);
			});

			test("Clears the active option", () => {
				const { activeId, close, handleKeydown, open, registerOption } = useCombobox();

				registerOption("opt-1");
				open();
				handleKeydown(createKeyEvent("ArrowDown"));
				close();

				expect(activeId.value).toBeNull();
			});
		});

		describe("selectOption", () => {
			test("Calls onSelect with the active option ID", () => {
				const onSelect = vi.fn();

				const { handleKeydown, open, registerOption, selectOption } = useCombobox({
					onSelect,
				});

				registerOption("opt-1");
				open();
				handleKeydown(createKeyEvent("ArrowDown"));
				selectOption();

				expect(onSelect).toHaveBeenCalledWith("opt-1");
			});

			test("Calls onSelect with an explicitly provided ID", () => {
				const onSelect = vi.fn();
				const { selectOption } = useCombobox({ onSelect });

				selectOption("opt-explicit");

				expect(onSelect).toHaveBeenCalledWith("opt-explicit");
			});

			test("Closes the popup after selection", () => {
				const { handleKeydown, isOpen, open, registerOption, selectOption } = useCombobox();

				registerOption("opt-1");
				open();
				handleKeydown(createKeyEvent("ArrowDown"));
				selectOption();

				expect(isOpen.value).toBe(false);
			});

			test("Does nothing when no option is active and no ID is provided", () => {
				const onSelect = vi.fn();
				const { isOpen, open, selectOption } = useCombobox({ onSelect });

				open();
				selectOption();

				expect(onSelect).not.toHaveBeenCalled();
				expect(isOpen.value).toBe(true);
			});
		});

		describe("handleKeydown", () => {
			describe("ArrowDown", () => {
				test("Opens and highlights the first option when closed", () => {
					const { activeId, handleKeydown, isOpen, registerOption } = useCombobox();

					registerOption("opt-1");
					registerOption("opt-2");
					handleKeydown(createKeyEvent("ArrowDown"));

					expect(isOpen.value).toBe(true);
					expect(activeId.value).toBe("opt-1");
				});

				test("Alt+ArrowDown opens without moving focus", () => {
					const { activeId, handleKeydown, isOpen, registerOption } = useCombobox();

					registerOption("opt-1");
					handleKeydown(createKeyEvent("ArrowDown", { altKey: true }));

					expect(isOpen.value).toBe(true);
					expect(activeId.value).toBeNull();
				});

				test("Moves to the next option when open", () => {
					const { activeId, handleKeydown, open, registerOption } = useCombobox();

					registerOption("opt-1");
					registerOption("opt-2");
					open();
					handleKeydown(createKeyEvent("ArrowDown"));
					handleKeydown(createKeyEvent("ArrowDown"));

					expect(activeId.value).toBe("opt-2");
				});

				test("Wraps from the last option to the first", () => {
					const { activeId, handleKeydown, open, registerOption } = useCombobox();

					registerOption("opt-1");
					registerOption("opt-2");
					open();
					handleKeydown(createKeyEvent("ArrowDown"));
					handleKeydown(createKeyEvent("ArrowDown"));
					handleKeydown(createKeyEvent("ArrowDown"));

					expect(activeId.value).toBe("opt-1");
				});
			});

			describe("ArrowUp", () => {
				test("Opens and highlights the last option when closed", () => {
					const { activeId, handleKeydown, isOpen, registerOption } = useCombobox();

					registerOption("opt-1");
					registerOption("opt-2");
					handleKeydown(createKeyEvent("ArrowUp"));

					expect(isOpen.value).toBe(true);
					expect(activeId.value).toBe("opt-2");
				});

				test("Moves to the previous option when open", () => {
					const { activeId, handleKeydown, open, registerOption } = useCombobox();

					registerOption("opt-1");
					registerOption("opt-2");
					open();
					handleKeydown(createKeyEvent("ArrowDown"));
					handleKeydown(createKeyEvent("ArrowDown"));
					handleKeydown(createKeyEvent("ArrowUp"));

					expect(activeId.value).toBe("opt-1");
				});

				test("Wraps from the first option to the last", () => {
					const { activeId, handleKeydown, open, registerOption } = useCombobox();

					registerOption("opt-1");
					registerOption("opt-2");
					open();
					handleKeydown(createKeyEvent("ArrowDown"));
					handleKeydown(createKeyEvent("ArrowUp"));

					expect(activeId.value).toBe("opt-2");
				});
			});

			describe("Enter", () => {
				test("Selects the active option and closes the popup", () => {
					const onSelect = vi.fn();
					const { handleKeydown, isOpen, open, registerOption } = useCombobox({ onSelect });

					registerOption("opt-1");
					open();
					handleKeydown(createKeyEvent("ArrowDown"));
					handleKeydown(createKeyEvent("Enter"));

					expect(onSelect).toHaveBeenCalledWith("opt-1");
					expect(isOpen.value).toBe(false);
				});

				test("Closes without selecting when no option is active", () => {
					const onSelect = vi.fn();
					const { handleKeydown, isOpen, open } = useCombobox({ onSelect });

					open();
					handleKeydown(createKeyEvent("Enter"));

					expect(onSelect).not.toHaveBeenCalled();
					expect(isOpen.value).toBe(false);
				});

				test("Does nothing when the popup is closed", () => {
					const onSelect = vi.fn();
					const { handleKeydown, isOpen } = useCombobox({ onSelect });

					handleKeydown(createKeyEvent("Enter"));

					expect(isOpen.value).toBe(false);
					expect(onSelect).not.toHaveBeenCalled();
				});
			});

			describe("Escape", () => {
				test("Closes the popup when open", () => {
					const { handleKeydown, isOpen, open } = useCombobox();

					open();
					handleKeydown(createKeyEvent("Escape"));

					expect(isOpen.value).toBe(false);
				});

				test("Clears the active option when closing", () => {
					const { activeId, handleKeydown, open, registerOption } = useCombobox();

					registerOption("opt-1");
					open();
					handleKeydown(createKeyEvent("ArrowDown"));
					handleKeydown(createKeyEvent("Escape"));

					expect(activeId.value).toBeNull();
				});

				test("Does not throw when the popup is already closed", () => {
					const { handleKeydown } = useCombobox();

					expect(() => handleKeydown(createKeyEvent("Escape"))).not.toThrow();
				});
			});

			describe("ArrowLeft, ArrowRight, Home, End", () => {
				test.for([["ArrowLeft"], ["ArrowRight"], ["End"], ["Home"]])(
					"Clears the active option on %s",
					([key]) => {
						const { activeId, handleKeydown, open, registerOption } = useCombobox();

						registerOption("opt-1");
						open();
						handleKeydown(createKeyEvent("ArrowDown"));

						expect(activeId.value).toBe("opt-1");

						handleKeydown(createKeyEvent(key));

						expect(activeId.value).toBeNull();
					},
				);
			});
		});
	});
});
