SpriteWeave( "data/image.to-data", {
	parameters: [ "img:HTML.Image*" ],
	returns: "string",
	factory: () => {
		const own = {
			cnv: document.createElement( "canvas" ),
			ctx: null
		}
		own.ctx = own.cnv.getContext( "2d" );

		return img => {
			//force clear canvas
			own.cnv.width = 0;
			own.cnv.height = 0;

			own.cnv.width = img.width;
			own.cnv.height = img.height;
			
			own.ctx.drawImage( img, 0,0 );

			const data = own.cnv.toDataURL();

			return data;
		}
	}
} )