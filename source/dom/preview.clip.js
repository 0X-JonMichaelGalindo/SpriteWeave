SpriteWeave(
    "dom/preview.clip",
    {
        parameters: [
            "rect:SW.num.rect*"
        ],
        factory: () => {
            return rect => {
                const clip = document.getElementById( "preview-clip" ),
                    w = rect.x2 - rect.x,
                    h = rect.y2 - rect.y;
                clip.style.width = w + "px";
                clip.style.height = h + "px";
            }
        }
    }
)