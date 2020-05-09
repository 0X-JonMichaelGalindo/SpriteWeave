SpriteWeave.Outline(
	"loop.world.screen*",
	{
		"cnv": "HTML.Canvas*",
		"ctx": "HTML.Canvas-Context2d*",
	}
)
SpriteWeave.Outline(
	"loop.world.preview*",
	{
		"cnv": "HTML.Canvas*",
		"ctx": "HTML.Canvas-Context2d*",
		"clip": "HTML.Element*",
	}
)
SpriteWeave.Outline(
	"loop.world.global*",
	{
		"cnv": "HTML.Canvas*",
		"ctx": "HTML.Canvas-Context2d*",
		"clip": {
			"w": "SW.num.int*",
			"h": "SW.num.int*"
		}
	}
)
SpriteWeave.Outline(
	"loop.world.zoom*",
	{
		"x": "SW.num.int*",
		"y": "SW.num.int*",
		"s": "SW.num.natural*",
	}
)
SpriteWeave.Outline(
	"loop.world.update*",
	{
		"screen": "boolean",
		"preview": "boolean",
		"global": "boolean",
	}
)
SpriteWeave.Outline(
	"loop.world.view*",
	{
		"selection": `
			| SW.state.sheets.selection*
			| SW.state.images.selection*
			| null
		`,
		"focus": "SW.state.component*|null",
		"tab": "SW.world.tabs.tab*"
	}
)
SpriteWeave.Outline(
	"loop.world.render*",
	{
		"targets": [
			"SW.world.render.target*",
			"..."
		]
	}
)
SpriteWeave.Outline(
	"loop.world.time*",
	{
		"looping": "boolean",
		"t": "number|null",
		"dt": "number|null",
		"frame": "SW.num.int*",
	}
)
SpriteWeave.Outline(
	"loop.world.stats*",
	{
		"frameFade": "number",
		"dt": "number",
		"fps": "number",
		"framerate": "SW.num.int*",
	}
)
SpriteWeave.Outline(
	"loop.world.config*",
	{
		"slip": "number",
	},
	`slip - a distance in canvas pixels the cursor is allowed to slip between click-start and click-stop while still being counted as a click. (It is a flawed approach, but works in most cases... may need to change later.)<br>`
)

SpriteWeave.Outline(
	"loop.world*",
	{
		"screen": "loop.world.screen*",
		"preview": "loop.world.preview*",
		"global": "loop.world.global*",
		"zoom": "loop.world.zoom*",
		"update": "loop.world.update*",
		"view": "loop.world.view*",
		"render": "loop.world.render*",
		"time": "loop.world.time*",
		"stats": "loop.world.stats*",
		"config": "loop.world.config*",
	}
)

SpriteWeave.Outline(
	"SW.world.render.target*",
	{
		"name": "string",
		"cnv": "HTML.Canvas*",
		"ctx": "HTML.Canvas-Context2d*",
		"clip": "unset|SW.num.rect*",
		"zones": "SW.world.render.zones*",
	}
)

SpriteWeave.Outline(
	"SW.world.render.zones*",
	[ "SW.world.render.zone*", "..." ]
)

SpriteWeave.Outline(
	"SW.world.render.zone*",
	{
		"animation": "unset|SW.world.render.animation*",
		"coord": "unset|SW.world.render.offset*|SW.world.render.position*",
		"indices": [ "SW.world.render.index*", "..." ],
	},
	`A guide used by "render/flat".<br><br>
	"animation":<br>
	A set of time coordinates to turn zones on and off for animation of frames in-place.<br>
	Non-drawn zones do not translate the canvas, so they can be fully replaced by the
	zone to follow.<br>
	<br>
	"coord":<br>
	If coord is unset, no transformations will be applied when the renderer
	begins rendering this zone.<br>
	If coord is an offset, the dx and dy will be applied to the current
	translation before rendering this zone.<br>
	If coord is a position, the current translation will be rolled back to 0,0,
	and the new position will be translated to before rendering this zone.<br>
	<br>
	"indices":
	Each index indicates a range of indices within state.render.flat which
	will be rendered with the current origin translation to the specified canvas.`
)

SpriteWeave.Outline(
	"SW.world.render.animation*",
	{
		"modulus": "SW.num.int*",
		"greaterOrEqual": "SW.num.int*",
		"less": "SW.num.int*",
	},
	`If (( t % modulus ) >= greaterOrEqual)
	and (( t % modulus ) < less)
	then then zone will be drawn
	else it will be ignored (as if it did not exist)`
)

SpriteWeave.Outline(
	"SW.world.render.offset*",
	{
		"dx": "SW.num.int*",
		"dy": "SW.num.int*",
	}
)

SpriteWeave.Outline(
	"SW.world.render.position*",
	{
		"x": "SW.num.int*",
		"y": "SW.num.int*",
	}
)

SpriteWeave.Outline(
	"SW.world.render.index*",
	{
		"first": "SW.num.int*",
		"last": "SW.num.int*",
	}
)

SpriteWeave.Outline(
	"SW.world.tabs.tab*",
	`
	| SW.world.tabs.sheets*
	| SW.world.tabs.images*
	`,
	`Enum: "sheets" or "images"`
);

SpriteWeave.Outline( "SW.world.tabs.sheets*", t => t === "sheets" );
SpriteWeave.Outline( "SW.world.tabs.images*", t => t === "images" );

SpriteWeave( "loop/world.get", {
	returns: "loop.world*",
	factory: () => {
		const world = {
				screen: {
					cnv: null,
					ctx: null,
				},
				preview: {
					cnv: null,
					ctx: null,
					clip: null,
				},
				global: {
					cnv: null,
					ctx: null,
					clip: {
						w:1,
						h:1
					}
				},
				zoom: {
					x: 0,
					y: 0,
					s: 20,
				},
				update: {
					screen: true,
					preview: true,
					global: true,
				},
				view: {
					selection: [],
					focus: null,
					tab: "sheets"
				},
				render: {
					targets: [],
				},
				time: {
					looping: true,
					t: null,
					dt: null,
					frame: 0,
				},
				stats: {
					frameFade: 0.1,
					dt: 30,
					fps: 33,
					framerate: 60,
				},
				config: {
					slip: 0
				}
			};
		let loaded = false;
		return () => {
			if( loaded === false ) {
				loaded = true;

				world.screen.cnv = document.getElementById( "main-canvas" );
				world.screen.ctx = world.screen.cnv.getContext( "2d" );
				world.screen.ctx.imageSmoothingEnabled = false;

				world.preview.clip = document.getElementById( "preview-clip" );
				world.preview.cnv = document.getElementById( "preview-canvas" );
				world.preview.ctx = world.preview.cnv.getContext( "2d" );
				world.preview.ctx.imageSmoothingEnabled = false;

				world.global.cnv = document.createElement( "canvas" );
				world.global.ctx = world.global.cnv.getContext( "2d" );
				world.global.ctx.imageSmoothingEnabled = false;
			}
			return world;
		}
	}
} );