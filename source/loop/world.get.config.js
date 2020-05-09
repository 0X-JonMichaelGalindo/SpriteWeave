SpriteWeave(
	"loop/world.get.config",
	{
		imports: { "get": "loop/world.get" },
		returns: "loop.world.config*",
		factory: () => {
			let config = null;
			return () => {
				if( ! config ) config = imports.get().config;
				return config;
			}
		}
	}
)