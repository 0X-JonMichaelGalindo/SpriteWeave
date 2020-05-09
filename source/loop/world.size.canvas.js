SpriteWeave( "loop/world.size.canvas", {
	parameters: [ 
		"cnv:HTML.Canvas*",
		"size:SW.num.rect*" 
	],
	factory: () => {
		return ( cnv, size ) => {
			const w = size.x2 - size.x,
				h = size.y2 - size.y;
				
			if( cnv.width < w )
				cnv.width = w;
			if( cnv.height < h )
				cnv.height = h;

			cnv.getContext( "2d" ).
				imageSmoothingEnabled = false;
		}
	}
} );