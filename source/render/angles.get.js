//May be unnecessary... We'll see.
SpriteWeave( "render/angles.get", {
    returns: "SW.angle*",
    factory: () => {
        const angles = Object.freeze(
            {
                "0": 0,
                "90": 1,
                "180": 2,
                "270": 3
            }
        );
        return () => angles;
    }
} )