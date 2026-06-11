import { internalComponentsResolver } from "./internal-components-resolver.js";
import Components from "unplugin-vue-components/vite";

export function componentAutoImports() {
	return Components({
		dirs: [],
		dts: false,
		resolvers: [internalComponentsResolver()],
	});
}
