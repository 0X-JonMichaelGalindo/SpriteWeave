SpriteWeave.Outline(
    "util.copy.primitive*",
    "number|boolean|string|null|function|undefined",
    "THese are values we can copy directly. We do not need to worry (usually) about these being corrupted. At least for SpriteWeave, we are not going to be corrupting any functions."
);

SpriteWeave.Outline(
    "util.copy.array*",
    [ "util.copy.copyable*" ],
    "We can copy any array of copiables by calling copy on each entry recursively."
);

SpriteWeave.Outline(
    "util.copy.object*",
    "object",
    "We can copy any object because its entries will be covered under one of copiable's 3 types."
)

SpriteWeave.Outline( 
    "util.copy.copyable*",
    "util.copy.primitive*|util.copy.array*|util.copy.object*"
)

SpriteWeave( "util/copy", {
    imports: {
        "kind": "util/kind",
        "copy": "util/copy",
    },
    parameters: [ "o:any" ],
    returns: "any",
    factory: () => {
        return o => {
            const { kind, copy } = imports,
                o2 = kind( o, {
                    "primitive": o => o,
                    "array": o => [],
                    "object": o => ({})
                } );
            if( o2 !== o )
                for( let oi in o )
                    o2[ oi ] = copy( o[ oi ] );
            return o2;
        }
    }
})