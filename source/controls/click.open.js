SpriteWeave( "controls/click.open", {
    factory: () => {
        return () => {
            document.getElementById( "json-uploader" ).click();
        }
    }
} )