//TODO: Move these type definitions to their appropriate files

SpriteWeave.Outline(
	"SW.render.mode*",
	`
	| SW.render.normal*
	| SW.render.outline*
	| SW.render.ghost*
	`
)
SpriteWeave.Outline( 
	"SW.render.normal*", 
	t => t === "normal" 
)
SpriteWeave.Outline( 
	"SW.render.outline*", 
	t => t === "outline" 
)
SpriteWeave.Outline( 
	"SW.render.ghost*", 
	t => t === "ghost" 
)

SpriteWeave( "render/layer", {
	imports: {
		"render": "render/layer",
		"get": "data/image.lookup",
		"move": "render/move",
	},
	parameters: [
		"layer:SW.state.sheets.layers.layer*",
		"dest:HTML.Canvas-Context2d*",
		"mode:SW.render.mode*|unset",
		"color:SW.num.color*|unset"
		//color is used with mode="ghost"
		//color.a, if set, will supercede current dest.globalAlpha
	],
	factory: () => {
		const own = {
			"cnv": document.createElement( "canvas" ),
			"ctx": null,
			"ghost-color": {
				r: 128,
				g: 224,
				b: 255,
				a: 0.68
			}
		}
		own.ctx = own.cnv.getContext( "2d" );
		own.ctx.imageSmoothingEnabled = false;

		return ( layer, dest, mode, color ) => {
			const { render, get, move } = imports;

			if( layer.layers )
				//meta-layer
				for( let l of layer.layers )
					render(
						l,
						dest,
						mode,
						color
					)
			else {
				//image-layer
				const image = get( 
						layer.image.name 
					),
					cell = get( 
						layer.image.name, 
						layer.image.cell 
					),
					pos = layer.position,
					rect = cell.rect,
					w = rect.x2 - rect.x,
					h = rect.y2 - rect.y;
	
				dest.save();
	
				move( dest, pos );
	
				if( mode === "ghost" ) {
					//force clear canvas:
					own.cnv.width = 0;
					own.cnv.height = 0;
	
					//draw outline to own canvas
					own.cnv.width = w;
					own.cnv.height = h;
					own.ctx.drawImage(
						image.outline,
						rect.x, rect.y, 
						w, h,
						0,0, 
						w,h
					);
	
					//replace outline colors with ghost color
					if( ! color ) color = own[ "ghost-color" ];
					const {r,g,b} = color;
					own.ctx.globalCompositeOperation = "source-in";
					own.ctx.fillStyle = `rgb(${r},${g},${b})`;
					own.ctx.fillRect( 0,0,w,h );
	
					//draw ghost to destination canvas
					if( "a" in color )
						dest.globalAlpha = color.a;
					dest.drawImage(
						own.cnv,
						0,0, 
						w, h,
						pos.x, pos.y, 
						w, h
					);
				}
				else {
					let img;
					//draw normal image to destination
					if( ! mode || mode === "normal" )
						img = image.image;
					//draw outline image to destination
					else if( mode === "outline" )
						img = image.outline;
					dest.drawImage(
						img,
						rect.x, rect.y, 
						w, h,
						0, 0, 
						w, h
					);
				}
				dest.restore();
			}
		}
	}
},
`Parameters:<br>
layer - image-layer or meta-layer to draw to dest<br>
dest - HTML5 canvas context2d as destination<br>
<div style="margin-left:1rem;">(any pre-set transformations will be preserved, including globalAlpha, but we expect to translate by the xy coordinates specified in the layer's position.)</div>
mode - (optional) "normal", "outline", or "ghost"<br>
color - (optional) in "ghost" mode, color to use instead of original outline colors.<br>
<div style="margin-left:1rem;">(Colors are r,g,b[,a]. Bytes for r,g,b, unit-interval for a.)</div>
<div style="margin-left:1rem;">(If not specified, uses a default blueish ghost color.)</div>
`
)