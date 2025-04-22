import { createRouter, createWebHistory } from "vue-router";
import PageHome from "@/views/page-home/page-home.vue";

// We want to auto-generate routes from our available component files, to save
// lots of manual labour.
const components = import.meta.glob("@/components/**/*.vue");

const componentRoutes = Object.keys(components).reduce((routes, path) => {
	// However, we don't want a single page for every "icon", we can have an
	// "icons" page that shows them all.
	if (path.includes("/src/components/icon/")) {
		return routes;
	}

	// We also don't want to include "fragment" components, which don't serve a
	// purpose on their own.
	if (path.includes("fragments")) {
		return routes;
	}

	const parts = path.split("/");
	const name = parts.pop().replace(".vue", "");
	const category = parts[parts.length - 2];

	routes.push({
		path: `/${category}/${name.toLowerCase()}`,
		name: `${category}-${name.toLowerCase()}`,
		component: components[path],
	});

	return routes;
}, []);

console.log({ components, componentRoutes });

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: PageHome,
		},
		...componentRoutes,
	],
	scrollBehavior(to, from, savedPosition) {
		if (to.hash) {
			return { el: to.hash };
		}

		if (savedPosition) {
			return savedPosition;
		}

		return { top: 0 };
	},
});

export default router;
