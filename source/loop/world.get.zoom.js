SpriteWeave(
	"loop/world.get.zoom",
	{
		imports: { "get": "loop/world.get" },
		returns: "loop.world.zoom*",
		factory: () => {
			let zoom = null;
			return () => {
				if( ! zoom ) zoom = imports.get().zoom;
				return zoom;
			}
		}
	}
)