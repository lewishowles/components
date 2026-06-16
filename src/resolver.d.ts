interface ComponentsResolverOptions {
	exclude?: string[];
}

interface ResolvedComponent {
	from: string;
	name: string;
}

interface ComponentsResolver {
	resolve(name: string): ResolvedComponent | undefined;
	type: "component";
}

export declare function componentsResolver(options?: ComponentsResolverOptions): ComponentsResolver;
