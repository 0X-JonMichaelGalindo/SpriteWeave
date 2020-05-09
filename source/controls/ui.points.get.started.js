SpriteWeave(
	"controls/ui.points.get.started",
	{
		returns: "ui.points.point*",
		imports: { "get": "controls/ui.points.get" },
		factory: () => {
			let started = null;
			return () => {
				if( ! started )
					started =
					imports.get().started;
				return started;
			}
		}
	}
)