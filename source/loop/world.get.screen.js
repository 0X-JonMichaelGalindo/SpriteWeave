SpriteWeave(
	"loop/world.get.screen",
	{
		imports: { "get": "loop/world.get" },
		returns: "loop.world.screen*",
		factory: () => {
			let screen = null;
			return () => {
				if( ! screen ) screen = imports.get().screen;
				return screen;
			}
		}
	}
)