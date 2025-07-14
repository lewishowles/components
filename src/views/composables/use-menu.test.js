import { afterEach, describe, expect, test } from "vitest";
import useMenu from "./use-menu";

describe("useMenu", () => {
	afterEach(() => {
		const response = useMenu();

		response.resetMenu();
	});

	test("should initialise", () => {
		const response = useMenu();

		expect(response).toBeTypeOf("object");
	});

	test("should add menu items to menuItems", () => {
		const menu = useMenu();

		menu.registerMenuItem({ section: "main", label: "Home", to: "/" });
		menu.registerMenuItem({ section: "main", label: "About", to: "/about" });

		expect(menu.menuItems.value.length).toBe(2);
		expect(menu.menuItems.value[0]).toEqual({ section: "main", label: "Home", to: "/" });
		expect(menu.menuItems.value[1]).toEqual({ section: "main", label: "About", to: "/about" });
	});

	test("should allow an object `to`", () => {
		const menu = useMenu();

		menu.registerMenuItem({ section: "main", label: "Home", to: "/" });
		menu.registerMenuItem({ section: "main", label: "About", to: { name: "about" } });

		expect(menu.menuItems.value.length).toBe(2);
		expect(menu.menuItems.value[0]).toEqual({ section: "main", label: "Home", to: "/" });
		expect(menu.menuItems.value[1]).toEqual({ section: "main", label: "About", to: { name: "about" } });
	});

	test("should not add invalid menu items", () => {
		const menu = useMenu();

		menu.registerMenuItem({ section: "", label: "Home", to: "/" });
		menu.registerMenuItem({ section: "main", label: "", to: "/" });
		menu.registerMenuItem({ section: "main", label: "Home", to: "" });
		menu.registerMenuItem({ section: "main", label: "Home", to: {} });
		menu.registerMenuItem({ section: "", label: "", to: "" });
		menu.registerMenuItem({ section: "", label: "", to: {} });

		expect(menu.menuItems.value.length).toBe(0);
	});
});
