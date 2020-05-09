SpriteWeave.Outline( 
    "SW.hub.hub*", 
    {
        "log": [ "SW.hub.bids.bid*", "..." ],
        "bids": "SW.hub.bids*"
    } 
)

SpriteWeave.Outline(
    "SW.hub.bids*",
    {
        "duplicate": "SW.hub.bids.duplicate()*",
        "graft": "SW.hub.bids.graft()*",
        "rename": "SW.hub.bids.rename()*",
    }
)

SpriteWeave( "data/hub.get", {
    imports: {
        "duplicate": "data/hub.bids.duplicate",
        "graft": "data/hub.bids.graft",
        "rename": "data/hub.bids.rename",
    },
    returns: "SW.hub.hub*",
    factory: () => {
        const hub = {
            log: [],
            bids: null
        }
        return () => {
            if( ! hub.bids ) {
                hub.bids = {
                    "duplicate": imports.duplicate,
                    "graft": imports.graft,
                    "rename": imports.rename,
                }
            }
            return hub;
        }
    }
})