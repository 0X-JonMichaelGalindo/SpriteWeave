SpriteWeave( "data/state.render.build", {
    imports: {
        "lookup": "data/image.lookup",
        "getState": "data/state.get",
    },
    factory: () => {
        const getSprite = true,
            addLayers = ( L, r, si, pi, fi, lookup ) => {
                for( let l of L ) {
                    if( l.layers ) 
                        addLayers( 
                            l.layers, 
                            r, si, pi, fi,
                            lookup
                        );
                    else {
                        const img = lookup(
                            l.image.name,
                            l.image.cell,
                            getSprite
                        );
                        r.push( {
                            sheet: si,
                            pose: pi,
                            frame: fi,
                            layer: l,
                            img: img,
                            position: l.position,
                            //sprite: copied_sprite
                        } );
                    }
                }
            }

        return () => {
            const lookup = imports.lookup,
                ref = imports.getState(),
                state = ref.state,
                render = ref.render,
                flat = render.flat;
            let si = 0,
                pi = 0,
                fi = 0;

            flat.length = 0;

            for( let s of state.sheets ) {
                for( let p of s.poses ) {
                    for( let f of p.frames ) {
                        addLayers( 
                            f.layers, 
                            flat,
                            si, pi, fi,
                            lookup
                        );
                        ++fi;
                    }
                    ++pi;
                }
                ++si;
            }
        }
    }
},
`Build a flat-mapped array of all renderable image layers.<br>
Can render by looping through this array rather than traversing the state layer stack.`
)