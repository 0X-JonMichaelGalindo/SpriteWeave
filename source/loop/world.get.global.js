SpriteWeave(
	"loop/world.get.global",
	{
		imports: { "get": "loop/world.get" },
		returns: "loop.world.global*",
		factory: () => {
			let global = null;
			return () => {
				if( ! global ) global = imports.get().global;
				return global;
			}
		}
	}
)