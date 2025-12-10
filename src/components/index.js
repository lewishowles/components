const modules = import.meta.glob("./**/*.vue", { eager: true });

// Find our components in our file structure.
const components = {};

for (const path in modules) {
	const name = path.split("/").pop()?.replace(".vue", "");

	if (name) {
		components[name] = modules[path].default;
	}
}

// Create a Vue plugin to globally register each component.
const componentLibrary = {
	install(app) {
		Object.keys(components).forEach(name => {
			app.component(name, components[name]);
		});
	},
};

export default componentLibrary;
export { components };
