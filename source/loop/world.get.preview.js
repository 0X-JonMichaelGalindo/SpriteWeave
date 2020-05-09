SpriteWeave(
	"loop/world.get.preview",
	{
		imports: { "get": "loop/world.get" },
		returns: "loop.world.preview*",
		factory: () => {
			let preview = null;
			return () => {
				if( ! preview ) preview = imports.get().preview;
				return preview;
			}
		}
	}
)