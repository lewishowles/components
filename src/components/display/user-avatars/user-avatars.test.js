import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vitest";
import UserAvatars from "./user-avatars.vue";

const users = [
	{ name: "Mickey Mouse", initials: "MM", avatar: "https://placecats.com/100/100" },
	{ name: "Donald Duck", initials: "DD", avatar: "https://placecats.com/101/101" },
	{ name: "Goofy", initials: "G", avatar: "https://placecats.com/102/102" },
	{ name: "Buzz Lightyear", initials: "BL", avatar: "https://placecats.com/103/103" },
	{ name: "Woody", initials: "W", avatar: "https://placecats.com/104/104" },
];

const defaultProps = { users };
const mount = createMount(UserAvatars, { props: defaultProps });

describe("user-avatars", () => {
	console.warn = vi.fn();

	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("internalUsers", () => {
			describe("should discard anything but a non-empty array of users", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (non-empty)", "string"],
					["string (empty)", ""],
					["array (empty)", []],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["null", null],
					["undefined", undefined],
				])("%s", ([, users]) => {
					const wrapper = mount({ users });
					const vm = wrapper.vm;

					expect(vm.internalUsers).toEqual([]);
				});
			});

			describe("should discard anything but a non-empty object user", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (non-empty)", "string"],
					["string (empty)", ""],
					["array (non-empty)", [1, 2, 3]],
					["array (empty)", []],
					["object (empty)", {}],
					["null", null],
					["undefined", undefined],
				])("%s", ([, user]) => {
					const wrapper = mount({ users: [...users, user] });
					const vm = wrapper.vm;

					expect(vm.internalUsers).toHaveLength(5);
				});
			});

			test("should discard a user without enough information", () => {
				const wrapper = mount({ users: [...users, { movie: "Toy Story" }] });
				const vm = wrapper.vm;

				expect(vm.internalUsers).toHaveLength(5);
			});

			test("should determine whether a user has an avatar", () => {
				const wrapper = mount({ users: [...users, { name: "Mike Wazowski", initials: "MW" }] });
				const vm = wrapper.vm;

				expect(vm.internalUsers[0]).toEqual(expect.objectContaining({ hasAvatar: true }));
				expect(vm.internalUsers[5]).toEqual(expect.objectContaining({ hasAvatar: false }));
			});
		});
	});
});
