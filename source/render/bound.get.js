SpriteWeave.Outline(
	"SW.state.sheets.boundable*",
	`
	| SW.state.sheets.frame*
	| SW.state.sheets.layers.layer*
	| SW.state.sheets.boundeds*
	`,
	"Boundable: A frame, layer, or existing boundeds."
)

SpriteWeave.Outline(
	"SW.state.sheets.boundeds*",
	[
		`
		| SW.state.sheets.frame*
		| SW.state.sheets.layers.layer*
		| SW.state.sheets.boundable*
		`,
		"..."
	],
	"Boundeds: An array of boundables. Can be empty."
)

SpriteWeave.Outline(
	"SW.num.rect-quasi*",
	{
		"x": "number|infinity",
		"x2": "number|infinity",
		"y": "number|infinity",
		"y2": "number|infinity",
	}
)

SpriteWeave( "render/bound.get", {
	imports: {
		"state": "data/state.get",
		"get": "data/image.lookup",
		"bound": "render/bound.get",
	},
	parameters: [
		"L:SW.state.sheets.boundable*",
		"box:SW.num.rect*|SW.num.rect-quasi*|unset",
		"rebuild:boolean|unset",
	],
	returns: "SW.num.rect*|null",
	factory: () => {
		return ( L, box, rebuild ) => {
			if( ! rebuild ) {
				const state = imports.state(),
					prebound = state.render.bounds.get( L );
				if( prebound ) return prebound;
				else rebuild = false;
			}

			const { get, bound } = imports;

			if( ! box )
				box = {
					"x": Infinity,
					"y": Infinity,
					"x2": -Infinity,
					"y2": -Infinity,
				}

			if( Array.isArray( L ) ) {
				for( let l of L )
					bound( l, box, rebuild );
			}
			else if( L.layers ) {
				bound( L.layers, box, rebuild );
			}
			else if( L.image ) {
				const x = L.position.x,
					y = L.position.y,
					i = get( L.image.name, L.image.cell ),
					w = i.rect.x2 - i.rect.x,
					h = i.rect.y2 - i.rect.y;
				box.x = Math.min( box.x, x );
				box.y = Math.min( box.y, y );
				box.x2 = Math.max( box.x2, x + w );
				box.y2 = Math.max( box.y2, y + h );
			}

			if( box.x === Infinity ||
				box.y === Infinity ||
				box.x2 === Infinity ||
				box.y2 === Infinity )
				return null;
			else return box;
		}
	}
}, 
"Get the bounding box for a frame, meta-layer, image-layer, or array of [frames, meta-layers, and/or image-layers]. Coordinates can be negative. Will return null if selection did not contain at least 1 image layer."
)