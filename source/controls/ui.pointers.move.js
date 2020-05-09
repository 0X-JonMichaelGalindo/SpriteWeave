SpriteWeave(
	"controls/ui.pointers.move",
	{
		imports: {
			"getStarted": "controls/ui.points.get.started",
			"getAt": "controls/ui.points.get.at",
			//"findElement": "???",
		},
		parameters: [
			"e:HTML.Pointer-Event*"
		],
		factory: () => {
			return e => {
				e.preventDefault();
				e.stopPropagation();
				const started = imports.getStarted(),
					at = imports.getAt();
				at.x = e.offsetX;
				at.y = e.offsetY;
				at.vector.dx = at.x - started.x;
				at.vector.dy = at.y - started.y;
				/*
				at.element = findElement( at.x, at.y );
				*/

				//console.log( "Mouse move: ", e );
			}
		}
	}
)