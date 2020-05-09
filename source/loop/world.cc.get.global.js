SpriteWeave( "loop/world.cc.get.global", {
    imports: {
        "getWorld": "loop/world.get",
    },
    returns: "SW.num.point*",
    factory: () => {
        return ( x,y ) => {
            const world = imports.getWorld(),
                w = parseInt( world.cnv.width / 2 ),
                h = parseInt( world.cnv.height / 2 ),
                z = world.zoom;
            return {
                x: ( x - w - z.x ) / z.s,
                y: ( y - h - z.y ) / z.s
            }
        }
    }
}, 
"Convert screen coordinates to global coordinates."
);