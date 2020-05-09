SpriteWeave(
    "loop/loop.focus.layer",
    {
        imports: {
            "parent": "data/state.parent.get",
            "focusFrame": "loop/loop.focus.frame",
            "getView": "loop/world.get.view",
        },
        factory: () => {
            return layer => {
                //focus on parent frame
                const p = parent( layer, "frame" );
                focusFrame( p );

                //highlight this layer
                imports.getView().highlight = layer;
            }
        }
    }
);