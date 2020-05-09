SpriteWeave(
    "dom/pointers.add",
    {
        parameters:[
            "target:HTML.Element*",
            "start:function",
            "move:function",
            "stop:function",
        ],
        factory: () => {
            const ups = [ "up", "cancel", "out", "leave" ];
            return ( target, start, move, stop ) => {
                target.addEventListener(
                    "pointerdown",
                    start
                );
                target.addEventListener(
                    "pointermove",
                    move
                );
                for( let u of ups )
                    target.addEventListener(
                        "pointer" + u,
                        stop
                    );
            }
        }
    }
)