import { createRouter, createWebHistory } from "vue-router";

const baseRoutes = [
	{
		path: "/",
		name: "home",
		component: () => import("@/views/page-home/page-home.vue"),
	},
	{
		path: "/getting-started",
		name: "getting-started",
		component: () => import("@/views/page-getting-started/page-getting-started.vue"),
	},
];

// We want to auto-generate routes from our available views.
const views = import.meta.glob("@/views/**/*.vue");

// For each view, if it's in a category folder, such as "information", we
// include that in the route. Otherwise, we only include the name of the route.
// Since "page" is a convention for components and unnecessary in routes, we
// remove it from the paths and route names.
const routes = Object.keys(views).reduce((routes, path) => {
	if (baseRoutes.some(route => path.includes(`page-${route.name}`)) || path.includes("/fragments/")) {
		return routes;
	}

	const parts = path.split("/");
	const name = parts.pop().replace("page-", "").replace(".vue", "").toLowerCase();
	const isInSubFolder = parts.length > 4;
	const category = isInSubFolder ? parts[parts.length - 2] : null;

	routes.push({
		path: isInSubFolder ? `/${category}/${name}` : `/${name}`,
		name: name,
		component: views[path],
	});

	return routes;
}, []);

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		...baseRoutes,
		...routes,
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
