SpriteWeave.Outline(
    "SW.hub.bids.rename()*",
    {
        parameters: [ "bid:SW.hub.bids.rename*" ],
        returns: "string|SW.num.true*"
    }
)

SpriteWeave.Outline(
    "SW.hub.bids.bids.rename*",
    b => b === "rename",
)
SpriteWeave.Outline(
    "SW.hub.bids.rename*",
    {
        "bid": "SW.hub.bids.bids.rename*",
        "old-name": "string",
        "new-name": "string"
    },
    "Rename a named component of the state."
)

SpriteWeave( "data/hub.bids.rename", {
    imports: {
        "lookup": "data/state.lookup",
    },
    parameters: [ "bid:SW.hub.bids.rename" ],
    returns: "SW.num.true*|string",
    factory: () => {
        const illegalNameCharacters = /[^\w\n\s_\-]/gm;

        return bid => {
            const oldName = bid[ "old-name" ]
                finalOldName = oldName.split( ">" ).pop(),
                newName = bid[ "new-name" ],
                finalNewName = newName.split( ">" ).pop();
            if( finalNewName.length === 0 )
                return "Name cannot be empty.";
            else if( finalNewName.match( illegalNameCharacters ) )
                return "Name must be letters, numbers, whitespace, _, or - only.";
            else {
                console.log( "Renaming!!!: ", oldName, newName );
                frame = imports.lookup( oldName );
                frame.name = newName.split( ">" ).pop();
                return true;
            }
        }
    }
})