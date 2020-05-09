SpriteWeave.Outline(
	"ui.events.click*",
	"ui.points.point-vector*"
)

SpriteWeave(
	"controls/ui.pointers.stop",
	{
		imports: {
			"getStarted": "controls/ui.points.get.started",
			"getEnded": "controls/ui.points.get.ended",
			"getConfig": "loop/world.get.config",
		},
		parameters: [
			"e:HTML.Pointer-Event*"
		],
		emits: "ui.events.click*",
		factory: () => {
			return e => {
				e.preventDefault();
				e.stopPropagation();
				const started = imports.getStarted(),
					ended = imports.getEnded(),
					config = imports.getConfig();
				
				ended.x = e.offsetX;
				ended.y = e.offsetY;
				ended.vector.dx = ended.x - started.x;
				ended.vector.dy = ended.y - started.y;

				/*
				ended.element = findElement( ended.x, ended.y );
				*/

				if( ended.vector.dx <= config.slip &&
					ended.vector.dy <= config.slip ) {
					imports.emit( 
						"ui.events.click*", 
						ended 
					);
				}

				console.log( "Mouse stop: ", e );
			}
		}
	}
)