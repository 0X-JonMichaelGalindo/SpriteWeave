SpriteWeave.Outline( 
	"util.kind.kindset*",
	( () => {
		const kindKeys = {
			"primitive": true,
			"number": true,
			"boolean": true,
			"function": true,
			"string": true,
			"undefined": true,
			"null": true,
			"object": true,
			"array": true,
		}
		return ts => {
			const ks = Object.keys( ts );
			for( let k of ks )
				if( typeof ts[ k ] !== "function" ||
					! ( k in kindKeys ) )
					return false;
			return true;
		} 
	} )(),
` The kindset utility only accepts a kindset object, which has the following 2 requirements:
1. Every key in the kindset must define a function.
2. Only the following keys are allowed:
	- primitive
	- number
	- boolean
	- function
	- string
	- undefined
	- null
	- object
	- array`
);

SpriteWeave( "util/kind", {
	parameters: [
		"target:any",
		"set:util.kind.kindset*",
		"auto:function|unset"
	],
	throws: [ "Incomplete Kindset", "Ambiguous Kindset" ],
	returns: "any",
	factory: () => {
		const kinds = {
			"primitive":n =>
				kinds.number(n)		||
				kinds.boolean(n)	||
				kinds.string(n)		||
				kinds.null(n)		||
				kinds.function(n)	||
				kinds.undefined(n),
			
			"number": n => ( typeof n === "number" && ! isNaN( n ) ),
			"boolean": b => typeof b === "boolean",
			"function": f => typeof f === "function",
			"string": s => ( typeof s === "string" ),
			"undefined": u => ( typeof u === "undefined" ),
			"null": n => n === null,
			"object": o => ( typeof o === "object" && 
				o !== null && ! Array.isArray( o ) ),
			"array": a => Array.isArray( a ),
		}
		/* Use errors only in development mode. */
		if( SpriteWeave.source ) {
			return ( target, set, auto ) => {
				let matches = [];
				for( let kind in set )
					if( kinds[ kind ]( target ) )
						matches.push( set[ kind ] );
				
				if( matches.length === 0 ) {
					if( auto ) return auto( target );
					else {
						console.error( "Kindset ", set, " did not qualify ", target );
						throw "Incomplete Kindset";
					}
				}
				else if( matches.length === 1 ) return matches[ 0 ]( target );
				else if( matches.length > 1 ) {
					console.error( "Kindset ", set, " over-qualified ", 
						target, " with matches ", matches );
					throw "Ambiguous Kindset";
				}
			}
		}
		else {
			return ( target, set, auto ) => {
				for( let kind in set )
					if( kinds[ kind ]( target ) )
						return set[ kind ]( target );
				return auto ? auto( target ) : undefined;
			}
		}
	}
})