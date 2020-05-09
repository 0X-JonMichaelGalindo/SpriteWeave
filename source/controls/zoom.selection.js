SpriteWeave( "controls/zoom.selection", {
	imports: {
		"bound": "render/bound",
		"getScreen": "?",
		"growScreen": "?",
		"getZoom": "?",
	},
	parameters: [
		"selection:SW.state.sheets.selectable*"
	],
	returns: "SW.hub.bids.zoom*|string",
	factory: () => {
		return selection => {
			const box = bound( selection );
			if( box === null )
				return null;
			else {
				const screen = getScreen(),
					w = box.x2 - box.x,
					h = box.y2 - box.y;
				if( w === 0 &&
					h === 0 ) {
					return "Cannot zoom empty selection.";
				}
				else if( screen.w < w ||
					screen.h < h )
					growScreen( w, h );
				else {
					let z = 1;
					while(
						( z * w ) < screen.w &&
						( z * h ) < screen.h
					) ++z;
					
					if( z > 1 ) --z;

					const bx = ( screen.w - ( z * w ) ) / 2,
						by = ( screen.h - ( z * h ) ) / 2;

					const bid = {
						"bid": "zoom",
						"from": imports.getZoom(),
						"to": {
							x: bx,
							y: by,
							s: z
						}
					}

					return bid;
				}
			}
		}
	}
}
)