SpriteWeave(
	"loop/world.get.stats",
	{
		imports: { "get": "loop/world.get" },
		returns: "loop.world.stats*",
		factory: () => {
			let stats = null;
			return () => {
				if( ! stats ) stats = imports.get().stats;
				return stats;
			}
		}
	}
)