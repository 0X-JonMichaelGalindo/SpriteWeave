SpriteWeave(
	"loop/world.get.update",
	{
		imports: { "get": "loop/world.get" },
		returns: "loop.world.update*",
		factory: () => {
			let update = null;
			return () => {
				if( ! update ) update = imports.get().update;
				return update;
			}
		}
	}
)