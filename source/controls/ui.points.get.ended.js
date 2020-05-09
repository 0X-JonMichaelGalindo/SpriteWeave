SpriteWeave(
	"controls/ui.points.get.ended",
	{
		returns: "ui.points.point-vector*",
		imports: { "get": "controls/ui.points.get" },
		factory: () => {
			let ended = null;
			return () => {
				if( ! ended )
					ended = 
						imports.get().ended;
				return ended;
			}
		}
	}
)