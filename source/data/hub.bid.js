SpriteWeave.Outline(
    "SW.hub.bids.bid*",
    `
    | SW.hub.bids.duplicate*
    | SW.hub.bids.graft*
    | SW.hub.bids.rename*
    | SW.hub.bids.open*
    | SW.hub.bids.zoom*
    | any
    `
)



SpriteWeave.Outline(
    "SW.hub.bids.bids.open*",
    t => t === "open"
)
SpriteWeave.Outline(
    "SW.hub.bids.open*",
    {
        "bid": "SW.hub.bids.bids.open*",
        "former-state": "string",
        "new-state": "string",
    }
)

SpriteWeave.Outline(
    "SW.hub.bids.bids.zoom*",
    t => t === "zoom"
)
SpriteWeave.Outline(
    "SW.hub.bids.zoom*",
    {
        "bid": "SW.hub.bids.bids.zoom*",
        "former-zoom": "SW.hub.bids.bits.zoom*",
        "new-zoom": "SW.hub.bids.bits.zoom*"
    }
)
SpriteWeave.Outline(
    "SW.hub.bids.bits.zoom*",
    {
        "x": "SW.num.int*",
        "y": "SW.num.int*",
        "s": "SW.num.int*"
    }
)




SpriteWeave( "data/hub.bid", {
    imports: {
        "getHub": "data/hub.get",
        "copy": "util/copy",
        "key": "util/key",
    },
    parameters: [ 
        "bid:SW.hub.bids.bid*",
    ],
    returns: "SW.num.true*|string",
    factory: () => {
        return bid => {
            const { getHub, 
                    copy, 
                    key } = 
                    imports,
                hub = getHub(),
                localBid = copy( bid ),
                outcome = key( 
                    localBid.bid, 
                    localBid,
                    hub.bids
                );
            if( outcome === true ) {
                hub.log.push( localBid );
                return true;
            }
            else {
                console.log( "Bid failed because: ", outcome );
                return outcome;
            }
        }
    }
})