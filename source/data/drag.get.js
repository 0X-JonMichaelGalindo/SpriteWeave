SpriteWeave.Outline( "SW.state.drag*", { 
    "type": "string|null",
    "id": "string|null"
} );

SpriteWeave( "data/drag.get", {
    returns: "SW.state.drag*",
    factory: () => {
        const drag = {
            type: null,
            id: null
        }
        return () => drag
    }
} )