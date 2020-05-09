SpriteWeave(
	"loop/world.get.render",
	{
		imports: { "get": "loop/world.get" },
		returns: "loop.world.render*",
		factory: () => {
			let render = null;
			return () => {
				if( ! render ) render = imports.get().render;
				return render;
			}
		}
	}
)