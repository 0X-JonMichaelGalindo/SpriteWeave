SpriteWeave( "data/state.name.get", {
	imports: {
		"getState": "data/state.get",
		"get": "data/state.name.get",
	},
	parameters: [ 
		"subject:SW.state.component*",
		"tree:unset|array|object|SW.state.component*",
		"prefix:string"
	],
	returns: "string|null",
	factory: () => {
		return ( subject, tree, prefix ) => {
			if( ! tree ) {
				tree = imports.getState().state;
				prefix = "";
			}

			if( subject === tree ) 
				return prefix;
			else if( Array.isArray( tree ) ) {
				for( let t of tree ) {
					const match = imports.get( 
						subject, 
						t,
						( prefix.length ? 
							prefix + ">" : 
							"" 
						) + t.name
					);
					if( match )
						return match;
				}
				return null;
			}
			else if( typeof tree === "object" ) {
				for( let n in tree ) {
					if( Array.isArray( tree[ n ] ) ) {
						const match = imports.get(
							subject,
							tree[ n ],
							( prefix.length ? 
								prefix + ">" : 
								"" 
							) + n
						)
						if( match )
							return match;
					}
				}
				return null;
			}
			return null;
		}
	}
}, 
`Get a ">"-delimited name for serializing.
E.g. An image named "i" becomes "images>i".
E.g. A layer named "hop" might become "sheets>s1>poses>myPose>frames>start1>layers>sumLayer>layers>hop"`
)