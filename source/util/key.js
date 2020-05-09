SpriteWeave.Outline(
    "SW.util.key.options*",
    o => {
        if( typeof o !== "object" )
            return false;
        for( let n in o ) {
            if( o.hasOwnProperty( n ) === false )
                continue
            else if( typeof o[ n ] !== "function" )
                return false;
        }
        return true;
    },
    `A dictionary of strings mapped to functions.
    e.g. { "key1": target=>{...}, "key2": target=>{...}, ... }`
)

SpriteWeave( "util/key", {
        parameters: [
            "key:string",
            "target:any",
            "options:SW.util.key.options*",
            "auto:function|unset",
        ],
        returns: "any",
        factory: () => {
            return ( key, target, options, auto ) => {
                if( options.hasOwnProperty( key ) ) {
                    const res = options[ key ]( target );
                    return res;
                }
                else if( auto ) return auto( target );
                else return undefined;
            }
        }
    },
    `Compares "key" against the keys of object "options".
    If a match is found, returns the result of passing "target" to "options"[ "key" ].
    else, If no match is found, returns the result of passing "target" to "auto".
    else, If "auto" is not set, returns undefined.`
)