SpriteWeave( "data/state.export-json", {
    returns: "string",
    factory: () => {
        return () => 
            JSON.stringify( 
                imports.
                    getState().
                    state 
            );
    }
})