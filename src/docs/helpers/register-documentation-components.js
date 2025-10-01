/**
 * Register each of our documentation view components, which each live inside
 * @/docs/views/components/../*.vue
 *
 * @param  {App}  app
 *     The instance of the Vue app.
 */
export default function registerDocComponents(app) {
	const modules = import.meta.glob("@/docs/views/components/**/*.vue", { eager: true });

	for (const path in modules) {
		const component = modules[path].default;

		if (!component) {
			continue;
		}

		// Convert filename to kebab-case
		const kebabCase = string =>
			string
				.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
				.replace(/[\s_]+/g, "-")
				.toLowerCase();

		const fileName = path.split("/").pop().replace(".vue", "");
		const componentName = kebabCase(fileName);

		app.component(componentName, component);
	}
}
