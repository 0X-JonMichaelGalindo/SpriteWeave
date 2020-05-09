SpriteWeave.Outline(
	"SW.state.reference*",
	{
		"state": "SW.state.state*|null",
		"render": "SW.state.render*"
	}
)

SpriteWeave.Outline(
	"SW.state.render*",
	{
		"flat": "SW.state.render.flat*",
		"bounds": "SW.state.render.bounds*",
	},
	`A state built from the save state to optimize rendering.<br>
	Note the render state is non-serializable. It cannot be saved and must be re-built at load time.`
)

SpriteWeave.Outline(
	"SW.state.render.flat*",
	[ "SW.state.renderable*", "..." ],
	"A flat stack of image-renderable layers."
)

SpriteWeave.Outline(
	"SW.state.render.bounds*",
	"JS.WeakMap*",
	"Optimization: A collected reference of frame and pose bounds."
)

SpriteWeave.Outline(
	"JS.WeakMap*",
	w => w instanceof WeakMap,
	"The native JS WeakMap object."
)

SpriteWeave.Outline(
	"SW.state.renderable*",
	{
		"sheet": "SW.num.int*",
		"pose": "SW.num.int*",
		"frame": "SW.num.int*",
		"layer": "SW.state.sheets.layers.image*",
		"position": "SW.state.sheets.layers.position*",
		"img": "SW.state.images.sprite*",
		"sprite": "unset|SW.num.rect*",
	},
	`sheet - # of sheets which exist prior to this sheet<br>
	pose - # of poses which exist prior to this pose (across all sheets)<br>
	frame - # of frames which exist prior to this frame (across all sheets and poses)<br>
	layer - reference to the image-layer object<br>
	img - quick reference to source image and source rect<br>
	sprite - if set, a rect where this image's cell has been copied to the global sprite canvas. (Not implemented, I may not use this scheme.)`
)

SpriteWeave.Outline(
	"SW.state.state*",
	{
		"sprite-weave-version": "string",
		"name": "string",
		"sheets": [ "SW.state.sheets.sheet*", "..." ],
		"images": [ "SW.state.images.image*", "..." ],
	}
)

SpriteWeave.Outline(
	"SW.state.component*",
	`
	| SW.state.state*
	| SW.state.sheets.sheet*
	| SW.state.sheets.pose*
	| SW.state.sheets.frame*
	| SW.state.sheets.layers.layer*
	| SW.state.images.image*
	| SW.state.images.cell*
	| SW.state.images.material*
	`
)

SpriteWeave.Outline( 
	"SW.state.name*",
	`
	| SW.state.names.state*
	| SW.state.names.sheet*
	| SW.state.names.pose*
	| SW.state.names.frame*
	| SW.state.names.layer*
	| SW.state.names.image*
	| SW.state.names.cell*
	| SW.state.names.material*
	`
)

SpriteWeave.Outline( "SW.state.names.state*", t => t === "state" );
SpriteWeave.Outline( "SW.state.names.sheet*", t => t === "sheet" );
SpriteWeave.Outline( "SW.state.names.pose*", t => t === "pose" );
SpriteWeave.Outline( "SW.state.names.frame*", t => t === "frame" );
SpriteWeave.Outline( "SW.state.names.layer*", t => t === "layer" );
SpriteWeave.Outline( "SW.state.names.image*", t => t === "image" );
SpriteWeave.Outline( "SW.state.names.cell*", t => t === "cell" );
SpriteWeave.Outline( "SW.state.names.material*", t => t === "material" );

SpriteWeave.Outline(
	"SW.state.sheets.selection*",
	[
		`
		| SW.state.sheets.sheet*
		| SW.state.sheets.pose*
		| SW.state.sheets.frame*
		| SW.state.sheets.layers.layer*
		`,
		"..."
	],
	"Selection: An array of sheet sub-elements. Can be empty."
)

SpriteWeave.Outline(
	"SW.state.images.selection*",
	[
		`
		| SW.state.images.image*
		| SW.state.images.cell*
		| SW.state.images.material*
		`,
		"..."
	],
	"Selection: An array of image sub-elements. Can be empty."
)

SpriteWeave.Outline(
	"SW.state.sheets.sheet*",
	{
		"name": "string",
		"poses": [ "SW.state.sheets.pose*", "..." ],
	}
)

SpriteWeave.Outline(
	"SW.state.sheets.pose*",
	{
		"name": "string",
		"frames": [ "SW.state.sheets.frame*", "..." ],
	}
)

SpriteWeave.Outline(
	"SW.state.sheets.frame*",
	{
		"name": "string",
		"frame-duration": "SW.num.int*|unset",
		"layers": [ "SW.state.sheets.layers.layer*", "..." ],
	}
)

