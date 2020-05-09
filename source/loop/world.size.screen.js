SpriteWeave( "loop/world.size.screen", {
	imports: {
		"getScreen": "loop/world.get.screen",
	},
	factory: () => {
		return () => {
			const { cnv, ctx } = imports.getScreen(),
				rect = cnv.getClientRects()[ 0 ];
			if( cnv.width !== rect.width ||
				cnv.height !== rect.height ) {
				cnv.width = rect.width;
				cnv.height = rect.height;
			}
			ctx.imageSmoothingEnabled = false;
		}
	}
})