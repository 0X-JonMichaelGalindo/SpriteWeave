SpriteWeave.Outline(
    "SW.html.templates.template*",
    {
        "node": "string",
        "style": "unset|string|array",
        "templates": `
            | unset
            | SW.html.templates.collection*
        `,
    }
)
SpriteWeave.Outline(
    "SW.html.templates.collection*",
    [ "SW.html.templates.template*", "..." ]
)

SpriteWeave.Outline(
    "SW.html.templates.filled*",
    {
        "node": "string",
        "style": "unset|string|array",
        "element": "HTML.Element*",
        "templates": `
            | unset
            | SW.html.templates.collection*
        `,
    }
)

SpriteWeave.Outline( 
	"HTML.Element*", 
	"any" 
);

SpriteWeave.Outline(
    "SW.html.templates.filled-collection*",
    [ "SW.html.templates.filled*", "..." ]
)

SpriteWeave( "dom/template.fill", {
    imports: {
        "utils": "dom/utils.get",
        "copy": "util/copy",
        "fill": "dom/template.fill",
    },
    parameters: [
        "template:SW.html.templates.template*"
    ],
    returns: "SW.html.templates.filled*",
    factory: () => {
        return template => {
            const { copy, utils, fill } =
                    imports,
                { make, style, put } = 
                    utils(),
                element = copy( template ),
                node = make( element.node );

            for( let prop in element ) {
                const val = element[ prop ];
                if( prop === "style" )
                    style( val, node );
                else if( prop === "templates" )
                    for( let i in val ) {
                        val[ i ] = fill( val[ i ] );
                        put( val[ i ].element, node );
                    }
                else if( typeof val === "function" )
                    val( node );
                else node[ prop ] = val;
            }

            element.element = node;

            window.filledTemplates =
                window.filledTemplates || [];

            window.filledTemplates.push( element );

            return element;
        }
    }
})