SpriteWeave.Outline(
	"SW.num.int*", 
	n => n === parseInt( n ),
	"An integer."
);

SpriteWeave.Outline(
	"SW.num.natural*", 
	n => n === parseInt( n ) &&
		n >= 1,
	"A natural number (1, 2, 3, etc.)."
);

SpriteWeave.Outline(
	"SW.state.sheets.layers.layer*",
	`
	| SW.state.sheets.layers.meta*
	| SW.state.sheets.layers.image*
	`
)
SpriteWeave.Outline(
	"SW.state.sheets.layers.meta*",
	{
		"image": {
			"name": "string",
			"cell": "string"
		},
		"layers": [ "SW.state.sheets.layers.layer*", "..." ]
	}
)
SpriteWeave.Outline(
	"SW.state.sheets.layers.image*",
	{
		"image": {
			"name": "string",
			"cell": "string"
		},
		"position": "SW.state.sheets.layers.position*"
	}
)
SpriteWeave.Outline(
	"SW.state.sheets.layers.position*",
	{
		"x": "number",
		"y": "number",
		"mirror": "unset|SW.state.sheets.layers.mirror*",
		//"rotate": "SW.num.angle*"
	}
)
SpriteWeave.Outline(
	"SW.state.sheets.layers.mirror*",
	{
		"horizontal": "boolean",
		"vertical": "boolean",
	}
)

SpriteWeave.Outline(
	"SW.num.angle*",
	`
	| SW.num.angle.0*
	| SW.num.angle.90*
	| SW.num.angle.180*
	| SW.num.angle.270*
	`,
	"Literal int 0, 1, 2, or 3. (Number of 90-degree turns)."
);
SpriteWeave.Outline( 
	"SW.num.angle.0*", 
	n => n === 0,
	"Literal int 0. (0 90-degree turns)."
)
SpriteWeave.Outline( 
	"SW.num.angle.90*", 
	n => n === 1,
	"Literal int 1. (1 90-degree turn)."
)
SpriteWeave.Outline( 
	"SW.num.angle.180*", 
	n => n === 2,
	"Literal int 2. (2 90-degree turns)."
)
SpriteWeave.Outline( 
	"SW.num.angle.270*", 
	n => n === 3,
	"Literal int 3. (3 90-degree turns)."
)

SpriteWeave.Outline(
	"SW.state.images.image*",
	{
		"name": "string",
		"cells": [ "SW.state.images.cell*", "..." ],
		"materials": "unset|SW.state.images.materials*",
		"data": "string",
		"image": "unset|HTML.Image*",
		"outline": "unset|HTML.Image*"
	}
)

SpriteWeave.Outline(
	"SW.state.images.materials*",
	[ 
		"SW.state.images.material*", 
		"..."
	]
)
SpriteWeave.Outline(
	"SW.state.images.cell*",
	{
		"name": "string",
		"rect": "SW.num.rect*",
	}
)

SpriteWeave.Outline(
	"SW.state.images.material*",
	{
		"name": "string",
		"color": "SW.num.color*",
		"shades": [
			"SW.num.color*",
			"..."
		]
	}
)

SpriteWeave.Outline(
	"SW.state.images.sprite*",
	{
		"img": "HTML.Image*",
		"rect": "SW.num.rect*",
	}
)

SpriteWeave.Outline(
	"SW.num.point*",
	{
		"x": "SW.num.int*",
		"y": "SW.num.int*",
	}
)

SpriteWeave.Outline(
	"SW.num.rect*",
	{
		"x": "number",
		"y": "number",
		"x2": "number",
		"y2": "number",
	}
)

SpriteWeave.Outline(
	"SW.num.color*",
	{
		"r": "SW.num.byte*",
		"g": "SW.num.byte*",
		"b": "SW.num.byte*",
		"a": "SW.num.unit-interval*|unset"
	}
)

SpriteWeave.Outline( 
	"SW.num.byte*", 
	n => typeof n === "number" 
		&& parseInt(n) === n 
		&& n >= 0 
		&& n <= 255,
	"Integer from 0 to 255." 
)

SpriteWeave.Outline( 
	"SW.num.unit-interval*", 
	n => typeof n === "number" 
		&& n >= 0 
		&& n <= 1,
	"Number between 0 and 1, inclusive." 
);

SpriteWeave.Outline( 
	"SW.num.true*", 
	n => n === true,
	"Boolean true." 
);


SpriteWeave( "data/state.get", {
	returns: "SW.state.reference*",
	factory: () => {
		const state = {
			state: null,
			render: {
				flat: [],
				bounds: new WeakMap()
			},
		};
		return () => state;
	}
})