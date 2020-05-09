SpriteWeave.Outline(
	"SW.tree*",
	{
		"label": "string",
		"click": "boolean|unset",
		"drag": "string|unset",
		"id": "string|unset",
		"furl": "boolean",
		"nodes": [ "SW.tree*", "..." ],
	},
	`A pseudo-object representing the tree to be passed to "dom/tree.add"<br>
	If "click" is set to true, the click-handler will be attached to this tree's label element.<br>
	When clicked, the click-handler will be called & passed the element's ID or undefined.<br>
	If "drag" is set to the name of the drag class, "id" must also be specified.<br>
	If "id" is set, the HTML DOM tree's element will have that id.
	If "furl" is true, the tree's branch will generate collapsed.
	If "furl" is false, the tree's branch will generate open.`
)

SpriteWeave.Outline( 
	"SW.tree.tree*", 
	"SW.tree.basis*&SW.tree.draggable*",
	"See SW.tree* for a better explanation of what dom/tree.add requires."
);

SpriteWeave.Outline( 
	"SW.tree.basis*", 
	{
		"label": "string",
		"click": "SW.num.true*|unset",
		"furl": "boolean",
		"nodes": "SW.tree.childs*|unset"
	} 
);
SpriteWeave.Outline( 
	"SW.tree.childs*", 
	[ 
		"SW.tree.tree*", 
		"..." 
	]
);

SpriteWeave.Outline( 
	"SW.tree.draggable*", 
	"SW.tree.dynamic*|SW.tree.static*"
)
SpriteWeave.Outline( 
	"SW.tree.dynamic*", 
	{
		"drag": "string",
		"id": "string",
	} 
);
SpriteWeave.Outline( 
	"SW.tree.static*", 
	{
		"id": "string|unset",
	} 
);

SpriteWeave.Outline( 
	"SW.tree.dom*", 
	"HTML.Element*" 
);

SpriteWeave( "dom/tree.add", {
	imports: {
		"getUtils": "dom/utils.get",
		"addTree": "dom/tree.add",
		"addDrop": "dom/drop.add",
	},
	parameters: [
		"tree:SW.tree.tree*",
		"click:function",
		"deep:boolean|unset",
	],
	returns: "SW.tree.dom*",
	factory: () => {
		return ( tree, click, deep ) => {
			const { style, make, put } = 
					imports.getUtils(),
				t = make( "div" ),
				k = ( deep && tree.nodes ) ?
					make( "label" ) : null,
				l = make( "label" );

			style( "tree", t );
			if( ! deep )
				style( "head", t );

			if( tree.id && tree.drag )
				imports.addDrop( l, tree.id, tree.drag );

			put( tree.label, l );
			if( k ) put( k, t );
			put( l, t );

			if( tree.id ) 
				l.id = tree.id;
				
			if( tree.nodes ) {
				style( "deep", t );
				style( "deep", l );

				if( deep ) {
					put( tree.furl === true ?
						"+" : "-", k );
					style( "knob", k );
					const unfurl = () => {
						if( t.classList.contains( "furl" ) ) {
							t.classList.remove( "furl" );
							k.innerText = "-";
						}
						else {
							t.classList.add( "furl" );
							k.innerText = "+";
						}
					}
					k.onclick = unfurl;
				}


				if( deep && tree.furl === true )
					style( "furl", t );

				let last = null;
				for( let tr of tree.nodes ) {
					const st = 
						imports.addTree(
							tr, 
							click, 
							true
						);
					put( st, t );
					last = st;
				}
				style( "end", last );
			}
			else {
				style( "stub", t );
				style( "stub", l );
			}
			if( tree.click ) {
				style( "live", l );
				l.onclick = () => {
					click( tree.id );
				}
			}

			return t;
		}
	}
}, "Usage: Pass a tree and a click handler.")