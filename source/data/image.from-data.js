SpriteWeave( "data/image.from-data", {
    parameters: [ "data:string" ],
    returns: "HTML.Image*",
    isAsync: true,
    factory: () => {
        return data => {
            return new Promise( ( returnImage, failImage ) => {
                const img = new Image(),
                    errorMsg = `Image Load Failed`;
                img.onload = () => {
                    if( img.width > 0 && 
                        img.height > 0 )
                        returnImage( img );
                    else failImage( errorMsg );
                }
                img.onerror = () => {
                    failImage( errorMsg );
                }
                img.src = data;
            } );
        }
    }
} );