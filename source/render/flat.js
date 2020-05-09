SpriteWeave( "render/flat", {
	imports: {
		"getState": "data/state.get",
	},
	parameters: [
		"f:SW.num.int*",
		"ctx:HTML.Canvas-Context2d*",
		"zones:SW.world.render.zones*",
	],
	factory: () => {
		return ( f, ctx, zones ) => {
			const sprites = imports.getState().render.flat;
			ctx.save();
			for( let z of zones ) {
				if( z.animation ) {
					const dt = f % z.animation.modulus,
						visible = ( dt < z.animation.less ) &&
						( dt >= z.animation.greaterOrEqual );

					if( visible === false )
						continue;
				}
				if( z.coord ) {
					if( "x" in z.coord ) {
						ctx.restore();
						ctx.save();
						ctx.translate( 
							z.coord.x, 
							z.coord.y 
						);
					}
					else {
						ctx.translate( 
							z.coord.dx,
							z.coord.dy
						)
					}
				}
				for( let I of z.indices ) {
					for( let i=I.first; i<=I.last; i++ ) {
						const sprite = sprites[ i ],
							img = sprite.img.img,
							source = sprite.img.rect,
							dest = sprite.position,
							w = source.x2 - source.x,
							h = source.y2 - source.y;
						//TODO: If mirror: save, trx, scale, draw, restore
						ctx.drawImage(
							img,
							source.x, source.y,
							w, h,
							dest.x, dest.y,
							w, h
						);
					}
				}
			}
			ctx.restore();
		}
	}
})