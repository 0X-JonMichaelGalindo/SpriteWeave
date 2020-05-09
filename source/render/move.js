SpriteWeave( "render/move", {
	parameters: [ 
		"ctx:HTML.Canvas-Context2d*",
		"pos:SW.state.sheets.layers.position*",
	],
	factory: () => {
		return ( ctx, pos ) => {
			ctx.translate( pos.x, pos.y );

			if( pos.mirror.horizontal ) {
				ctx.translate( w, 0 );
				ctx.scale( -1, 1 );
			}
			if( pos.mirror.vertical ) {
				ctx.translate( h, 0 );
				ctx.scale( 1, -1 );
			}
			const r = pos.rotate; 
				//0=>0, 90=>1, 180=>2, 270=>3
			if( r ) {
				for( let i=0; i<r; i++ ) {
					ctx.translate( rect.x2 - rect.x, 0 );
					ctx.rotate( Math.PI / 2 );
				}
			}
		}
	}
} );