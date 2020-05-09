SpriteWeave( "data/state.parent.get", {
	imports: {
		"getState": "data/state.get",
		"get": "data/state.parent.get",
		"test": "data/state.test.component",
	},
	parameters: [ 
		"subject:SW.state.component*",
		"kind:unset|null|string",
		"tree:unset|array|object|SW.state.component*",
	],
	returns: "SW.state.component*|SW.num.true*|null",
	factory: () => {
		return ( subject, kind, tree ) => {
			if( ! tree )
				tree = imports.getState().state;
			if( ! kind )
				kind = null;

			if( subject === tree ) 
				return true;
			else if( Array.isArray( tree ) ) {
				for( let t of tree ) {
					const match = imports.get( 
						subject, 
						kind,
						t 
					);
					if( match === true ) return true;
					else return match;
				}
				return null;
			}
			else if( typeof tree === "object" ) {
				for( let n in tree ) {
					if( Array.isArray( tree[ n ] ) ) {
						const match = imports.get(
							subject, 
							kind,
							tree[ n ] 
						);
						if( match === true ) {
							if( kind === null ||
								kind === imports.test( tree ) )
								return tree;
							else return true;
						}
						else return match;
					}
				}
				return null;
			}
			else return null;
		}
	}
}, 
`Get a ">"-delimited name for serializing.
E.g. An image named "i" becomes "images>i".
E.g. A layer named "hop" might become "sheets>s1>poses>myPose>frames>start1>layers>sumLayer>layers>hop"`
)