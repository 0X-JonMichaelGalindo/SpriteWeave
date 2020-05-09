SpriteWeave( "loop/world.move", {
    imports: {
        "getScreen": "loop/world.get.screen",
        "getZoom": "loop/world.get.zoom",
    },
    factory: () => {
        return () => {
            const {
                    getScreen,
                    getZoom
                } = imports,
                { cnv, ctx } = getScreen(),
                z = getZoom(),
                w = cnv.width,
                h = cnv.height;
            ctx.translate(
                parseInt( w/2 ) + z.x,
                parseInt( h/2 ) + z.y
            );
            ctx.scale( z.s, z.s );
        }
    }
})