"use strict";

SpriteWeave.Outline(
    "SW.hub.bids.duplicate()*",
    {
        parameters: [ "bid:SW.hub.bids.duplicate*" ],
        returns: "string|SW.num.true*"
    }
)

SpriteWeave.Outline(
    "SW.hub.bids.bids.duplicate*",
    b => b === "duplicate",
)
SpriteWeave.Outline(
    "SW.hub.bids.duplicate*",
    {
        "bid": "SW.hub.bids.bids.duplicate*",
        "source-name": "string",
    },
    "Duplicate a named component of the state to 1 slot above in its current tree."
)

SpriteWeave( "data/hub.bids.duplicate", {
    imports: {
        "lookup": "data/state.lookup",
        "getParent": "data/state.parent.get",
    },
    parameters: [ "bid:SW.hub.bids.duplicate*" ],
    returns: "SW.num.true*|string",
    factory: () => {
        return bid => {
            const sourceName = bid[ "source-name" ];

            let dEnd = sourceName.match( /\(\d+\)$/ ),
                copyName = sourceName;
            
            if( dEnd ) {
                dEnd = dEnd.pop();
                const d = 1 * parseInt( dEnd.
                    replace( /[\(\)]/g, "" ) );
                copyName = copyName.replace(
                    /\(\d+\)$/, `(${1+d})` );
            }
            else copyName += " (1)";

            console.log( "Duplicating!!!: ", sourceName, copyName );
            const source = imports.lookup( sourceName ),
                parent = imports.getParent( source );
            console.log( source, parent );
            //frame.name = newName.split( ">" ).pop();
            return true;
        }
    }
})