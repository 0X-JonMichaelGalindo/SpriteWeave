SpriteWeave( "loop/world.size.preview", {
	imports: {
		"getWorld": "loop/world.get",
	},
	parameters: [ "size:SW.num.rect*" ],
	factory: () => {
		return size => {
			const world = imports.getWorld(),
				{ clip, cnv, ctx } = world.preview,
				w = size.x2 - size.x,
				h = size.y2 - size.y;
				
			if( cnv.width < w )
				cnv.width = w;
			if( cnv.height < h )
				cnv.height = h;

			clip.style.width = w + "px";
			clip.style.height = h + "px";
			
			ctx.imageSmoothingEnabled = false;
		}
	}
} );