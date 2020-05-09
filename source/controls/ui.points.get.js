SpriteWeave.Outline(
	"ui.points.points*",
	{
		"started": "ui.points.point*",
		"at": "ui.points.point-vector*",
		"ended": "ui.points.point-vector*",
	}
)

SpriteWeave.Outline(
	"ui.points.point-vector*",
	"ui.points.point* & ui.points.vector*"
)

SpriteWeave.Outline(
	"ui.points.point*",
	{
		"x": "number",
		"y": "number",
		"element": "null|any",
	}
)

SpriteWeave.Outline(
	"ui.points.vector*",
	{
		"vector": {
			"dx": "number",
			"dy": "number",
		}
	}
)

SpriteWeave(
	"controls/ui.points.get",
	{
		returns: "ui.points.points*",
		factory: () => {
			const points = {
				started: {
					x: 0,
					y: 0,
					element: null
				},
				at: {
					x: 0,
					y: 0,
					element: null,
					vector: {
						dx: 0,
						dy: 0
					}
				},
				ended: {
					x: 0,
					y: 0,
					element: null,
					vector: {
						dx: 0,
						dy: 0
					}
				}
			}
			return () => points
		}
	}
)