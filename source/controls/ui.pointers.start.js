SpriteWeave(
	"controls/ui.pointers.start",
	{
		imports: {
			"getStarted": "controls/ui.points.get.started",
			//"findElement": "???",
		},
		parameters: [
			"e:HTML.Pointer-Event*"
		],
		factory: () => {
			return e => {
				e.preventDefault();
				e.stopPropagation();
				const started = imports.getStarted();
				started.x = e.offsetX;
				started.y = e.offsetY;
				/*started.element = findElement(
					started.x,
					started.y
				)*/
				console.log( "Mouse start: ", e );
			}
		}
	}
)