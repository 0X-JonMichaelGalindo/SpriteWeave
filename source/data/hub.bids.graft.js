SpriteWeave.Outline(
    "SW.hub.bids.graft()*",
    {
        parameters: [ "bid:SW.hub.bids.graft*" ],
        returns: "string|SW.num.true*"
    }
)

SpriteWeave.Outline(
    "SW.hub.bids.bids.graft*",
    b => b === "graft",
)
SpriteWeave.Outline(
    "SW.hub.bids.graft*",
    {
        "bid": "SW.hub.bids.bids.graft*",
        "former-graft": "string",
        "new-graft": "string"
    },
    "Move a tree node to a different branch or to a different position within the same branch."
)

SpriteWeave( "data/hub.bids.graft", {
    factory: () => {
        return () => {}
    }
} )