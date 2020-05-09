SpriteWeave( "render/frame", {
	imports: {
		"render": "render/layer",
	},
	parameters: [
		"frame:SW.state.sheets.frame*",
		"dest:HTML.Canvas-Context2d*",
		"mode:SW.render.mode*|unset",
		"color:SW.num.color*|unset"
		//color is used with mode="ghost"
		//color.a, if set, will supercede current dest.globalAlpha
	],
	factory:() => {
		return ( frame, dest, mode, color ) => {
			const { render } = imports,
					layers = frame.layers;
			for( let l of layers ) {
				if( mode ) {
					if( color ) {
						render( l, dest, mode, color );
					}
					else render( l, dest, mode );
				}
				else render( l, dest );
			}
		}
	}
},
`Parameters:<br>
frame - frame whose layers will be drawn to dest.<br>
dest - HTML5 canvas context2d as destination<br>
<div style="margin-left:1rem;">(any pre-set transformations will be preserved, including globalAlpha except in ghost-mode.)</div>
mode - (optional) "normal", "outline", or "ghost"<br>
color - (optional) in "ghost" mode, color to use instead of original outline colors.<br>
<div style="margin-left:1rem;">(Colors are r,g,b[,a]. Bytes for r,g,b, unit-interval for a.)</div>
<div style="margin-left:1rem;">(If not specified, ghost-mode uses a default blueish ghost color.)</div>
`
)