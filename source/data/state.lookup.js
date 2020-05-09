SpriteWeave( "data/state.lookup", {
    imports: {
        "getState": "data/state.get",
    },
    parameters: [ "name:string" ],
    returns: "SW.state.component*",
    factory: () => {
        return name => {
            const state = imports.getState().state,
                names = name.split( ">" );

            let n = names.shift(),
                level = state[ n ];
            
            if( names.length === 0 )
                return level;
            else while( names.length > 0 ) {
                n = names.shift();
                if( Array.isArray( level ) ) {
                    for( let s of level ) {
                        if( s.name === n ) {
                            if( names.length === 0 )
                                return s;
                            else level = s;
                            break;
                        }
                    }
                }
                else if( typeof level === "object" )
                    level = level[ n ];
            }
        }
    }
} )