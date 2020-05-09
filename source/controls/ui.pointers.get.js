
SpriteWeave.Outline(
	"ui.pointers*",
	{
		"start": "ui.pointers.event-handler()*",
		"move": "ui.pointers.event-handler()*",
		"stop": "ui.pointers.event-handler()*",
	}
)

SpriteWeave.Outline(
	"ui.pointers.event-handler()*",
	{ parameters: [ "e:HTML.Pointer-Event*" ] }
)

SpriteWeave.Outline(
	"HTML.Pointer-Event*",
	"any",
	"A native JS pointer event."
)


SpriteWeave(
	"controls/ui.pointers.get",
	{
		imports: {
			"start": "controls/ui.pointers.start",
			"move": "controls/ui.pointers.move",
			"stop": "controls/ui.pointers.stop",
		},
		returns: "ui.pointers*",
		factory: () => {
			let pointers = null;
			return () => {
				if( ! pointers ) {
					pointers = {
						start: imports.start,
						move: imports.move,
						stop: imports.stop
					}
				}
				return pointers;
			}
		}
	}
)