SpriteWeave.Outline(
	"SW.num.rects*",
	[ "SW.num.rect*", "..." ]
)

SpriteWeave( "render/bounds.get", {
	imports: {
		"bound": "render/bound.get",
		"rebound": "render/bounds.get",
	},
	parameters: [
		"L:SW.state.sheets.boundable*",
		"bounds:SW.num.rects*|unset",
	],
	returns: "SW.num.rects*",
	factory: () => {
		return ( L, bounds ) => {
			const { bound, rebound } = imports;

			if( ! bounds )
				bounds = [];

			if( Array.isArray( L ) ) {
				for( let l of L ) {
					rebound( l, bounds );
				}
			}
			else {
				const b = bound( L );
				bounds.push( b );
				if( L.layers )
					rebound( L.layers, bounds );
			}

			return bounds;
		}
	}
}, 
"Get all the bounding boxes nested within a frame, meta-layer, image-layer, or array of [frames, meta-layers, and/or image-layers]. Coordinates can be negative. Will return an empty array if selection did not contain at least 1 image layer."
)