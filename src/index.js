import * as components from "./components";

const componentsList = components?.default;

const componentLibrary = {
	install(app) {
		Object.keys(componentsList).forEach(name => {
			app.component(name, componentsList[name]);
		});
	},
};

export default componentLibrary;
