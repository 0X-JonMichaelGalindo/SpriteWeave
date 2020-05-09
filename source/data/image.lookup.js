
SpriteWeave( "data/image.lookup", {
    imports: {
        "getState": "data/state.get"
    },
    parameters: [ 
        "imageName:string",
        "cellName:string|unset",
        "getSprite:unset|SW.num.true*",
    ],
    returns: `
        | SW.state.images.image*
        | SW.state.images.cell*
        | SW.state.images.sprite*
        | null
    `,
    factory: () => {
        return ( imageName, cellName, getSprite ) => {
            const images = imports.getState().state.images;

            let image;
            for( let i of images )
                if( i.name === imageName ) {
                    image = i;
                    break;
                }
            if( ! image ) return null;
            else if( cellName ) {
                let cell;
                for( let c of image.cells ) {
                    if( c.name === cellName ) {
                        cell = c;
                        break;
                    }
                }
                if( ! cell ) return null;
                else {
                    if( getSprite === true ) {
                        return {
                            img: image.image,
                            rect: cell.rect
                        }
                    }
                    return cell;
                }
            }
            else return image;
        }
    }
})