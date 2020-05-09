SpriteWeave( "loop/world.render.screen", {
	imports: {
		"getScreen": "loop/world.get.screen",
		"getGlobal": "loop/world.get.global",
		"moveGlobal": "loop/world.move",
		"sizeScreen": "loop/world.size.screen",
	},
	factory: () => {
		return () => {
			const { 
					getScreen,
					getGlobal,
					moveGlobal, 
					sizeScreen
				} = imports,
				{ ctx } = getScreen(),
				{ cnv, clip } = getGlobal();

			sizeScreen();

			ctx.save();

			moveGlobal();

			ctx.translate( 
				-1 * parseInt( clip.w / 2 ), 
				-1 * parseInt( clip.h / 2 ) 
			);
			ctx.drawImage(
				cnv,
				0, 0, clip.w, clip.h,
				0, 0, clip.w, clip.h
			);

			ctx.restore();
		}
	}
})