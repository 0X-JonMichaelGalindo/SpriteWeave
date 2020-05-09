SpriteWeave(
	"controls/ui.points.get.at",
	{
		returns: "ui.points.point-vector*",
		imports: { "get": "controls/ui.points.get" },
		factory: () => {
			let at = null;
			return () => {
				if( ! at )
					at = imports.get().at;
				return at;
			}
		}
	}
)