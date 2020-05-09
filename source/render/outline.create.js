SpriteWeave.Outline( "HTML.Image*", "object" );
SpriteWeave.Outline( "HTML.Canvas*", "object" );
SpriteWeave.Outline( "HTML.Canvas-Context2d*", "object" );

SpriteWeave( "render/outline.create", {
    parameters: [
        "image:HTML.Image*"
    ],
    returns: "HTML.Image*",
    isAsync: true,
    factory: () => {
        const own = {
            canvas: document.createElement( "canvas" )
        }

        return image => {
            return new Promise( returnImage => {
                const { canvas } = own,
                    W = canvas.width = image.width,
                    H = canvas.height = image.height,
                    ctx = canvas.getContext( "2d" );
                ctx.imageSmoothingEnabled = false;
                ctx.clearRect( 0,0, W,H );
                ctx.drawImage( image, 0, 0 );
                const pixels = ctx.getImageData( 0,0, W,H ),
                    d = pixels.data,
                    newPixels = ctx.createImageData( W, H ),
                    nd = newPixels.data,
                    row = W*4, w = W-1, h = H-1;
                for( let x=0; x<W; x++ ) {
                    for( let y=0; y<H; y++ ) {
                        let i = ( x + y*W ) * 4;
                        if( d[ i+3 ] === 0 )
                            continue;
                        else if(
                               x === 0
                            || y === 0 
                            || x === w 
                            || y === h 
                            || ( x > 0 && d[ i - 4 + 3 ] === 0 ) 
                            || ( x < w && d[ i + 4 + 3 ] === 0 ) 
                            || ( y > 0 && d[ i - row + 3 ] === 0 ) 
                            || ( y < h && d[ i + row + 3 ] === 0 )
                        ) {
                            nd[ i+0 ] = d[ i+0 ];
                            nd[ i+1 ] = d[ i+1 ];
                            nd[ i+2 ] = d[ i+2 ];
                            nd[ i+3 ] = d[ i+3 ];
                        }
                    }
                }
    
                ctx.putImageData( newPixels, 0, 0 );
    
                const img = new Image();
                img.onload = () => {
                    returnImage( img );
                }
                img.src = canvas.toDataURL();
            } );
        }
    }
})