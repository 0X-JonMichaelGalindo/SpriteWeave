SpriteWeave.Outline( 
	"SW.dom.utils.utils*", 
	{
		"put": "SW.dom.utils.put()*",
		"make": "SW.dom.utils.make()*",
		"style": "SW.dom.utils.style()*",
		"unstyle": "SW.dom.utils.unstyle()*",
	}, 
	"A collection of tools to make working with the DOM cleaner." 
);

SpriteWeave.Outline( 
	"SW.dom.utils.unstyle()*", 
	{
		parameters: [ 
			"S:array|string", 
			"a:HTML.Element*", 
		],
	}, 
	"Removes style(s) \"S\" from HTML element \"a\"." 
);

SpriteWeave.Outline( 
	"SW.dom.utils.style()*", 
	{
		parameters: [ 
			"S:array|string", 
			"a:HTML.Element*", 
		],
	}, 
	"Apply style(s) \"S\" to HTML element \"a\"."
);

SpriteWeave.Outline( 
	"SW.dom.utils.make()*", 
	{
		parameters: [ 
			"n:string", 
		],
		returns: "HTML.Element*",
	}, 
	"Create a new HTML element of kind \"n\"." 
);
SpriteWeave.Outline( 
	"SW.dom.utils.put()*", 
	{
		parameters: [ 
			"a:string|HTML.Element*",
			"b:HTML.Element*",
		],
	}, 
	"Insert text or HTML element \"a\" into HTML element \"b\"." 
);

SpriteWeave( "dom/utils.get", {
	returns: "SW.dom.utils.utils*",
	factory: () => {
		const utils = {
			"put": ( a, b ) => {
				typeof a === "string" ?
				b.appendChild( 
					document.createTextNode( a ) 
				) :
				b.appendChild( a );
			},
			"make": n => document.createElement( n ),
			"style": ( S, a ) => {
				S = Array.isArray( S ) ? S : [S];
				a.classList.add( ...S );
			},
			"unstyle": ( S, a ) => {
				S = Array.isArray( S ) ? S : [S];
				a.classList.remove( ...S );
			},
		}
		return () => utils;
	}
} )