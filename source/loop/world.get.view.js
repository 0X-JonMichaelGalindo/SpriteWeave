SpriteWeave(
	"loop/world.get.view",
	{
		imports: { "get": "loop/world.get" },
		returns: "loop.world.view*",
		factory: () => {
			let view = null;
			return () => {
				if( ! view ) view = imports.get().view;
				return view;
			}
		}
	}
)