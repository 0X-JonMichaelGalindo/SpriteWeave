SpriteWeave(
	"loop/world.get.time",
	{
		imports: { "get": "loop/world.get" },
		returns: "loop.world.time*",
		factory: () => {
			let time = null;
			return () => {
				if( ! time ) time = imports.get().time;
				return time;
			}
		}
	}
)