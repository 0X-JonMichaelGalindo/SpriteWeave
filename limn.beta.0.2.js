/*

~ LimnJS ~

An in-browser, typed-enforced, code-explorer and auto-documenter for
 in-development JavaScript source.

-------------------------------------------------------------------------------

Copyright 2020 Jon Michael Galindo

Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in 
 the Software without restriction, including without limitation the rights to 
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
 of the Software, and to permit persons to whom the Software is furnished to do
 so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
*/	

"use strict";

( async function LimnInit() {
	/*
		Structure of This Library

		1. Global Constants
		2. Loading + Configuration
			- getNextWaitingLimn()
			- becomeLimn()
			- load()
			- loadIfNecessary()
			- waitForLimnary()
			- acknowledgeLimnaryParse()
			- waitForAllReady()
			- checkReady()
		3. Error-Throwers
			- throwOnParameters()
			- throwOnReturn()
			- throwOnEmit()
			- throwOnListenerDefinition()
			- throwOnReturnsDefinition()
			- throwOnParametersDefinition()
			- throwOnEmitsDefinition()
		4. Limn Global Function ()
			# define new limn
				# validate names
				# validate definition
					# check for factory
					# validate returns
					# validate listens
					# validate parameters
					# validate emits
				# populate imports
					# validate names
					# load import via Limn Global Function
					# proxy loaded import:
						# throw on bad parameters
						# throw on bad returns
				# build factory
					# proxy console:
						# ID limn logging
					# build with scoped proxies
					# validate build
				# proxy factory for external code
					# throw on bad parameters
					# throw on bad returns
				# add listeners
				# acknowledge parse
				# await dependency loading
			# fetch limn
				# load source if necessary
		5. Outlines
			- isValidOutline()
			- outlinesIntersect()
			- getLexicalOutlines()
			- isLexicalOutline()
			- isIdentity()
			- Outline Types (Primitives)
			- Fits Outline
				# TODO: Explain this (needs more than structure)
				- fitTerminators
					- makeTargetFitHistory()
					- makeOutlineFitHistory()
					- makeFitCheck()
					- getOutlineFitCheck()
					- getTargetFitHistory()
				- stringify()
				- fitsOutline()
				- testFitsOutline()
				- mixBintoA()
			- getOutline()
			- Outline Formats as HTML
			- formatLimnaryName()
			- extractTypeDependencies()
			- formatType()
			- summarize()
			- formatTypeOrLimnary()
			- getDetail()
			- getSummary()
			- Global Outline Function ()
		6. Build
			- promise polyfill (anonyco's SPromiseMeSpeedJS)
			- checkIfUsingEmit()
			- Build Archaic ()
			- Build Brief ()
		7. Code Explorer
			- getNewWindow()
			- Global Explore Function ()
				# create popup
				# analyze source code dependencies
				# sort alphabetically
				- make(), write(), add()
				- makeTab()
					# onclick - populate explorer panel
				- listDetails()
					# verbose parameters or type definition
				- listSupports()
					# verbose dependencies
				- limnCellNeeds()
					# make down-stream dependencies graph
				- limnCellNeededBy()
					# make up-stream dependencies graph
				- clearGraphLites()
				- makeCell()
					# make a graph
					# cell, head, title, hover, click, tail
				- getIngoerStack(), getOutgoerStack()
					addNeedsGraph(), addNeededByGraph()
				- expand()
					# For each tree entry:
						# add tree menu label
						# build outline description
							# add menu-label preview
							# click (info|launch)
							# title
							# url + description
							# details: outline definition
							# dependencies
						# build limn description
							# add menu-label preview
							# onclick (info|launch)
							# title
							# url + description
							# details: parameters + returns
							# dependencies
							# dependency graph
							# raw factory code
						# repeat for children
					# add stylesheet
					# insert container
					# insert menu
					# build build panel
						# container, button, name, version, globalname
						# onclick: build, activate download link
					# insert build panel
					# insert panel
					# insert tabs row
					# insert code block
				# dispatch global event
				- Code Explorer CSS
					# theme
					# build panel
					# menu
					# tabs row
					# main explorer
					# floating previews
					# graph

	*/

	var __VERSION__ = "beta.0.2";

	var urls = {},
		outlinesPendingURL = [],
		listeners = {},
		Limnaries = {},
		LiteralNames = {},
		LimnaryMethods = {},
		LimnaryPassables = {},
		LimnaryDefinitions = {},
		LimnaryDescriptions = {},
		FunctionOutlines = new WeakMap(),
		/*
			ListenersForParsing = {
				"limnary.method.name": 
					[ listener1(), listener2(), ... ]
			}

			Each entry in ListenersForParsing maps 1 limnary name
				to an array of listeners.
			When the limnary parses, every listener fires with
				the limnary's method as its sole parameter,
				then the array is deleted from the ListenersForParsing
				object.
		*/
		ListenersForParsing = {},
		LimnAlias = "Limn",
		LimnOverwritten = false,
		limnDirectory = null,
		buildVersion = 0,
		useArchaicJS = false,
		noPromisePolyfill = false,
		useGlobalizer = false,
		noBuildEvent = false;

	var illegalNameCharacters = /[^/\w\d_\-.]|\.\./gi,
		illegalOutlineCharacters = /[^/\w\d_\-.*()|&]|\.\./gi,
		illegalDirectoryCharacters = /[^/\w\d.\-]/gi;

	//check out what's loaded already, load the first waiting limn.
	function getNextWaitingLimn() {
		if( document && document.getElementsByTagName ) {
			let scripts = document.getElementsByTagName( "script" ),
				staticScripts = [],
				allLimns = [];
			for( let s of scripts ) staticScripts.push( s );
			for( let s of staticScripts ) {
				if( s.src && s.src.indexOf( `limn.${__VERSION__}.js` ) > -1 ) {
					let directory = s.getAttribute( "source-directory" ),
						globalName = s.getAttribute( "global-name" ),
						loaded = s.getAttribute( "finished-loading" ),
						conflict = s.getAttribute( "conflicting-names" ),
						version = s.getAttribute( "build-version" ),
						archaic = s.getAttribute( "use-archaic-js" ),
						noPromise = s.getAttribute( "no-promise-polyfill" ),
						rebuildGlobal = s.getAttribute( "build-global" ),
						noEvent = s.getAttribute( "no-build-event" );
						
					if( archaic && archaic.toLowerCase() === "false" )
						archaic = false;
					if( noPromise && noPromise.toLowerCase() === "false" )
						noPromise = false;
					if( noEvent && noEvent.toLowerCase() === "false" )
						noEvent = false;

					if( conflict ) continue;
					else allLimns.push( {
						node: s,
						directory: directory || null,
						globalName: globalName || null,
						loaded: loaded || false,
						version: version,
						archaic: archaic,
						noPromise: noPromise,
						rebuildGlobal: rebuildGlobal,
						noEvent: noEvent
					} );
				}
			}
			//check if two limns are trying to load with the same name and fail both
			for( let a of allLimns ) {
				for( let b of allLimns ) {
					if( a === b ) continue;
					if( a.globalName === b.globalName ) {
						let errorType = "";
						if( a.directory === b.directory ) {
							console.error( "Tried to load the same limn twice: ",
								"global-name: ", a.globalName, " and source-directory: ", a.directory,
								"\nPlease delete one of the two calls to Limn.",
								"\nLimn failed to load. Nothing has been added to the global scope.",
								"\nIf there are any other limns on this page, they will continue to load as normal." );
							errorType = "duplicate load";
						}
						else {
							console.error( "Two different limns tried to load with the same global name: ",
								(a.globalName ? a.globalName : "Limn" ),
								( window[ a.globalName ] ? 
									( "\nOne of these loaded normally. The other failed to load.\n" ) :
									"\nNeither can load because of the conflict.\n" ),
								(a.globalName ?
									"Please use a different name for each of your limn loads." :
									( "Loading 2 limns requires that each have a unique global name.\n" +
									"please specify those names like this:\n" +
									`<script src="limn.js" global-name="aUniqueName" source-directory="${a.directory}"></script>\n` +
									`<script src="limn.js" global-name="anotherUniqueName" source-directory="${b.directory}"></script>\n` ) ),
								"\nIf there are any other limns on this page, they will continue to load as normal." );
							errorType = "duplicate global names";
						}

						for( let n of [ a.node, b.node ] ) {
							n.setAttribute( "finished-loading", "true" );
							n.setAttribute( "load-failed", errorType );
							n.setAttribute( "conflicting-names", "true" );
						}
						throw "Duplicate Limn Error";
					}
				}
			}
			if( allLimns.length ) {
				return allLimns.pop();
			}
			else return false;
		}
		else {
			console.error( "Limn failed to load because it could not access the document!\n" +
				"Limn can only load in the body of your document. It cannot load as a module or in a non-browser context." );
			throw "Limn Load Scope Error";
		}
	}
	function becomeLimn( info ) {
		const { node, directory, globalName, 
			version, archaic, noPromise,
			rebuildGlobal, noEvent } = info;
		if( directory ) {
			let illegalMatch = directory.match( illegalDirectoryCharacters );
			if( illegalMatch !== null ) {
				console.error( "Limn tried to load an invalid source directory name: ", 
					directory, illegalMatch, `\nLimn did not load${globalName?" "+globalName:""}. `,
					"Nothing has been added to the global scope.",
					"\nIf there are any other limns on this page, they will continue to load as normal." );
				node.setAttribute( "finished-loading", "true" );
				node.setAttribute( "load-failed", "invalid directory" );
				throw "Limn Invalid Source Directory";
			}
			else limnDirectory = directory.replace( /\/$/, "" );
		}
		if( globalName ) LimnAlias = globalName;
		if( version ) buildVersion = version;
		if( archaic ) useArchaicJS = true;
		if( noPromise ) noPromisePolyfill = true;
		if( rebuildGlobal ) useGlobalizer = true;
		if( noEvent ) noBuildEvent = true;
		node.setAttribute( "finished-loading", "true" );
	}
	let nextLimn = getNextWaitingLimn();
	if( nextLimn === false ) {
		//can happen if a limn was eliminated from the loading list due to a naming conflict.
		//fail silently, since that limn's failure will already have been logged to the console.
		return false;
	}
	else becomeLimn( nextLimn );

	function load( name ) {
		name = name.replace( /\//g, "." );
		let s = document.head.appendChild( document.createElement( "script" ) ),
			lName = LiteralNames[ name ];
		s.src = ( limnDirectory ? limnDirectory + "/" : "" ) + lName + ".js";
		
	}
	function loadIfNecessary( name ) {
		name = name.replace( /\//g, "." );
		if( ! Limnaries[ name ] &&
			! ListenersForParsing[ name ] ) {
			ListenersForParsing[ name ] = [];
			load( name );
		}
	}
	//waitForLimnary() only waits for the named method to load & parse.
	//	Only call this after confirming the limnary does not exist!
	//	If it exists, this promise will never resolve!
	function waitForLimnary( name ) {
		name = name.replace( /\//g, "." );
		return new Promise( announceLoad => {
			loadIfNecessary( name );
			ListenersForParsing[ name ].push( announceLoad );
		} );
	}
	function acknowledgeLimnaryParse( name, parsedLimnary ) {
		name = name.replace( /\//g, "." );
		if( ListenersForParsing[ name ] )
			for( let announcer of ListenersForParsing[ name ] )
				announcer( parsedLimnary );
		delete ListenersForParsing[ name ];
	}
	function waitForAllReady( name ) {
		name = name.replace( /\//g, "." );
		return new Promise( ( resolve ) => {
			var travelingResolver = function() {
				let readyOrName = checkReady( name );
				if( readyOrName === true ) {
					if( name === LimnAlias && 
						useGlobalizer &&
						LimnOverwritten === false ) {
						let newGlobal = Limnaries[ name ]( window[ LimnAlias ] );
						window[ LimnAlias ] = newGlobal;
						LimnOverwritten = true;
					}
					resolve( Limnaries[ name ] );
				}
				else {
					if( readyOrName === name )
						loadIfNecessary( name );
					ListenersForParsing[ readyOrName ].push( 
						travelingResolver
					);
				}
			}
			travelingResolver();
		} );
	}
	/* usage: checkReady( limnaryName )
		Returns true if limnary is ready.
		If not ready, returns name of 1st encountered
			unloaded dependency (which will be name of
			limnary if not loaded yet).
	*/
	function checkReady( name, ignore ) {
		name = name.replace( /\//g, "." );
		let def = LimnaryDefinitions[ name ];
		if( ! def ) return name;
		else {
			ignore = ignore || {};
			ignore[ name ] = true;
			let dependencyNames = Object.values( def.imports || {} );
			for( let n of dependencyNames )
				if( ! ignore[ n ] &&
					! ignore[ n.replace( /\//g, "." ) ] ) {
					let readyOrName = checkReady( n, ignore );
					if( readyOrName !== true ) return readyOrName;
				}
		}
		return true;
	}
	/*
		usage: throwOnParameters( [parameter1, parameter2, ...], [outline1, outline2, ...] )
		Throws an error if the parameters array does not fit the outlines array.
	*/
	function throwOnParameters( name, params, def, caller ) {
		name = name.replace( /\//g, "." );
		if( def.listen ) {
			if( params.length !== 2 ) {
				console.error( "Event listeners must always be passed 2 parameters:" +
					` the event name and the event detail. ${caller} passed: `, 
					...params, "\n\nto " + name );
				throw "Inherent Listener Parameter Violation";
			}
			else return true;
		}
		else if( def.parameters ) {
			let pdefs = def.parameters;
			if( pdefs.length !== params.length ) {
				let unsettables = false;
				for( let pdef of pdefs ) {
					if( isUnset( pdef.split( ":" ).pop() ) ) {
						unsettables = true;
						break;
					}
				}
				if( unsettables === false ) {
					if( params.length === 0 ) {
						console.error( `${caller } did not pass any parameters to ${name}, but` +
							` ${name} expected ` + pdefs.join( ", " ) )
					}
					else {
						const manyOrFew = params.length > pdefs.length ?
							"too many" : "too few";
						console.error( `${caller} passed ${manyOrFew} parameters to ${name}.`,
							`\n${caller} passed: `, ...params, 
							`\n\n but ${name} expected: `, pdefs.join(", ") );
					}
					throw "Parameter Documentation Violation";
				}
			}
			for( let i=0; i<pdefs.length; i++ ) {
				if( i === params.length ) {
					if( isUnset( pdefs[ i ].split( ":" ).pop() ) )
						return true;
					else {
						const manyOrFew = "too few";
						console.error( `${caller} passed ${manyOrFew} parameters to ${name}.`,
							`\n${caller} passed: `, ...params, 
							`\n\n but ${name} expected: `, pdefs.join(", ") );
						throw "Parameter Documentation Violation";
					}
				}
				const fitReport = fitsOutline( params[ i ], pdefs[ i ] );
				if( fitReport !== true ) {
					console.error( `${caller} passed these parameters to ${name}: `, ...params,
						`\n\nBut parameter ${i} violated ${name}'s parameter documentation:`, params[ i ],
						`"\n ${name} was expecting parameter ${i}, called ${pdefs[ i ].split(":")[0]},`,
						` to be a: ${pdefs[ i ].split(":")[1]}.\n`+
						`It did not fit because:\n${fitReport}`
					);
					throw "Parameter Documentation Violation";
				}
			}
		}
		else if( params.length ) {
			console.error( `${caller} passed these parameters to ${name}:`, ...params,
				`\nBut ${name} was not expecting any parameters at all.` );
			throw "Parameter Documentation Violation";
		}
	}
	/*
		usage: throwOnReturn( nameOfLimnary, returnValue, returnOutline )
		Throws an appropriate error if the value does not fit the outline.
	*/
	function throwOnReturn( name, value, rdef, caller, params ) {
		name = name.replace( /\//g, "." );
		if( rdef ) {
			let fitReport = fitsOutline( value, rdef );
			if( fitReport === true ) 
				return value;
			else { 
				console.error( `${name} returned a value violating its documentation.`,
					`\n${name} returned `, value, ", but it expected to return ", rdef,
					`\nThe return did not fit because:\n${fitReport}`,
					`\nThis happened when ${caller} passed these parameters (if any): `, ...params );
				throw "Return Value Documentation Violation";
			}
		}
		else if( value !== undefined ) {
			if( value instanceof Promise ||
				( typeof value === "object" && 
				value !== null &&
				typeof value.next === "function" ) ) {
					console.error( `${name} returned a promise unexpectedly: `,
						value, `\nAsync / promise functions must be declared with "isAsync:true".`
`
For example:

${LimnAlias}( "${name}", {
	...
	isAsync:true,
	...
	factory:() => {
		...
		return async (imports) => {
			...
		}
	}
} )

This promise was returned when ${caller} called ${name} using these parameters (if any): `, ...params
						);
					throw "Async Documentation Violation";
				}
			else {
				console.error( `${name} returned a defined value unexpectedly: `, value,
`\nAny module that returns something other than "undefined" must document its return type.

For example (if you are not sure what ${name} will be returning):

${LimnAlias}( "${name}", {
	...
	returns: "any",
	...
	factory:() => { ... }
} )

This happened when ${caller} called ${name} with these parameters (if any): `, ...params
					 );
				throw "Return Value Documentation Violation";
			}
		}
	}
	function throwOnEmit( name, eventName, detail, outline ) {
		name = name.replace( /\//g, "." );
		let jointTest = eventName.match( /\*/g );
		if( typeof eventName !== "string" ) {
			console.error( name, " tried to emit a non-string event ", eventName );
			throw "Inherent Emit Parameter Violation";
		}
		if( eventName.indexOf( "|" ) > -1 ) {
			console.error( name, " tried to emit a piped type ", eventName );
			throw "Inherent Emit Parameter Violation";
		}
		else if( jointTest && jointTest.length > 1 ) {
			console.error( name, " tried to emit a joint type ", eventName );
			throw "Inherent Emit Parameter Violation";
		}
		if( outlinesIntersect( eventName, outline ) === false ) {
			console.error( name, " tried to emit type ", eventName, " violating " +
				" its documentation ", outline );
			throw "Emit Documentation Violation";
		}
		const fitReport = fitsOutline( detail, eventName );
		if( fitReport !== true ) {
			console.error( name, " tried to emit detail ", detail, 
				" violating its declared emitting outline ", eventName,
				`\nThe detail did not fit the outline because:\n${fitReport}` );
			throw "Emit Documentation Violation";
		}
		else return true;
	}
	function throwOnListenerDefinition( name, def ) {
		name = name.replace( /\//g, "." );
		if( def.parameters ) {
			console.error( name, " tried to define a listener function " +
				" with parameters ", def.parameters );
			throw "Inherent Listener Definition Violation";
		}
		if( typeof def.listen !== "string" ) {
			console.error( "Tried to define listener ", name, " but value of \"listen\" is not a string.\n",
				"Listeners must listen to a defined type by referring to it by its name.\n",
				"For example: ... listen: \"MyTypes.Events.SomeEventObjectName*\"" );
			throw "Inherent Listener Definition Violation";
		}
		if( def.returns ) {
			console.error( name, " tried to define a listener with a return value ", def.returns, "\n",
				"Because listeners fire from inside the event loop and their return values are discarded, ",
				"they cannot specify a return type." );
			throw "Inherent Listener Definition Violation";
		}
		
		return true;
	}
	function throwOnReturnsDefinition( name, returns ) {
		let validity = isValidOutline( returns );
		if( validity !== true ) {
			console.error( `${name} tried to define return of an invalid outline reference:`,
				returns, "\n\n", validity );
			throw "Inherent Module Definition Error";
		}
		else if( typeof returns !== "string" ) {
			console.error( `${name} tried to define return of a non-primitive outline without using a reference:`,
				returns, "\nWhen defining a return, please use either a primitive, or define a named outline" +
				" and return that name.\n",
				"\nFor example, to return an array of numbers, please use:\n",
				`${globalName}.Outline( "myNumbersArray*", [ "number" ] )`,
				`\n...`,
				`\nreturns: "myNumbersArray*"`,
				);
			throw "Inherent Module Definition Error";
		}
		else return true;
	}
	function throwOnParametersDefinition( name, parameters ) {
		let i = 0;
		for( let p of parameters ) {
			let [ pName, ptype ] = p.split( ":" ),
				validity = isValidOutline( ptype );
			if( p.indexOf( ":" ) === -1 ) {
				console.error( name + " did not specify the type of parameter ", i, ", only the name: ", p );
				throw "Inherent Module Definition Error";
			}
			else if( validity !== true ) {
				console.error( `${name} tried to define parameter ${i}, named ${pName}, with an invalid outline reference:`,
					ptype, "\n\n", validity );
				throw "Inherent Module Definition Error";
			}
			else if( ( typeof ptype ) !== "string" ) {
				console.error( `${name} tried to define a parameter's type as a non-primitive outline without using a reference:`,
					ptype, "\nWhen defining a parameter's type, please either use a primitive, or define a named outline" +
					" and return that name.\n",
					"\nFor example, to accept an array of numbers as a parameter, please use:\n",
					`${LimnAlias}.Outline( "myNumbersArray*", [ "number" ] )`,
					`\n...`,
					`\nparameters: [ "numArr:myNumbersArray*" ]`,
					);
				throw "Inherent Module Definition Error";
			}
			++i;
		}
		return true;
	}
	function throwOnEmitsDefinition( name, emits ) {
		name = name.replace( /\//g, "." );
		if( typeof emits !== "string" ) {
			console.error( "Tried to define emitter ", name, " but value of \"emits\" is not a string.\n",
				"Emitters must emit one or more defined types by referring to them by name.\n",
				"For example: ... emits: \"MyTypes.Events.SomeEventObjectName*|Native.Events.Resize*\"\n",
				"Tried to emit: ", emits );
			throw "Inherent Emits Definition Violation";
		}
		else if( emits.indexOf( "*" ) === -1 ||
			emits.charAt( emits.length - 1 ) !== "*" ) {
			console.error( "Tried to define emitter ", name, " but value of \"emits\" is not a Limn type.\n",
				"Emitters must emit one or more defined types by referring to them by name.\n",
				"For example: ... emits: \"MyTypes.Events.SomeEventObjectName*|Native.Events.Resize*\"\n",
				"Type names must end with \"*\". Tried to emit: ", emits );
			throw "Inherent Emits Definition Violation";
		}
		else if( emits.match( /\|\|/ ) ) {
			console.error( "Tried to define emitter ", name, " with typo in \"emits\". It contains two ",
				"consecutive pipes: ", emits );
			throw "Inherent Emits Definition Violation";
		}
		else if( emits.match( /[^*]\|/g ) ) {
			let match = emits.match( /[^\|*]+\|/g );
			if( match.length === 1 ) {
				console.error( "Tried to define piped emitter ", name, " but value of \"emits\" contains",
					" something that is not a Limn type because it does not end in \"*\":\n",
					match[ 0 ].replace( "|", "" ), "\nFull text of emits: ", emits );
				throw "Inherent Emits Definition Violation";
			}
			else {
				let matches = [];
				for( let m of match ) matches.push( m.replace( "|", "" ) );
				if( emits.charAt( emits.length ) !== "*" )
					matches.push( emits.split( "|" ).pop().replace( "|", "" ) );
				console.error( "Tried to define piped emitter ", name, " but value of \"emits\" contains",
					" multiple entries that are not Limn types because they do not end in \"*\":\n",
					matches, "\nFull text of emits: ", emits );
				throw "Inherent Emits Definition Violation";
			}
		}
		else if( emits.indexOf( "()*" ) > -1 ) {
			console.error( name, " tried to define emission of a function type: ", emits, "\n",
				"Only object or primitive types may be emitted." );
			throw "Inherent Emits Definition Violation";
		}
		return true;
	}

	var privateCall = {},
		Limn;
	
	window[ LimnAlias ] = Limn = function( fullName, def, privateKeyOrDesc ) {
		let literalName = fullName;
		fullName = fullName.replace( /\//g, "." );
		LiteralNames[ fullName ] = literalName;

		//if limn, we're defining a new limnary
		if( def ) {
			let illegalMatches = fullName.match( illegalNameCharacters );
			if( illegalMatches ) {
				console.error( "Tried to define illegal characters in module name:", fullName, illegalMatches, "\n",
					"Module names may only contain letters, numbers, the underscore (\"_\"), and the dash (\"-\").\n",
					"Module names may also contain the forward slash (\"/\"), but it is used to indicate directory ",
					"structure. It will cause the Module's source to load from a different file location.\n",
					"Module names may also contain the period (\".\"), but it is interpreted as a group hierarchy ",
					"indicator, so \"Main.start\" will appear in the Explore() tree as \"start\", a sub-entry of \"Main\".\n" );
				throw "Inherent Module Definition Violation";
			}
			else if( fullName === "emit" ) {
				console.error( "Tried to define module \"emit\", but that name is reserved.\n",
					"Whenever a module declares itself to emit an event, it will be passed a special import ",
					"named \"emit\". Name a module \"emit\" would conflict with that built-in functionality." );
				throw "Inherent Module Definition Violation";
			}
			else {
				LimnaryDefinitions[ fullName ] = def;
				let url = ( limnDirectory || "" ) + "/" + literalName + ".js";
				urls[ fullName ] = url;

				if( outlinesPendingURL.length ) {
					for( let outline of outlinesPendingURL )
						urls[ outline ] = url;
					outlinesPendingURL.length = 0;
				}

				if( ! def.hasOwnProperty( "factory" ) ) {
					console.error( `"${fullName}" did not have a factory method named "factory".`,
						"\nEach module definition must include a factory method." );
						throw "Inherent Module Definition Violation";
				}

				//remove the global object
				let badAccessError = ( mod, d ) => {
					console.error( `Module "${fullName}" tried to access the global method `+
						`"${LimnAlias}()" from inside its factory code or from the module function returned by its factory code.` +
						( d ? "\nIt may have been trying to define a module. Each module must be defined in its own .js file." :
							( "\nIt may have been trying to import a module. Modules must be imported using the \"import\" property " + 
							" of the module importing them (see the example below)." ) ) +
						"\nPlease use factory code only for whatever setup can be done without access to other modules." +
						"\n(Because, when your factory code runs, other modules may not have loaded or run their factories yet.)" +
						"\nIf your code requires another module, please specify it under \"imports\", and use it from inside your " +
						"returned module function." +
						"\nThis is necessary in order to document each module's dependencies." +
( ( typeof mod === "string" && ! d ) ? 
`\nFor example, to access a module named "${mod}" while defining ${fullName} in ".../${fullName}.js":

${LimnAlias}( "${fullName}", {
	...
	imports: {
		...
		"aShortLocalName": "${mod}"
		...
	},
	...
	factory: function() {
		...
		return function( imports ) {
			...
			var aShortLocalName = imports[ "${mod}" ];
			/*aShortLocalName now holds the module function built by "${mod}"'s factory*/
			...
			var resultINeed = aShortLocalName( "Some info or something" );
		}
	}
})` : "" ) );
					throw `Bad "${LimnAlias}()" Scope Access`;
				};

				badAccessError.Outline = ( name, def ) => {
					console.error(
						`Module "${fullName}" tried to access the global method `+
						`"${LimnAlias}.Outline()" for the outline ${name} from inside its factory code or from the module function ` +
							`returned by its factory code.` +
						( (!!def) ? 
							( "\nIt may have been trying to define an outline. Outlines must be defined outside of factory code." ) : 
							( "\nIt may have been trying access an outline's description for debugging." +
							"\nAll outline descriptions are available in the code explorer. Please view them there." ) 
						) +
						`\n${LimnAlias}.Outline() is not available in factory or module code, because outline functionality` +
						` only exists during development. Factory and module code must compile to a stand-alone library` +
						` that is not dependent on LimnJS's outline features.`
					);

					throw `Bad "${LimnAlias}.Outline()" Scope Access`;
				}

				badAccessError.source = true;

				const passLimns = {};

				if( def.returns ) {
					throwOnReturnsDefinition( fullName, def.returns );
				}
				if( def.listens ) {
					throwOnListenerDefinition( fullName, def );
				}
				if( def.returns && typeof def.returns !== "string" ) {
					console.error( `Tried to define module ${fullName} returning a non-primitive, non-outline:`,
						def.returns, "\nTo specify a non-primitive return type, please define its outline ",
						"and then return that outline.",
						"\nFor example: ... returns:{a:\"string\",b:\"string\"}",
						"\nWould instead become:\n",
						`${LimnAlias}.Outline( \"myType*\", {a:\"string\",b:\"string\"} )\n`,
						"...returns:\"myType*\"");
					throw "Inherent Module Definition Error";
				}
				if( def.parameters ) {
					throwOnParametersDefinition( fullName, def.parameters );
				}
	
				if( def.emits &&
					throwOnEmitsDefinition( name, def.emits ) === true ) {
					passLimns.emit = async ( emitted, detail ) => {
						if( throwOnEmit( fullName, emitted, detail, def.emits ) === true ) {
							let allPromises = [];
							if( ! listeners[ emitted ] ) {
								console.error(
									`Performance Warning: "${fullName}" fired event "${emitted}", which has no listeners.`
								)
							}
							else {
								for( let l of listeners[ emitted ] ) {
									let possiblePromise = l( emitted, detail );
									if( possiblePromise && (
										possiblePromise instanceof Promise ||
										( typeof possiblePromise.then === "function" )
									) ) allPromises.push( possiblePromise );
								}
								await Promise.all( allPromises );
								return;
							}
						}
					}
				}

				if( def.imports &&
					Object.keys( def.imports ).length > 0 ) {
					//validate all so we don't try to load something malformed
					for( let localName in def.imports ) {
						let realLimnaryName = def.imports[ localName ],
							illegalMatch = realLimnaryName.match( illegalNameCharacters );
						if( illegalMatch ) {
							console.error( `${fullName} tried to import module ${realLimnaryName} `,
								"with illegal characters in its name: ", illegalMatch,
								" under the local name ", localName );
							throw "Inherent Module Definition Error";
						}
					}
					for( let localName in def.imports ) {
						let literalLimnaryName = def.imports[ localName ],
							realLimnaryName = literalLimnaryName.replace( /\//g, "." );
						Limn( literalLimnaryName, false, privateCall )
							.then( limn => {
								passLimns[ localName ] = limn;
								const passDef = LimnaryDefinitions[ realLimnaryName ],
									passMethod = LimnaryMethods[ realLimnaryName ],
									passPasses = LimnaryPassables[ realLimnaryName ],
									callerName = fullName;
								if( passDef.isAsync ) {
									passLimns[ localName ] = new Proxy( passMethod, {
										apply: async ( target, thisArg, params ) => {
											throwOnParameters( realLimnaryName, params, passDef, callerName );
											let value;
											try { value = await passMethod.apply( thisArg, params );
											} catch( e ) {
												console.error( `${realLimnaryName} threw an error when called by ${callerName}.` );
												throw e;
											}
											return throwOnReturn( realLimnaryName, value, passDef.returns, callerName, params );
										}
									} );
								}
								else {
									passLimns[ localName ] = new Proxy( passMethod, {
										apply: ( target, thisArg, params ) => {
											throwOnParameters( realLimnaryName, params, passDef, callerName );
											let value;
											try { value = passMethod.apply( thisArg, params );
											} catch( e ) {
												console.error( `${realLimnaryName} threw an error when called by ${callerName}.` );
												throw e;
											}
											return throwOnReturn( realLimnaryName, value, passDef.returns, callerName, params );
										}
									} );
								}
							} );
					}
				}

				const logProxy = ( ...logs ) => {
						console.log( `${fullName} is logging to the console:` );
						console.log( ...logs );
					},
					errorProxy = ( ...errors ) => {
						console.error( `${fullName} is erroring to the console:` );
						console.error( ...errors );
					},
					consoleProxy = new Proxy( console, {
						get( target, getting ) {
							if( getting === "log" ) return logProxy;
							else if( getting === "error" ) return errorProxy;
							else return target[ log ];
						}
					} ),
					code = `"use strict";
						return (\n` + 
						def.factory.toLocaleString() + 
					`\n)();`,
					compiled = Function( LimnAlias, "imports", "console", code ),
					method = compiled( badAccessError, passLimns, consoleProxy );
					
				if( typeof method !== "function" ) {
					if( method instanceof Promise ||
						( typeof method.next ) === "function" ) {
							console.error( `${fullName}'s factory returned a Promise instead of a function.` +
								"\nFactory methods must always be synchronous." +
								"\nIf you need to do something asynchronously, such as fetch from a server, " +
								"please do so inside the module function returned by factory()." )
							throw "Inherent Module Definition Violation";
						}
					else {
						console.error( `${fullName}'s factory did not return a function.` +
							"\nInstead it returned: ", method,
							"\nModule factories must always return a function." );
						throw "Inherent Module Definition Violation";
					}
				}
	
				LimnaryMethods[ fullName ] = method;
				LimnaryPassables[ fullName ] = passLimns;
				if( typeof privateKeyOrDesc === "string" )
					LimnaryDescriptions[ fullName ] = privateKeyOrDesc;

				if( def.isAsync ) {
					const callerName = "External Code";
					Limnaries[ fullName ] = new Proxy( method, {
						apply: async ( target, thisArg, params ) => {
							throwOnParameters( fullName, params, def, callerName );
							let value;
							try { value = await method.apply( thisArg, params );
							} catch( e ) {
								console.error( `${fullName} threw an error when called by ${callerName}.` );
								throw e;
							}
							return throwOnReturn( fullName, value, def.returns, callerName, params );
						}
					} )
				}
				else {
					const callerName = "External Code";
					Limnaries[ fullName ] = new Proxy( method, {
						apply: ( target, thisArg, params ) => {
							throwOnParameters( fullName, params, def, callerName );
							let value;
							try { value = method.apply( thisArg, params );
							} catch( e ) {
								console.error( `${fullName} threw an error when called by ${callerName}.` );
								throw e;
							}
							return throwOnReturn( fullName, value, def.returns, callerName, params );
						}
					} );
				}

				if( def.listen ) {
					let listens = def.listen.indexOf( "|" ) > -1 ?
						def.listen.split( "|" ) : [ def.listen ];
					for( let l of listens ) {
						listeners[ l ] = listeners[ l ] || [];
						listeners[ l ].push( Limnaries[ fullName ] );
					}
				}


				Limnaries[ fullName ].fullName = fullName;
	
				acknowledgeLimnaryParse( fullName, Limnaries[ fullName ] );
				
				//we return a master promise 
				return waitForAllReady( fullName );
			}
		}
		//otherwise, we're fetching a limnary method (always a function)
		else {
			let limnMethod =  Limnaries[ fullName ];

			if( ! limnMethod &&
				privateKeyOrDesc === privateCall )
				return waitForLimnary( fullName );
			else return waitForAllReady( fullName );
		}
	}

	window[ LimnAlias ].Include = function( nameOrNames ) {
		if( Array.isArray( nameOrNames ) ) {
			let names = nameOrNames;
			for( let name of names )
				Limn( name );
		}
		else Limn( nameOrNames );
	}

	var outlineTypes = {
		//js primitives
		primitives: {
			"string":true,
			"number":true,
			"boolean":true,
			"function":true,
			"bigint":true,
			"symbol":true,
			"undefined":true,
			"object":true
		},
		//well-defined objects
		objects: {
			Uint8ClampedArray,
			Uint8Array,
			Uint16Array,
			Uint32Array,
			Int8Array,
			Int16Array,
			Int32Array,
			BigInt64Array,
			BigUint64Array,
			Float32Array,
			Float64Array
		}
	}
	
	function isValidOutline( outline ) {
		//reference to: primitive, union, intersection, or outline
		if( typeof outline === "string" ) {
			outline = outline.
				replace( /\//gm, "." ).
				replace( /[\s\r\n]+/gm, "" ).
				replace( /^[|&]+/m, "" ).
				replace( /[|&]+$/m, "" ).
				replace( /\:[|&]+/m, ":" );
			let illegalOutlines = outline.match( illegalOutlineCharacters ),
				illegalLimns = outline.match( illegalNameCharacters );
			if( illegalOutlines && illegalLimns ) 
				return `The outline string ${outline} did not refer to a primitive, ` +
					"an array-like Javascript object, or the \"any\" keyword.\n" +
					"The following javascript primitives can be used as types in LimnJS: \n" +
					Object.keys( outlineTypes.primitives ).concat( ["null","NaN"] ).join( "\n" ) +
					"\nNote that in LimnJS, \"null\" is treated like a unique primitive, although in " +
					"pure JS it is an \"object\"." +
					"\nNote that in LimnJS, \"NaN\" is treated like a unique primitive, although in " +
					"pure JS it is a \"number\"." +
					"\nThe following array-like Javascript objects can also " +
					"be treated as types: \n" +
					[ "Array" ].concat( Object.keys( outlineTypes.objects ) ).join( "\n" ) +
					"\nHowever, these array-likes are, in fact, objects." +
					"\nAn outline \"object\" will fit all of the array-likes above, but an " +
					"outline \"Array\" will only fit a pure JavaScript array." +
					"\nFor any other built-in Javascript object, please use the \"object\" type." +
					"\nFor example, Blobs, Images, ArrayBuffers, WeakMaps, Sets, and Maps may all be referred to as \"object\"s, or " +
					"\n, if you like, you may define an outline listing their methods you intend to use.";
			else if( outline.indexOf( "&" ) > -1 &&
				outline.indexOf( "|" ) > -1 ) {
					return `Outlines may not mix intersections and unions. Tried to mix: ${outline}`
				}
			else return true;
		}
		//pure check
		else if( typeof outline === "function" )
			return true;
		//array template
		else if( Array.isArray( outline ) === true ) {
			//for( let entry of outline ) {
			for( let i = 0; i < outline.length; i ++ ) {
				let entry = outline[ i ];
				//etcetera operation ("...") allowed only on last entry
				if( outline.length > 1 &&
					i === outline.length - 1 && 
					entry === "..." ) continue;
				let validity = isValidOutline( entry );
				if( validity !== true )
					return validity;
				else if( typeof outline[ i ] === "string" ) {
					outline[ i ] = outline[ i ].
						replace( /\//gm, "." ).
						replace( /[\s\r\n]+/gm, "" ).
						replace( /^[|&]+/m, "" ).
						replace( /[|&]+$/m, "" ).
						replace( /\:[|&]+/m, ":" )
				}
			}
			return true;
		}
		//object template
		else if( typeof outline === "object" ) {
			let keys = Object.keys( outline );
			//empty object allowed (for passing unique private keys)
			if( keys.length === 0 ) return true;
			for( let key of keys ) {
				let validity = isValidOutline( outline[ key ] );
				if( validity !== true )
					return validity;
				else if( typeof outline[ key ] === "string" ) {
					outline[ key ] = outline[ key ].
						replace( /\//gm, "." ).
						replace( /[\s\r\n]+/gm, "" ).
						replace( /^[|&]+/m, "" ).
						replace( /[|&]+$/m, "" ).
						replace( /\:[|&]+/m, ":" )
				}
			}
			return true;
		}
		else return "The outline was invalid. Please see the documentation for creating outlines.";
	}

	function outlinesIntersect( A, B ) {
		A = A.replace( /\//g, "." );
		B = B.replace( /\//g, "." );
		if( A.indexOf( "|" ) ) A = A.split( "|" );
		else A = [ A ];
		if( B.indexOf( "|" ) ) B = B.split( "|" );
		else B = [ B ];
		for( let a of A ) {
			for( let b of B ) {
				if( a === b ) return true;
			}
		}
		return false;
	}

	function getLexicalOutlines( outline, set ) {
		if( ! set ) set = new Set();

		if( set.has( outline ) ) return set;

		if( outline.indexOf( "&" ) > -1 )
			return false;
		else if( outline.indexOf( "|" ) > -1 ) {
			for( let t of outline.split( "|" ) )
				getLexicalOutlines( t, set );
		}
		else if( outline.indexOf( "*" ) > -1 ) {
			set.add( outline );
			let o = outlines[ outline ];
			if( typeof o === "string" )
				getLexicalOutlines( o, set );
		}
		return set;
	}

	/*
	mystery and outline must both be strings
	Check for lexical equality.
	Meaning: "type1*" might be a "string",
	And "type2*" might be a "string",
	but they are not lexically equal, only
	functionally.
	*/
	function isLexicalOutline( mystery, outline, history ) {
		if( typeof outline !== "string" ||
			typeof mystery !== "string" )
			return false;

		if( ! history ) history = {};
		if( mystery in history ) return false;
		else history[ mystery ] = true;

		if( mystery === outline ) return true;
		else if( mystery.indexOf( "|" ) > -1 ) {
			const unions = mystery.split( "|" );
			for( let u of unions )
				if( isLexicalOutline( u, outline, history ) )
					return true;
			return false;
		}
		else if( mystery.indexOf( "*" ) > -1 ) {
			let o = outlines[ outline ];
			if( isLexicalOutline( o, outline, history ) )
				return true;
			else return false;
		}
	}

	function isUnset( outline, history ) {
		if( ! history ) history = {};
		if( typeof outline === "string" ) {
			if( outline in history ) return false;
			else history[ outline ] = true;

			if( outline === "unset" ) return true;
			else if( outline.indexOf( "|" ) > -1 ) {
				const unions = outline.split( "|" );
				for( let u of unions )
					if( isUnset( u ) ) return true;
				return false;
			}
			else if( outline.indexOf( "*" ) > -1 ) {
				let o = outlines[ outline ];
				if( isUnset( o ) ) return true;
				else return false;
			}
		}
		else return false;
	}

	function isIdentity( outline, history ) {
		if( ! history ) history = {};
		if( typeof outline === "string" &&
			outline.indexOf( "*" ) > -1 ) {
			if( outline.indexOf( "|" ) > -1 ) {
				for( let o of outline.split( "|" ) ) {
					if( isIdentity( o, history ) )
						return true;
				}
				return false;
			}
			else {
				if( history[ outline ] ) return true;
				else {
					history[ outline ] = true;
					if( outlines[ outline ] &&
						isIdentity( outlines[ outline ], history ) )
						return true;
					else return false;
				}
			}
		}
		else return false;
	}

	const O = {
		types: {
			"any": () => true,
			"array": a => Array.isArray( a ),
			"bigint": b => typeof b === "bigint",
			"boolean": b => typeof b === "boolean",
			"function": f => typeof f === "function",
			"infinity":  n => ( 
					typeof n === "number" && 
					( n === Infinity ||
					n === -Infinity )
				),
			"NaN": n => ( 
					typeof n === "number" && 
					isNaN( n ) 
				),
			"never": () => false,
			"null": n => n === null,
			"number": n => ( 
					typeof n === "number" && 
					( ! isNaN( n ) ) &&
					n !== Infinity &&
					n !== -Infinity
				),
			"object": o => ( 
					typeof o === "object" && 
					o !== null && 
					! Array.isArray( o ) 
				),
			"string": s => ( typeof s === "string" ),
			"symbol": s => ( typeof s === "symbol" ),
			"undefined": u => ( typeof u === "undefined" ),
			"unset": () => false, //handled by logic

			"BigInt64Array": n => n instanceof BigInt64Array,
			"BigUint64Array": n => n instanceof BigUint64Array,
			"Float32Array": n => n instanceof Float32Array,
			"Float64Array": n => n instanceof Float64Array,
			"Int8Array": n => n instanceof Int8Array,
			"Int16Array": n => n instanceof Int16Array,
			"Int32Array": n => n instanceof Int32Array,
			"Uint8Array": n => n instanceof Uint8Array,
			"Uint8ClampedArray": n => n instanceof Uint8ClampedArray,
			"Uint16Array": n => n instanceof Uint16Array,
			"Uint32Array": n => n instanceof Uint32Array,
		}
	}

	const fitTerminators = {
		//TODO: After debug, swap these out for makeFitHistory( check ) calls.
		makeTargetFitHistory: () => {
			var targetFitHistoryByType = {
				"object": new WeakMap(),
				"boolean": {
					"true": fitTerminators.makeOutlineFitHistory(),
					"false": fitTerminators.makeOutlineFitHistory()
				},
				"NaN":  fitTerminators.makeOutlineFitHistory(),
				"null":  fitTerminators.makeOutlineFitHistory(),
				"number": {},
				"bigint": {},
				"stringSymbol": {},
				"undefined":  fitTerminators.makeOutlineFitHistory(),
			}
			return targetFitHistoryByType;
		},
		makeOutlineFitHistory: () => {
			var outlineFitHistoryByType = {
				"object": new WeakMap(),
				"boolean": {
					"true": fitTerminators.makeFitCheck(),
					"false": fitTerminators.makeFitCheck(),
				},
				"NaN": fitTerminators.makeFitCheck(),
				"null": fitTerminators.makeFitCheck(),
				"number": {},
				"bigint": {},
				"stringSymbol": {},
				"undefined": fitTerminators.makeFitCheck(),
			}
			return outlineFitHistoryByType;
		},
		makeFitCheck: () => { return { checked: false } },
		/*
		makeFitHistory: ( makeFitCheck ) => {
			var fitHistory = {
				"object": new WeakMap(),
				"boolean": {
					"true": makeFitCheck(),
					"false": makeFitCheck(),
				},
				"NaN": makeFitCheck(),
				"null": makeFitCheck(),
				"number": {},
				"bigint": {},
				"stringSymbol": {},
				"undefined": makeFitCheck(),
			}
			return fitHistory;
		},
		*/
		getOutlineFitCheck: ( outline, fitHistories ) => {
			if( outline === null )
				return fitHistories[ "null" ];
			else if( outline === undefined )
				return fitHistories[ "undefined" ];
			else if( typeof outline === "boolean" )
				return fitHistories[ "boolean" ][ outline ];
			else if( typeof outline === "number" ) {
				if( isNaN( outline ) )
					return fitHistories[ "NaN" ];
				else {
					let fitHistory = fitHistories[ "number" ][ outline ];
					if( ! fitHistory ) {
						fitHistory = fitHistories[ "number" ][ outline ] =
							fitTerminators.makeFitCheck();
					}
					return fitHistory;
				}
			}
			else if( typeof outline === "bigint" )
				return fitHistories[ "bigint" ][ outline ];
			else if( typeof outline === "string" ||
				typeof outline === "symbol" ) {
				let fitHistory = fitHistories[ "stringSymbol" ][ outline ];
				if( ! fitHistory ) {
					fitHistory = fitHistories[ "stringSymbol" ][ outline ] =
						fitTerminators.makeFitCheck();
				}
				return fitHistory;
			}
			else if( typeof outline === "object" ||
				typeof outline === "function" ) {
				let fitHistory = fitHistories[ "object" ].get( outline );
				if( ! fitHistory ) {
					fitHistory = fitTerminators.makeFitCheck();
					fitHistories[ "object" ].set( outline, fitHistory );
				}
				return fitHistory;
			}
		},
		getTargetFitHistory( target, fitHistories ) {
			if( target === null )
				return fitHistories[ "null" ];
			else if( target === undefined )
				return fitHistories[ "undefined" ];
			else if( typeof target === "boolean" )
				return fitHistories[ "boolean" ][ target ];
			else if( typeof target === "number" ) {
				if( isNaN( target ) )
					return fitHistories[ "NaN" ];
				else {
					let fitHistory = fitHistories[ "number" ][ target ];
					if( ! fitHistory ) {
						fitHistory = fitHistories[ "number" ][ target ] =
							fitTerminators.makeOutlineFitHistory();
					}
					return fitHistory;
				}
			}
			else if( typeof target === "bigint" )
				return fitHistories[ "bigint" ][ target ];
			else if( typeof target === "string" ||
				typeof target === "symbol" ) {
				let fitHistory = fitHistories[ "stringSymbol" ][ target ];
				if( ! fitHistory ) {
					fitHistory = fitHistories[ "stringSymbol" ][ target ] =
						fitTerminators.makeOutlineFitHistory();
				}
				return fitHistory;
			}
			else if( typeof target === "object" ||
				typeof target === "function" ) {
				let fitHistory = fitHistories[ "object" ].get( target );
				if( ! fitHistory ) {
					fitHistory = fitTerminators.makeOutlineFitHistory();
					fitHistories[ "object" ].set( target, fitHistory );
				}
				return fitHistory;
			}
		}
	}

	function stringify( thing, ignore ) {
		if( ! ignore ) ignore = new Set();

		if( typeof thing === "object" ) {
			if( ignore.has( thing ) )
				return "...";
			else ignore.add( thing );
		}

		if( typeof thing === "function" )
			return thing.toLocaleString();
		else if( typeof thing === "string" )
			return `'${thing}'`;
		else if( typeof thing === "object" ) {
			let s = "{";
			for( let k in thing )
				s += `'${k}':${stringify(thing[k],ignore)},`;
			if( s.charAt( s.length-1 ) === "," )
				s = s.substring( 0, s.length-1 );
			s += "}";
			return s;
		}
		else if( typeof thing === "array" ) {
			let s = "["
			for( let e of thing )
				s += stringify(e,ignore) + ",";
			if( s.charAt( s.length-1 ) === "," )
				s = s.substring( 0, s.length-1 );
			s += "]";
			return s;
		}
		else return thing.toString();
	}

	function fitsOutline( target, outline, fitHistories ) {
		if( ! fitHistories ) fitHistories = fitTerminators.makeTargetFitHistory();
		const targetFitHistory = fitTerminators.getTargetFitHistory( target, fitHistories );
		const fitCheck = fitTerminators.getOutlineFitCheck( outline, targetFitHistory );

		if( fitCheck.checked === true ) return true;
		else fitCheck.checked = true;
		
		const targetString = target + "",
			outlineString = stringify( outline );

		//reference to: primitive, union, intersection, or outline
		if( typeof outline === "string" ) {
			outline = outline.
					split( ":" ).pop().
					replace( /\//gm, "." ).
					replace( /"/gm, "" ).
					replace( /[\s\r\n]+/gm, "" ).
					replace( /^[|&]+/m, "" ).
					replace( /[|&]+$/m, "" );
			//reference to primitive
			if( outline in O.types ) {
				const fit = O.types[ outline ]( target );
				if( fit ) return true;
				else return ` ${targetString} is not a primitive "${outline}".\n`;
			}
			//reference to union
			else if( outline.indexOf( "|" ) > -1 ) {
				let checkedOutlines = {},
					report = "";
				for( let o of outline.split( "|" ) ) {
					//re-checking the same outline will return true
					//	due to recursion history testing
					if( checkedOutlines[ o ] ) continue;
					checkedOutlines[ o ] = true;
					const rep = fitsOutline( target, o, fitHistories );
					if( rep === true )
						return true;
					else report += ` ${targetString} is not a "${o}" because:\n${rep}`;
				}
				return report + "\n";
			}
			//reference to intersection
			else if( outline.indexOf( "&" ) > -1 ) {
				let checkedOutlines = {};
				for( let o of outline.split( "&" ) ) {
					//re-checking the same outline will return true
					//	due to recursion history testing
					//	not a problem here, but why be wasteful?
					if( checkedOutlines[ o ] ) continue;
					checkedOutlines[ o ] = true;
					const rep = fitsOutline( target, o, fitHistories );
					if( rep !== true ) {
						return ` ${targetString} is not a "${o}" because:\n${rep}\n`;
					}
				}
				return true;
			}
			//reference to function outline
			else if( outline.length > 3 && 
				outline.indexOf( "()*" ) > -1 ) {
				const rep = O.types[ "function" ]( target );
				if( rep ) return true;
				else return ` ${targetString} is not a "function" to fit "${outline}".\n`
			}
			//reference to outline
			else if( outline.indexOf( "*" ) > -1 ) {
				//reference to outline
				if( outline in outlines ) {
					const rep = fitsOutline( target, outlines[ outline ], fitHistories );
					if( rep === true ) return true;
					else return ` ${targetString} is not a "${outline}" because:\n${rep}\n`
				}
				else return ` ${targetString} referenced undefined outline "${outline}".\n`;
			}
		}
		//pure check (primitive check)
		else if( typeof outline === "function" ) {
			const fit = !! outline( target );
			if( fit ) return true;
			else return ` ${targetString} does not fit the custom primitive: ${outlineString}.`;
		}
		//array template
		else if( Array.isArray( outline ) ) {
			if( ! Array.isArray( target ) ) 
				return ` ${targetString} is not an "array".\n`;
			if( outline[ outline.length - 1 ] === "..." ) {
				if( target.length > 0 &&
					( target.length % 
					( outline.length - 1 ) 
					) !== 0 )
						return ` ${targetString} had the wrong number of entries to fit "${outlineString}". Needed multiple of ${outline.length} but had ${target.length}.\n`;
				else {
					for( let i=0; i<target.length; i++ ) {
						const rep = fitsOutline( 
								target[ i ], 
								outline[ i % ( outline.length - 1 ) ],
								fitHistories
							)
						if( rep !== true ) {
							const outlineString = stringify(outline[ i % ( outline.length - 1 ) ]);
							return ` in ${targetString}, entry ${i} did not fit outline entry ${i % ( outline.length - 1 )}: "${outlineString}" because:\n${rep}\n`;
						}
					}
					return true;
				}
			}
			else {
				if( target.length !== outline.length ) {
					let unsetting = false;
					for( let o of outline )
						if( isUnset( o ) ) {
							unsetting = true;
							break;
						}
					if( unsetting === false ) {
						return ` ${targetString} had the wrong number of entries to fit "${outlineString}". Needed ${outline.length} but had ${target.length}.\n`;
					}
				}
				for( let i=0; i<outline.length; i++ ) {
					const outlineString = stringify( outline[ i ] );
					if( i === target.length ) {
						if( isUnset( outline[ i ] ) )
							break;
						else {
							return ` ${targetString} ended at entry ${i}, which is not defined as "unset" in outline entry ${i}: "${outlineString}".\n`;
						}
					}
					else {
						const rep = fitsOutline(
							target[ i ],
							outline[ i ],
							fitHistories
						)
						if( rep !== true ) {
							return ` in ${targetString}, entry ${i} did not fit outline entry ${i}: "${outlineString}" because:\n${rep}\n`;
						}
					}
				}
				return true;
			}
		}
		//documented function outline
		else if( FunctionOutlines.get( outline ) !== undefined ) {
			if( typeof target === "function" )
				return true;
			else return ` ${targetString} is not a "function" to fit "${outlineString}".\n`;
		}
		//object template
		else if( typeof outline === "object" ) {
			//cannot call keys on non-object or null
			if( typeof target !== "object" )
				return ` ${targetString} is not an "object" to fit "${outlineString}".\n`;
			else if( target === null ) 
				return ` ${targetString} is "null", not an "object" to fit "${outlineString}".\n`;
			else {
				let outlineKeys = Object.keys( outline );
				for( let key of outlineKeys ) {
					const outlineString = stringify( outline[ key ] );
					if( !( key in target ) ) {
						if( isUnset( outline[ key ] ) )
							continue;
						else {
							return ` in ${targetString}, required property "${key}" is missing but should have been "${outlineString}".\n`;
						}
					}
					else {
						const rep = fitsOutline(
								target[ key ], 
								outline[ key ],
								fitHistories
							)
						if( rep !== true  ) {
							return ` in ${targetString}, property "${key}" did not fit "${outlineString}" because:\n${rep}\n`;
						}
					}
				}
				return true;
			}
		}
		else return ` Could not test ${targetString} at all, because outline "${outlineString}" was not a string, array, function, or object.`;
	}

	function testFitsOutline() {
		var tests = {
				//any
				"array": [],
				"boolean": true,
				"bigint": BigInt(3),
				"function": ()=>{},
				"NaN": NaN,
				//never
				"null": null,
				"number": 7,
				"object": {},
				"string": "hithere",
				"symbol": Symbol.for(3),
				"undefined": undefined,

				"Uint8ClampedArray": new Uint8ClampedArray(),
				"Uint8Array": new Uint8Array(),
				"Uint16Array": new Uint16Array(),
				"Uint32Array": new Uint32Array(),
				"Int8Array": new Int8Array(),
				"Int16Array": new Int16Array(),
				"Int32Array": new Int32Array(),
				"BigInt64Array": new BigInt64Array(),
				"BigUint64Array": new BigUint64Array(),
				"Float32Array": new Float32Array(),
				"Float64Array": new Float64Array()
			},
			isAlsoObject = {
				"Uint8ClampedArray": true,
				"Uint8Array": true,
				"Uint16Array": true,
				"Uint32Array": true,
				"Int8Array": true,
				"Int16Array": true,
				"Int32Array": true,
				"BigInt64Array": true,
				"BigUint64Array": true,
				"Float32Array": true,
				"Float64Array": true
			};

		//test true fits
		for( let t in tests ) {
			let got = fitsOutline( tests[ t ], t );
			if( got !== true ) {
				console.error( tests[ t ], " failed to fit ", t,
					`because:\n${got}\n` );
			}
			const fitsAny = fitsOutline( tests[ t ], "any" );
			if( fitsAny !== true )
				console.error( tests[ t ], 
					" (from test ", t, ") failed to fit \"any\" because: ", 
					fitsAny );
			const fitsNever = fitsOutline( tests[ t ], "never" );
			if( fitsNever === true )
				console.error( tests[ t ], " (from test ", t, ") fit \"never\"." );
		}

		//test custom fit
		for( let t in tests ) {
			let customName = `customFit-${t}*`,
				customName2 = `customFit-${t}-proxy*`;
			Limn.Outline( customName, t );
			Limn.Outline( customName2, customName );
			let got = fitsOutline( tests[ t ], customName );
			if( got !== true ) {
				console.error( 
					tests[ t ], 
					" failed to fit ", 
					customName,
					`because:\n${got}\n` );
			}
			let got2 = fitsOutline( tests[ t ], customName2 );
			if( got2 !== true ) {
				console.error( 
					tests[ t ], 
					" failed to fit proxy ", 
					customName2,
					`because:\n${got2}\n`
				);
			}
		}

		//test wrong fits
		for( let t in tests ) {
			for( let tt in tests ) {
				if( tt === t ) continue;
				else if( t === "object" &&
					 isAlsoObject.hasOwnProperty( tt ) )
					 continue;
				else {
					let badFitTest = fitsOutline( tests[ tt ], t );
					if( badFitTest === true ) {
						console.error( tests[ tt ], " mistakenly fit ", t );
					}
					let badArrayFitTest = fitsOutline( [ tests[ tt ] ], [ t ] );
					if( badArrayFitTest === true ) {
						console.error( 
							"When enclosed in an array, ", tests[ tt ], 
							" mistakenly fit ", t, "also enclosed in an array." );
					}
					let badValueFitTest = fitsOutline( { "prop": tests[ tt ] }, { "prop": t } );
					if( badValueFitTest === true ) {
						console.error( 
							"When assigned as an object property, ", 
							tests[ tt ], " mistakenly fit ", t,
							"also assigned as an object property of the same name." );
					}
					let badValueArrayFitTest = fitsOutline( { "prop": [ tests[ tt ] ] }, { "prop": [ t ] } );
					if( badValueArrayFitTest === true ) {
						console.error( 
							"When enclosed in an array and assigned as an object property, ", 
							tests[ tt ], " mistakenly fit ", t,
							"also enclosed in an array and assigned as an object property of the same name." );
					}
					let badValueFitTest2 = fitsOutline( { "prop": tests[ tt ] }, { "prop2": t } );
					if( badValueFitTest2 === true ) {
						console.error( 
							"When assigned as an object property, ", 
							tests[ tt ], " mistakenly fit ", t,
							"assigned as an object property of a different name." );
					}
					let badValueArrayFitTest2 = fitsOutline( { "prop": [ tests[ tt ] ] }, { "prop2": [ t ] } );
					if( badValueArrayFitTest2 === true ) {
						console.error( 
							"When enclosed in an array and assigned as an object property, ", 
							tests[ tt ], " mistakenly fit ", t,
							"also enclosed in an array and assigned as an object property of a different name." );
					}
				}
			}
		}
		
		console.log( "Finished testing fitsOutline. Any out-of-spec behavior has been logged to the console.\n",
			"An absence of error messages in the console indicates that fitsOutline's behavior is in-spec for all possible outlines." );
	}

	/*
		Bear in mind that mixBintoA will ONLY work on valid outlines.
			it will utterly fail if a property ends in anything other than:
			1. an array of valid outlines
			2. an object with string keys pairing to valid outlines
			3. a string
		For example, mixBintoA( { "a":"string" }, { "b":[7] } )
			will fail spectacularly. ()
		At the top-level (very first call to mixBintoA), both outlines
			must be object-type outlines.
	*/
	function mixBintoA( a, b ) {
		if( Array.isArray( b ) === true ) {
			//if b is an array, a is guaranteed to be an empty array.
			a.length = 0;
			for( let i=0; i<b.length; i++ ) {
				if( typeof b[ i ] === "string" )
					a[ i ] = b[ i ];
				//if b[i] is not string, must be array or object:
				else {
					//we have to define a[i], since we cleared a
					if( Array.isArray( b[ i ] ) ) a[ i ] = [];
					else a[ i ] = {};
					mixBintoA( a[ i ], b[ i ] );
				}
			}
		}
		else {
			for( let k in b ) {
				if( typeof b[ k ] === "string" )
					a[ k ] = b[ k ];
				else {
					//if b[k] is not a string, must be array or object
					if( Array.isArray( b[ k ] ) === true )
						a[ k ] = [];
					else {
						if( Array.isArray( a[ k ] ) === true ) a[ k ] = {};
						else if( typeof a[ k ] !== "object" ) a[ k ] = {};
					}
					mixBintoA( a[ k ], b[ k ] );
				}
			}
		}
	}

	var methodOutlineKey = {};
	function getOutline( name ) {
		name = name.
			replace( /\//gm, "." ).
			replace( /[\s\r\n]+/gm, "" ).
			replace( /^[|&]+/m, "" ).
			replace( /[|&]+$/m, "" ).
			replace( /\:[|&]+/m, ":" );
		if( outlines.hasOwnProperty( name ) ) {
			const out = outlines[ name ];
			if( typeof out === "function" ) return "primitive";
			else return out;
		}
		else {
			//might be name of a method
			if( name.indexOf( "*" ) === -1 ) {
				//might also be referring from a parameter
				let refName = ( name.indexOf( ":" ) > -1 ) ?
						name.split( ":" )[ 1 ] : name;
				if( Limnaries.hasOwnProperty( refName ) ) {
					return {
						methodOutlineKey,
						refName
					};
				}
				else if( O.types.hasOwnProperty( refName ) )
					return refName;
				else if( refName === "object" )
					return refName;
				return false; //malformed outline or undefined name
			}
			else {
				//TODO: Rework outline intersections to use & instead of just chaining *
				//might be first-time lookup of joined outline
				let names = name.split( "*" );
				if( names.length === 2 ) {
					if( names[ 1 ].length === 0 ) {
						if( names[ 0 ].indexOf( ":" ) > -1 ) {
							let curtName = names[ 0 ].split( ":" )[ 1 ] + "*";
							if( outlines.hasOwnProperty( curtName ) === true )  {
								return outlines[ curtName ];
							}
							else return false; //it's just an undefined outline.
						}
						else return false; //it's just an undefined outline.
					}
					else return false; //it's a malformed outline join (missing *)
				}
				else {
					let def = {};
					for( let i=0; i<names.length-1; i++ ) {
						let n = names[ i ];
						if( n.indexOf( ":" ) > -1 ) n = n.split( ":" )[ 1 ];
						if( n.indexOf( "*" ) === -1 ) n += "*";
						console.log( "Getting ", n );
						let addDef = getOutline( n );
						if( addDef === false )
							return false; //joined on undefined outline
						else if( Array.isArray( addDef ) === true ||
							typeof addDef === "string" )
								return false; //can only join object outlines!
						else mixBintoA( def, addDef );
					}
					return def;
				}
			}
		}
	}
	var outlines = {};
		var typeTypes = [
			[ /"any"/g, "<i>any</i>" ],
			[ /"array"/g, "<i>array</i>" ],
			[ /"bigint"/g, "<i>bigint</i>" ],
			[ /"boolean"/g, "<i>boolean</i>" ],
			[ /"function"/g, "<i>function</i>" ],
			[ /"infinity"/g, "<i>infinity</i>" ],
			[ /"NaN"/g, "<i>NaN</i>" ],
			[ /"never"/g, "<i>never</i>" ],
			[ /"null"/g, "<i>null</i>" ],
			[ /"number"/g, "<i>number</i>" ],
			[ /"object"/g, "<i>object</i>" ],
			[ /"primitive"/g, "<i>primitive</i>" ],
			[ /"string"/g, "<i>string</i>" ],
			[ /"symbol"/g, "<i>symbol</i>" ],
			[ /"undefined"/g, "<i>undefined</i>" ],
			[ /"unset"/g, "<i>unset</i>" ],

			[ /"Uint8ClampedArray"/g, "<i>Uint8ClampedArray</i>" ],
			[ /"Uint8Array"/g, "<i>Uint8Array</i>" ],
			[ /"Uint16Array"/g, "<i>Uint16Array</i>" ],
			[ /"Uint32Array"/g, "<i>Uint32Array</i>" ],
			[ /"Int8Array"/g, "<i>Int8Array</i>" ],
			[ /"Int16Array"/g, "<i>Int16Array</i>" ],
			[ /"Int32Array"/g, "<i>Int32Array</i>" ],
			[ /"BigInt64Array"/g, "<i>BigInt64Array</i>" ],
			[ /"BigUint64Array"/g, "<i>BigUint64Array</i>" ],
			[ /"Float32Array"/g, "<i>Float32Array</i>" ],
			[ /"Float64Array"/g, "<i>Float64Array</i>" ]
		];
	
	function formatLimnaryName( nt ) {
		nt = nt.
				replace( /([^<])\//g, "$1." ).
				replace( /^\//g, "." ).
				replace( /[\s\r\n]+/gm, "" ).
				replace( /^[|&]+/m, "" ).
				replace( /[|&]+$/m, "" ).
				replace( /\:[|&]+/m, ":" );
		let baseNt = nt.replace( /("[/\w\d_\-.()*]+")[^:]/gi, "$1" ),
			formattedBaseNt = baseNt.replace( /"/g, "" ),
			formattedNt = "",
			isid = isIdentity( formattedBaseNt ) ? 
				"<em>&lt; identity <i>any</i> &gt;</em>" : "";
		//could be a type name
		if( formattedBaseNt !== "..." &&
			( ( baseNt.indexOf( "*" ) > -1 &&
			getOutline( formattedBaseNt ) === false ) ||
			( baseNt.indexOf( "*" ) === -1 &&
			! Limnaries[ formattedBaseNt ] ) ) ) {
				formattedNt = nt.replace( baseNt,
					"<span>" + formattedBaseNt + 
					" (definition not found!)</span>" );
			}
		else formattedNt = nt.replace( baseNt,
			"<b>" + formattedBaseNt + isid + "</b>" );
		return formattedNt;
	};
	/*
		extractTypeDependencies( type <outline>, set <Set> ) - adds
			the <string> names of all outline dependencies
			(excepting those native to Js) to {set}.
		usage:
		let s = new Set(),
			t = Limn.Outline( "Some.type*" );
		extractTypeDependencies( t, s );
		for( let dependency of s )
			console.log( "Type ", t, " is dependent on type ", s );
			//--> "Type Some.type* is dependent on Some.otherType*"
			//--> "Type Some.type* is dependent on Types.anotherType*"
			//--> "Type Some.type* is dependent on FTypes.someFunc()*"
			//	...
	*/
	function extractTypeDependencies( type, set ) {
		if( typeof type === "string" ) {
			type = type.replace( /([^<])\//g, "$1." ).replace( /^\//g, "." );
			type = type.replace( /"/g, "" );
			if( type.indexOf( ":" ) > -1 )
				type = type.split( ":" )[ 1 ];
			
			if( type.indexOf( "|" ) > -1 ) {
				extractTypeDependencies( type.split( "|" ), set )
			}
			else if( type.indexOf( "&" ) > -1 ) {
				extractTypeDependencies( type.split( "&" ), set )
			}
			else if( O.types[ type ] || type === "..." ) return;
			else set.add( type );
		}
		else if( Array.isArray( type ) ) {
			for( let t of type )
				extractTypeDependencies( t, set );
		}
		else if( typeof type === "object" ) {
			let types = Object.values( type );
			for( let t of types )
				extractTypeDependencies( t, set );
		}
	}
	
	function formatType( t ) {
		t = t.replace( /([^<])\//g, "$1." ).replace( /^\//g, "." );
		t = t.replace( /[\s\r\n]+/g, "" );
		for( let tt of typeTypes ) {
			t = t.replace( tt[ 0 ], tt[ 1 ] );
		}
		//if there are any named types, look them up
		let namedTypes = t.match(
				//this match is based on illegalOutlineCharacters
				/"[\w\d_\-.()*|&]+"[^:]|"[\w\d_\-.()*]+"$/gi
			);
		if( namedTypes ) {
			let replacers = {};
			for( let nt of namedTypes ) {
				//if we accidentally captured an ending character, shave it off
				let endingCharacter = nt.replace( /"[\w\d_\-.()*|]+"([^:])/gi, "$1" );
				if( endingCharacter && nt.charAt( nt.length - 1 ) === endingCharacter )
					nt = nt.substring( 0, nt.length - 1 );
				
				//temporarily swap out IDs so we don't get stuck overwriting identical nt's
				let rid = "$" + parseInt( Math.random() * 1000000 );
				replacers[ rid ] = "";
				t = t.replace( nt, rid );
				if( nt.indexOf( "|" ) > -1 ) {
					let splitNt = nt.replace( /([^"])\|([^"])/g, "$1\"|\"$2" ),
						formattedNt = " <div class=\"wrap\">&lt; " + formatType( splitNt ) + " &gt;</div> ";
					replacers[ rid ] = formattedNt;
				}
				else if( nt.indexOf( "&" ) > -1 ) {
					let splitNt = nt.replace( /([^"])&([^"])/g, "$1\"&\"$2" ),
						formattedNt = " <div class=\"wrap\">&lt; " + formatType( splitNt ) + " &gt;</div> ";
					replacers[ rid ] = formattedNt;
				}
				else {
					replacers[ rid ] = formatLimnaryName( nt );
				}
			}
			for( let rid in replacers ) {
				t = t.replace( rid, replacers[ rid ] );
			}
		}
		//could still be a one-long undefined type
		else if( t.match(/"[\w\d_\-.()*|]+"$/gi ) ) {
			t = formatLimnaryName( t );
		}
		t = t.replace( /,/g, ",<br>" );
		t = t.replace( /\]/g, "</div>]" );
		t = t.replace( /\[/g, "[<div>" );
		t = t.replace( /\{/g, "{<div>" );
		t = t.replace( /\}/g, "</div>}" );
		while( t.indexOf( "<br><br>" ) > -1 )
			t = t.replace( /<br><br>/g, "<br>" );
		t = t.replace( /^<</, "<div class=\"wrap\">&lt;<" );
		t = t.replace( />>$/, ">&gt;</div class=\"wrap\">" );
		return t;
	}
	function summarize( funcDef ) {
		if( ! funcDef ) return "";
		let summary = funcDef.listen ? 
				"<b>listen</b>( " : 
				"<b>"+(funcDef.isAsync ? "async " : "" )
					+"function</b>( ",
			parameterTypes = [];

		if( funcDef.parameters ) {
			for( let p of funcDef.parameters ) {
				let [ prm, tp ] = p.split( ":" );

				tp = formatTypeOrLimnary( tp );

				parameterTypes.push(
					"<br>&nbsp;" + prm + " " + tp
				)
			}
			summary += parameterTypes.join( ", " );
		}
		else if( funcDef.listen ) {
			summary += "<br>" + formatTypeOrLimnary( funcDef.listen );
		}
		summary += "<br>)"
		if( ! funcDef.listen ) {
			let resTp = ( funcDef.returns ? 
				funcDef.returns : "undefined" );
	
			summary += "<br> Returns : " + "<i>" + 
				formatTypeOrLimnary( resTp ) + 
				"</i>";
		}

		if( funcDef.emits ) {
			summary += "<br> Emits -&gt; " +
				formatTypeOrLimnary( funcDef.emits );
		}

		summary = summary.replace( /<br>\s*<br>/g, "<br>" )

		return summary;
	}
	function formatTypeOrLimnary( name ) {
		if( ! name.replace ) console.error( name );
		name = name.replace( /([^<])\//g, "$1." ).replace( /^\//g, "." );
		if( name.indexOf( "|" ) > -1 ||
			O.types.hasOwnProperty( name ) )
			name = formatType( Limn.Outline( name ) ).trim();
		else name = formatLimnaryName( name ).trim();
		return name;
	}
	
	function getDetail( name ) {
		name = name.replace( /([^<])\//g, "$1." ).replace( /^\//g, "." );
		let sum = "";
		if( name.indexOf( "*" ) === -1 ||
			( name.length > 3 &&
			name.indexOf( "()*" ) === name.length - 3 ) ) {
				sum = getSummary( name );
			}
		else {
			let out = Limn.Outline( name );
			if( typeof out === "function" )
				sum = formatType( "primitive" );
			else sum = formatType( out );
		}
		return sum;
	}
	function getSummary( nameOrType ) {
		nameOrType = nameOrType.replace( /([^<])\//g, "$1." ).replace( /^\//g, "." );
		let sum = null;
		if( nameOrType.indexOf( "*" ) > -1 )
			sum = summarize( outlines[ nameOrType ] );
		else sum = summarize( LimnaryDefinitions[ nameOrType ] );
		return sum;
	}
	/*
		Outline name allowed characters:
			Alphanumeric, "_", "-", and "."
		Plus special characters (allowed but meaningful):
			"*" - used to terminate an outline name.
			"(", ")" - used to indicate a function outline.
		This entire Outline notion is only used during development.
	*/
	
	window[ LimnAlias ].Outline = function( name, def, desc ) {
		let literalName = name;
		name = name.replace( /\//gm, "." ).
			replace( /[\s\r\n]+/gm, "" ).
			replace( /^[|&]+/m, "" ).
			replace( /[|&]+$/m, "" ).
			replace( /\:[|&]+/m, ":" );
		LiteralNames[ name ] = literalName;

		if( def && typeof def === "string" )
			def = def.replace( /[\s\r\n]+/gm, "" ).
				replace( /^[|&]+/m, "" ).
				replace( /[|&]+$/m, "" );

		if( def === undefined ) {
			if( name.indexOf( "|" ) > -1 ) {
				let nameOptions = name.split( "|" ),
					joinedNames = "< \"" + 
						nameOptions.join( "\" | \"" ) + 
						"\" >";
				return joinedNames;
			}
			else if( name.indexOf( "&" ) > -1 ) {
				let nameOptions = name.split( "&" ),
					joinedNames = "< \"" + 
						nameOptions.join( "\" & \"" ) + 
						"\" >";
				return joinedNames;
			}
			else if( name.length > 3 &&
				name.indexOf( "()*" ) === name.length - 3 ) {
				let summary = getSummary( name );
				return summary || name;
			}
			else {
				let outline = getOutline( name );
				if( outline ) {
					if( typeof outline === "string" && 
						( outline.indexOf( "|" ) > -1 ||
						outline.indexOf( "&" ) > -1 ) )
						return Limn.Outline( outline );
					else return JSON.stringify( outline );
				}
				else if( isValidOutline( name ) ) return '"' + name + '"';
			}
		}
		else {
			//we're defining an outline
			let illegalMatches = name.match( illegalOutlineCharacters ),
				parenthesisMatches = name.match( /[()]/g ),
				parenthesesMatches = name.match( /[(][)]/g );
			if( name.charAt( name.length - 1 ) !== "*" ) {
				console.error( "Outline names must end with '*'. Tried to define an outline namd: ", name );
				throw "Inherent Outline Definition Violation";
			}
			else if( illegalMatches ) {
				console.error( "Outline name " + name + " contained illegal characters: ", illegalMatches,
					"\nAn outline name may only contain letters, numbers, the underscore (\"_\"), and the dash (\"-\").\n",
					"An outline name must also end in a single asterisk (\"*\").\n",
					"An outline name may also contain contain the period (\".\"), but it is interpreted as a group hierarchy ",
					"indicator, so \"Types.physics.point\" will appear in the Explore() tree \"point\", ",
					"a sub-entry of \"physics\", a sub-entry of \"Types\".\n" );
				throw "Inherent Outline Definition Violation";
			}
			else if( parenthesesMatches !== null &&
				parenthesesMatches.length > 1 ) {
				console.error( "Function outline name had mis-placed parentheses: ", name );
				throw "Inherent Outline Definition Violation";
			}
			else if( parenthesesMatches === null &&
					parenthesisMatches !== null ) {
				console.error( "Function outline name had mal-formed parentheses: ", name );
				throw "Inherent Outline Definition Violation";
			}
			else if( outlines.hasOwnProperty( name ) ) {
				console.error( "Tried to redefine previously defined outline: ", name );
				throw "Inherent Outline Definition Violation";
			}
			else if( name.indexOf( "|" ) > -1 || 
				name.indexOf( "&" ) > -1 ) {
				console.error( "Outline names may not contain & or |. " + 
					"Those characters are only valid in outline union and intersection definitions.", name );
				throw "Inherent Outline Definition Violation";
			}
			else if( name.length > 3 &&
				name.indexOf( "()*" ) === name.length-3 ) {
				//it's a function outline defintion
				outlines[ name ] = def;
				outlinesPendingURL.push( name );
				FunctionOutlines.set( def, name );
				if( desc ) LimnaryDescriptions[ name ] = desc;
			}
			else {
				let validity = isValidOutline( def );
				if( validity !== true ) {
					console.error( `Outline definition for ${name} is not a valid outline: `,
						def, "\n\n", validity );
					throw "Inherent Outline Definition Violation";
				}
				else {
					outlines[ name ] = def;
					if( desc ) LimnaryDescriptions[ name ] = desc;
					outlinesPendingURL.push( name );
				}
			}
		}
	}

const promisePolyfill = `'use strict';var G="function"==typeof Object.defineProperties?Object.defineProperty:function(p,r,t){p!=Array.prototype&&p!=Object.prototype&&(p[r]=t.value)};function L(p){p=["object"==typeof globalThis&&globalThis,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global,p];for(var r=0;r<p.length;++r){var t=p[r];if(t&&t.Math==Math)return t}throw Error("Cannot find global object");}var M=L(this);function Q(){Q=function(){};M.Symbol||(M.Symbol=R)}
function S(p,r){this.a=p;G(this,"description",{configurable:!0,writable:!0,value:r})}S.prototype.toString=function(){return this.a};var R=function(){function p(t){if(this instanceof p)throw new TypeError("Symbol is not a constructor");return new S("jscomp_symbol_"+(t||"")+"_"+r++,t)}var r=0;return p}();
(function(p){function r(b){b()}function t(b){b(this)}function H(){if(y){do u=!1,D.shift()();while(--y)}u=!1}function B(b,k,d){this.then=b;this["catch"]=k;this["finally"]=d}function v(b){function k(a){0===h&&(F(a)?a.then(k,d):(g=a,h=2,null!==e&&("function"===typeof e?e(a):e.forEach(t,a),e=null),c=null,null!==l&&("function"===typeof l?l():l.forEach(r),l=null)))}function d(a){0===h&&(g=a,h=1,null!==c&&("function"===typeof c?c(a):c.forEach(t,a),c=null),e=null,null!==l&&("function"===typeof l?l():l.forEach(r),
l=null))}var g,h=0,e=null,c=null,l=null,f=new B(function(a,m){void 0!=a&&"function"!==typeof a&&console.warn(Object.prototype.toString.call(a)+" is not a valid function to be called after a successful promise");void 0!=m&&"function"!==typeof m&&console.warn(Object.prototype.toString.call(m)+" is not a valid function to be called after a rejected promise");if(0===h)return I(function(w,C){var z="function"===typeof a?function(){w(a(g))}:w,J="function"===typeof m?function(){C(m(g))}:C;null!==e?"function"===
typeof e?e=[e,z]:e.push(z):e=z;null!==c?"function"===typeof c?c=[c,J]:c.push(J):c=J});try{return 2===h?"function"===typeof a?E(a(g)):x:"function"===typeof m?q(m(g)):x}catch(w){return q(w)}},function(a){void 0!=a&&"function"!==typeof a&&console.warn(Object.prototype.toString.call(a)+" is not a valid function to be called after a rejected promise");if(0===h)return I(function(m){null!==c?"function"===typeof c?c=[c,function(){m(a(g))}]:c.push(function(){m(a(g))}):c=function(){m(a(g))};null!==e?"function"===
typeof e?e=[e,m]:e.push(m):e=m});if(2===h)return E(g);try{return"function"===typeof a?E(a(g)):x}catch(m){return q(m)}},function(a){void 0!=a&&"function"!==typeof a&&console.warn(Object.prototype.toString.call(a)+" is not a valid function to be called 'finally' after promise");if(0===h)null!==l?"function"===typeof l?l=[l,a]:l.push(a):l=a;else try{a()}catch(m){return q(m)}return f});if(!0===u)D.push(function(){try{b(k,d)}catch(a){d(a)}}),y=y+1|0;else{n=n+1|0;if(u=128===n)try{b(k,d)}catch(a){d(a)}else{try{b(k,
d)}catch(a){d(a)}!0===u&&1===n&&H()}n=n-1|0}return f}function I(b){function k(f){0===g&&(d=f,g=1,null!==e&&("function"===typeof e?e(f):e.forEach(t,f),e=null),h=null,null!==c&&("function"===typeof c?c():c.forEach(r),c=null))}var d,g=0,h=null,e=null,c=null,l=new B(function(f,a){f&&"function"!==typeof f&&console.error(Object.prototype.toString.call(f)+" is not a valid function to be called after a successful promise");a&&"function"!==typeof a&&console.error(Object.prototype.toString.call(a)+" is not a valid function to be called after a rejected promise");
if(0===g)return v(function(m,w){var C="function"===typeof f?function(){m(f(d))}:m,z="function"===typeof a?function(){w(a(d))}:w;null!==h?"function"===typeof h?h=[h,C]:h.push(C):h=C;null!==e?"function"===typeof e?e=[e,z]:e.push(z):e=z});try{return 2===g?"function"===typeof f?A(f(d)):x:"function"===typeof a?q(a(d)):x}catch(m){return q(m)}},function(f){f&&"function"!==typeof f&&console.error(Object.prototype.toString.call(f)+" is not a valid function to be called after a rejected promise");if(0===g)return v(function(a){null!==
e?"function"===typeof e?e=[e,function(){a(f(d))}]:e.push(function(){a(f(d))}):e=function(){a(f(d))};null!==h?"function"===typeof h?h=[h,a]:h.push(a):h=a});if(2===g)return A(d);try{return"function"===typeof f?A(f(d)):x}catch(a){return q(a)}},function(f){"function"!==typeof f&&console.error(Object.prototype.toString.call(f)+" is not a valid function to be called 'finally' after promise");0===g?null!==c?"function"===typeof c?c=[c,f]:c.push(f):c=f:f();return l});try{b(function m(a){0===g&&(F(a)?a.then(m,
k):(d=a,g=2,null!==h&&("function"===typeof h?h(a):h.forEach(t,a),h=null),null!==c&&("function"===typeof c?c():c.forEach(r),c=null),e=null))},k)}catch(f){k(f)}return l}function A(b){if("object"===typeof b&&null!==b&&"function"===typeof b.then)return b;var k=new B(function(d){if("function"!==typeof d)return k;if(!0===u)return I(function(h,e){D.push(function(){try{h(d(b))}catch(c){e(c)}});y=y+1|0});n=n+1|0;var g=null;try{(u=128===n)?D.push(function(){d(b)}):(g=d(b),!0===u&&1===n&&H())}catch(h){return q(h)}finally{n=
n-1|0}return E(g)},function(){return k},function(d){if("function"===typeof d)if(!0===u)D.push(d),y=y+1|0;else{n=n+1|0;try{(u=128===n)?(d(),u=!1):(d(),!0===u&&1===n&&H())}catch(g){return q(g)}finally{n=n-1|0}}return k});return k}function E(b){if("object"===typeof b&&null!==b&&"function"===typeof b.then)return b;var k=new B(function(d){try{return"function"===typeof d?A(d(b)):x}catch(g){return q(g)}},function(){return k},function(d){try{"function"===typeof d&&d()}catch(g){return q(g)}return k});return k}
function q(b){if("object"===typeof b&&null!==b&&"function"===typeof b.then)return b;var k=new B(function(d,g){try{return"function"===typeof g?A(g(b)):x}catch(h){return q(h)}},function(d){try{return"function"===typeof d?A(d(b)):x}catch(g){return q(g)}},function(d){try{"function"===typeof d&&d()}catch(g){return q(g)}return k});return k}function N(b,k){if("object"!==typeof b||"function"!==typeof b.forEach)return console.error(Object.prototype.toString.call(b)+" is not a valid iterable array of promises. If you are using an array-like object, you must call Array.prototype.slice.call on the object before passing it to SPromise."+
k),x}function K(b){return b===p?b.b=v:v}var D=[],F=v.isPromise=function(b){return"object"===typeof b&&null!==b&&"function"===typeof b.then},n=0,u=!1,y=0;Q();Q();var O=""+void 0!==typeof Symbol&&Symbol.toStringTag,x=A(void 0);"symbol"===typeof O&&(B.prototype[O]="Promise");v.resolve=E;v.reject=q;var P=!1;v.race=function(b){N(b,"race");P||b.length||(P=!0,console.warn(Object.prototype.toString.call(b)+" is an empty array of promises passed to SPromise"));return v(function(k,d){function g(f){e&&(e=
0,k(f))}function h(f){e&&(e=0,d(f))}for(var e=1,c=0,l;c<b.length&&e;c=c+1|0)F(l=b[c])?l.then(g,h):g(l)})};v.all=function(b){N(b,"all");return v(function(k,d){function g(m){a.then(function(w){l[m|0]=w;c=c-1|0;0===c&&k(l)},function(w){0<c&&(c=-1,d(w))})}for(var h=null,e=b.length|0,c=e,l=[],f=0,a;f<e;f=f+1|0)F(a=b[f])?(l[f]=h,g(f)):(c=c-1|0,l[f]=h=a);0===c&&k(l)})};"object"===typeof exports&&""+void 0!==typeof module?module.exports=v:typeof define==typeof K&&"function"===typeof define&&define.amd?
define(K):K(p)})("object"==typeof self?self:"object"==typeof global?global:this);`
/*
	Promise Polyfill
	Anonyco's public domain SPromiseMeSpeedJS.
	https://github.com/anonyco/SPromiseMeSpeedJS
*/

function checkIfUsingEmit() {
	let usingEmitter = false;
	for( let name in LimnaryDefinitions )
		if( LimnaryDefinitions[ name ].emits ) {
			usingEmitter = true;
			break;
		}
	return usingEmitter;
}

function ArchaicBuild( globalName ) {
	//compatible with IE 9 (Object.freeze, Function.prototype.apply with generic array arguments)
	let usingEmitter = checkIfUsingEmit();
	let emitFunction = usingEmitter ?
`${globalName}.e = function( name, detail ) {
	return new Promise( function( endEmit ) {
		var alls = [];
		for( var i=0; i < Listeners[ name ].length; i++ ) {
			var l = Listeners[ name ][ i ];
			var v = l( name, detail );
			if( v && ( typeof v.then === "function" ) )
				alls.push( v );
		}
		if( alls.length > 0 )
			Promise.all( alls ).then( function() {
				endEmit();
			} );
		else endEmit();
	} )
};` : "",
		addLimnaryFunction = `${globalName}._ =
function( ${globalName} ) {
	${globalName}.Limnaries[ ${globalName}.name ] = ${globalName}.factory();

${ usingEmitter ? `	if( ${globalName}.listen ) {
		for( var i = 0; i < ${globalName}.listen.length; i ++ ) {
			var l = ${globalName}.listen[ i ];
			if( ! ${globalName}.Listeners[ l ] ) ${globalName}.Listeners[ l ] = [];
			${globalName}.Listeners[ l ].push( ${globalName}.Limnaries[ ${globalName}.name ] );
		}
	}` : ""}
}`,
		opener = `
var ${globalName} = {};

var Limnaries = ${globalName}.Limnaries = {},
${ usingEmitter ? `	Listeners = ${globalName}.Listeners = {},
` : ""}	Passables = ${globalName}.Passables = {};`,
		builds = [];

	for( let name in LimnaryDefinitions ) {
		let definition = LimnaryDefinitions[ name ],
			factoryCode = definition.factory.toLocaleString(),
			listen = definition.listen ?
				( definition.listen.indexOf( "|" ) > -1 ?
				definition.listen.split( "|" ) : [ definition.listen ] ) : false,
			limns = {};
		for( let localName in definition.imports )
			limns[ localName ] = definition.imports[ localName ].replace( /\//g, "." );
		if( definition.emits ) limns.emit = null;
		let limnaryObject = 
				`${globalName}.Passables[ "${name}" ] = ${JSON.stringify(limns)||"{}"}`,
			defineObject =
`${globalName}._( {
	Limnaries: ${globalName}.Limnaries,
	name: "${name}",
	factory: ( imports => {
	return ${factoryCode}
	} )( ${limnaryObject} ),
${ usingEmitter ? `	Listeners: ${globalName}.Listeners,
` : "" }	listen: ${listen?"[\""+listen.join('","')+"\"]":"false"}
} );`
		builds.push( defineObject );
	}

	let builder = 
`( function( ${globalName} ) {
		var Limnaries = undefined,
${ usingEmitter ? `			Listeners = undefined,
` : ""}			Passables = undefined;
		${addLimnaryFunction}
		${builds.join( "\r\n" )}
	}
)( ${globalName} );
`,
		closer = `
${ usingEmitter ? `delete ${globalName}.Listeners;
delete ${globalName}.Limnaries;
delete ${globalName}.Passables;
delete ${globalName}._;

var passables,
	name,
	localReference;
for( name in Passables ) {
	passables = Passables[ name ];
	for( localReference in passables ) {
${ usingEmitter ? `		if( localReference === "emit" )
			passables.emit = ${globalName}.e;
		else` : "		" } passables[ localReference ] =
			Limnaries[ passables[ localReference ] ];
	}
	Object.freeze( passables );
}
Object.freeze( Passables );
delete ${globalName}.e;` : "" }
passables = undefined;
name = undefined;
localReference = undefined;

(
	function( preexistingLimnaryLookup ) {
		window.${globalName} = function( name ) {
			return new Promise(
				function( returnLimn ) {
					var thisLimnary = Limnaries[ name.replace( /\\//g, "." ) ];
					returnLimn( ( typeof preexistingLimnaryLookup === "function" ) ?
						( thisLimnary || preexistingLimnaryLookup( name ) ) : thisLimnary );
				}
			);
		}
	}
)( window.${globalName} );
`,
		globalizer = useGlobalizer ?
`( function( currentGlobal ) {
	var newGlobal = Limnaries[ 
			( "${globalName}" ).replace( /\\//g, "." )
		]( currentGlobal );
	window.${globalName} = newGlobal;
${ noBuildEvent ? "" : `	var event = document.createEvent( "Event" );
	event.initEvent( "${globalName}", true, true );
	window.dispatchEvent( event );
`}} )( window.${globalName} );
` : "";

/*
Emitting in old IE:
// Create the event.
var event = document.createEvent('Event');

// Define that the event name is 'build'.
event.initEvent('build', true, true);

// Listen for the event.
elem.addEventListener('build', function (e) {
  // e.target matches elem
}, false);

// target can be any Element or other EventTarget.
elem.dispatchEvent(event);
*/

return ( noPromisePolyfill ? 
	"" : promisePolyfill + "\r\n" ) +
`( function( window ) {
${[
opener,
emitFunction,
builder,
closer,
globalizer
].join( "\r\n" )} 
}
)( window || global )
`;
}

function BriefBuild( globalName ) {
	let usingEmitter = checkIfUsingEmit();
	let emitFunction = usingEmitter ?
`${globalName}.e = async ( name, detail ) => {
	let alls = [];
	for( let l of Listeners[ name ] ) { let v = l( name, detail ); 
		if( v && ( typeof v.then === "function" ) ) alls.push( v ); }
	if( alls.length > 0 ) await Promise.all( alls );
	return true;
};` : "",
		addLimnaryFunction = `${globalName}._ = 
( ${globalName} ) => {
	${globalName}.Limnaries[ ${globalName}.name ] = ${globalName}.factory();
${ usingEmitter ? `	if( ${globalName}.listen ) for( let l of ${globalName}.listen ) {
		if( ! ${globalName}.Listeners[ l ] ) ${globalName}.Listeners[ l ] = [];
		${globalName}.Listeners[ l ].push( ${globalName}.Limnaries[ ${globalName}.name ] );
	}` : "" }
}`,
		opener = `
let ${globalName} = {};

const Limnaries = ${globalName}.Limnaries = {},
${ usingEmitter ? `	Listeners = ${globalName}.Listeners = {},
` : ""}	Passables = ${globalName}.Passables = {};
`,
		builds = [];

	for( let name in LimnaryDefinitions ) {
		let definition = LimnaryDefinitions[ name ],
			factoryCode = definition.factory.toLocaleString(),
			listen = definition.listen ?
				( definition.listen.indexOf( "|" ) > -1 ?
				definition.listen.split( "|" ) : [ definition.listen ] ) : false,
			limns = {};
		for( let localName in definition.imports )
			limns[ localName ] = definition.imports[ localName ].replace( /\//g, "." );
		if( definition.emits ) limns[ "emit" ] = null;
		let limnaryObject = 
				`${globalName}.Passables[ "${name}" ] = ${JSON.stringify(limns)||"{}"}`,
			defineObject =
`${globalName}._( {
	Limnaries: ${globalName}.Limnaries,
	name: "${name}",
	factory: ( imports => {
		return ${factoryCode}
	} )( ${limnaryObject} ),
${ usingEmitter ? `	Listeners: ${globalName}.Listeners,
` : ""}	listen: ${listen?"[\""+listen.join('","')+"\"]":"false"}
} );`
		builds.push( defineObject );
	}

	let builder = `
( ( ${globalName} ) => {
const Limnaries = undefined,
${ usingEmitter ? `	Listeners = undefined,
` : ""}	Passables = undefined;
${addLimnaryFunction}
${builds.join( "\r\n" )}
} )( ${globalName} )
`,
		closer = `
${ usingEmitter ? `delete ${globalName}.Listeners;
` : ""}delete ${globalName}.Limnaries;
delete ${globalName}.Passables;
delete ${globalName}._;
for( let name in Passables ) {
	let passables = Passables[ name ];
	for( let localReference in passables ) {
${ usingEmitter ? `		if( localReference === "emit" )
			passables.emit = ${globalName}.e;
			else ` : "			" }passables[ localReference ] =
			Limnaries[ passables[ localReference ] ];
	}
	Object.freeze( passables );
}
Object.freeze( Passables );
delete ${globalName}.e;

( ( preexistingLimnaryLookup ) => {
	window.${globalName} = async ( name ) => {
		let thisLimnary = Limnaries[ name.replace( /\\//g, "." ) ];
		return ( typeof preexistingLimnaryLookup === "function" ) ?
			( thisLimnary || preexistingLimnaryLookup( name ) ) : thisLimnary;
	}
} )( window.${globalName} );
`,
		globalizer = useGlobalizer ?
`
( ( currentGlobal ) => {
	let newGlobal = Limnaries[ ( "${globalName}" ).replace( /\\//g, "." ) ]( currentGlobal );
	window.${globalName} = newGlobal;
${ noBuildEvent ? "" : `	window.dispatchEvent( new Event( "${globalName}" ) );
` }} )( window.${globalName} );
` : "";

	return `( ( window )=> {
${[
	opener,
	emitFunction,
	builder,
	closer,
	globalizer
	].join( "\r\n" )} 
} )( window || global )`;
}

	function getNewWindow() {
		return new Promise( ( finish ) => {
			let pageData = `
					<html>
						<head>
							<meta charset="utf-8">
							<title>Explore</title>
							<style type="text/css">${cssData}</style>
						</head>
						<body></body>
					</html>
				`;
			let ref,
				features = `width=${parseInt(window.innerWidth/2)},height=${parseInt(window.innerWidth/2)},menubar=no,location=no,resizable=yes,scrollbars=yes,status=no`;
			ref = window.open( "", "Explore", features );
			if( ! ref ) finish( null );
			else {
				ref.document.open();
				ref.document.write( pageData );
				ref.document.close();
				ref.onload = () => { finish( ref ); };
			}
		} );
	}

	window[ LimnAlias ].Explore = async function( documentNodeOrFocus, focus ) {
		let usingPopupWindow = false;
		if( ! documentNodeOrFocus || 
			typeof documentNodeOrFocus === "string"  ) {
			if( typeof documentNodeOrFocus === "string" )
				focus = documentNodeOrFocus;

			let newWindow = await getNewWindow();
			if( newWindow ) {
				documentNodeOrFocus = newWindow.document.body;
				newWindow[ LimnAlias ] = window[ LimnAlias ];
				usingPopupWindow = true;
			}
			else {
				console.error( "No target element specified. Unable to create new window. Please try again.\n",
					"If you enable popups in your browser, you must close the popup that appears and then ",
					`run Limn.Explore() or ${globalName}.Explore() once again.\n`,
					"If you prefer not to use a popup, you may instead pass a specific HTML node to ",
					"Limn.Explore(), which will then have the contents of the Limn explorer inserted into it.\n",
					`Calling Limn.Explore( document.body ) or ${globalName}.Explore( document.body ) `,
					"will replace the contents of the current HTML document with the Limn explorer, which ",
					"may be particularly useful in the case of a tool library that does not have its ",
					"own on-screen interface." );
				return false;
			}
		}
		var elementsByName = {};

		//Build a two-way linked-list of dependencies
		//	and sort names into a tree via the "." operator

		let links = {
				/*
				needs: {
					"limnary.name": //requiresAllOf: 
						{ "requiredLimnary1":"localName",
						"requiredLimnary2":"someLocalName" }
				}
				*/
				needs:{},
				/*
				neededBy: {
					"requiredLimnary1": //isRequiredByAllOf:
						{ "limnary.name":"asLocalName" },
					"requiredLimnary2": //isRequiredByAllOf:
						{ "limnary.name":"asALocalName" },
				}
				*/
				neededBy:{},
				//missings: { "missing.Limn.Name":true },
				missings:{},
				//needMissing: { "Limn.Missing.A.Dependency":true },
				needMissing:{},
				/*
				outlines: {
					"some.outline*": {
						"acceptedBy": {
							"a.limnary.name": "asLocalParameter1",
							"some.limn.name": "asInputParam",
							...
						},
						"returnedBy": {
							"a.limn.thingy": true,
							"thatLimnThing": true,
							...
						},
						"referencedIn": {
							"another.outline*": true,
							...
						},
						"references": {
							"that.otherThing*": true,
							...
						}
					},
					...
				}
				*/
				outlines:{},
			},
			makeOutline = () => { return {
				"acceptedBy":{},
				"returnedBy":{},
				"referencedIn":{},
				"references":{},
				"listenedBy":{},
				"emittedBy":{}
			} },
			root = {},
			tree;
		//1. add limnary definitions to the tree
		//2. build out dependency links for limns & outlines
		for( let name in LimnaryDefinitions ) {
			tree = root;
			let def = LimnaryDefinitions[ name ],
				exp = name.split( /[/\.]/g );
			
			//add bases for linked definitions if another def
			//	hasn't already done so
			links.needs[ name ] = links.needs[ name ] || {};
			links.neededBy[ name ] = links.neededBy[ name ] || {};

			//add bases for outlines if not already there
			if( def.parameters )
				for( let parameter of def.parameters ) {
					let [ prm, tpo ] = parameter.split( ":" );
					let tps = getLexicalOutlines( tpo );
					for( let tp of tps ) {
						links.outlines[ tp ] = links.outlines[ tp ] || makeOutline();
						if( links.outlines[ tp ].acceptedBy[ name ] )
							links.outlines[ tp ].acceptedBy[ name ] += ", " + prm;
						else links.outlines[ tp ].acceptedBy[ name ] = prm;
					}
				}
			if( def.listen ) {
				let listens = getLexicalOutlines( def.listen );
				for( let l of listens ) {
					links.outlines[ l ] = links.outlines[ l ] || makeOutline();
					links.outlines[ l ].listenedBy[ name ] = true;
				}
			}
			if( def.emits ) {
				let emits = getLexicalOutlines( def.emits );
				for( let e of emits ) {
					links.outlines[ e ] = links.outlines[ e ] || makeOutline();
					links.outlines[ e ].emittedBy[ name ] = true;
				}
			}
			if( def.returns ) {
				let returns = getLexicalOutlines( def.returns );
				for( let r of returns ) {
					links.outlines[ r ] = links.outlines[ r ] || makeOutline();
					links.outlines[ r ].returnedBy[ name ] = true;
				}
			}

			for( let localSubName in def.imports ) {
				let subName = def.imports[ localSubName ].replace( /\//g, "." );
				links.needs[ name ][ subName ] = localSubName;
				links.neededBy[ subName ] = links.neededBy[ subName ] || {};
				links.neededBy[ subName ][ name ] = localSubName;
			}

			while( exp.length > 1 ) {
				let nextName = exp.shift();
				if( ! tree[ nextName ] )
					tree[ nextName ] = {};
				tree = tree[ nextName ];
			}
			let lastName = exp.shift();
			tree[ lastName ] = {};
		}

		//identify any undefined needs among the limnaries
		for( let fullName in links.needs ) {
			let needs = links.needs[ fullName ];
			for( let needsName in needs ) {
				if( ! LimnaryDefinitions[ needsName ] ) {
					links.missings[ needsName ] = true;
					links.needMissing[ fullName ] = true;
				}
			}
		}

		//1. add primitive outlines to the tree
		//2. build out outline reference links
		for( let name in outlines ) {
			let outline = outlines[ name ],
				dependencies = new Set();

			extractTypeDependencies( outline, dependencies );

			links.outlines[ name ] = links.outlines[ name ] || makeOutline();

			let def = null;
			if( name.length > 3 &&
				name.indexOf( "()*" ) === name.length - 3 ) {
				def = outlines[ name ];
			}
			else if( name.indexOf( "*" ) === -1 ) {
				def = LimnaryDefinitions[ name ];
			}
			for( let t of dependencies ) {
				links.outlines[ t ] = links.outlines[ t ] || makeOutline();
				if( def ) {
					if( isLexicalOutline( def.returns, t ) )
						links.outlines[ t ].returnedBy[ name ] = true;
					else for( let p of def.parameters ) {
						let [ pName, pType ] = p.split( ":" );
						if( isLexicalOutline( pType, t ) ) {
							if( links.outlines[ t ].acceptedBy[ name ] ) {
								links.outlines[ t ].acceptedBy[ name ] += ", " + pName;
							}
							else links.outlines[ t ].acceptedBy[ name ] = pName;
						}
					}
				}
				else links.outlines[ t ].referencedIn[ name ] = true;
				links.outlines[ name ].references[ t ] = true;
				if( t.indexOf( "*" ) > -1 &&
					getOutline( t ) === false ) {
					links.missings[ t ] = true;
					links.needMissing[ name ] = true;
				}
			}

			tree = root;
			let exp = name.split( /[/\.]/g );
			while( exp.length > 1 ) {
				let nextName = exp.shift();
				if( ! tree[ nextName ] )
					tree[ nextName ] = {};
				tree = tree[ nextName ];
			}
			let lastName = exp.shift();
			tree[ lastName ] = {};
		}

		//convert the tree to an array
		let t2a = ( t, ar ) => {
				if( ! ar ) ar = [];
				let tKeys = Object.keys( t );
				if( tKeys.length ) {
					for( let key of tKeys ) {
						let subAr = [];
						ar.push( [ key, subAr ] );
						t2a( t[ key ], subAr );
					}
				}
				return ar;
			},
			treeArray = t2a( root );
		
		//sort the tree array alphabetically
		let tas = ( a,b ) => a[ 0 ] > b[ 0 ] ? 1 : -1,
			taSort = ( ta, name ) => {
				if( ta.length === 0 ) return;
				ta.sort( tas );
				for( let subTa of ta ) {
					let subName = ( ( name !== undefined ) ? (name+".") : "" ) + subTa[ 0 ];

					taSort( subTa[ 1 ], subName );

					if( LimnaryDefinitions[ subName ] ) {
						subTa[ 2 ] = { category:"limnary", fullName: subName };
						//sort dependencies alphabetically by absolute name,
						//	store in array (to preserve sort) with local names
						let needsKeys = Object.keys( links.needs[ subName ] ).sort(),
							needsValues = [],
							needs = [];
						for( let k of needsKeys )
							needsValues.push( links.needs[ subName ][ k ] );
						for( let i=0; i< needsKeys.length; i++ )
							needs.push( [ needsKeys[ i ], needsValues[ i ] ] );
						
						//sort limnaries dependent on this one similarly
						let neededByKeys = Object.keys( links.neededBy[ subName ] ).sort(),
							neededByValues = [],
							neededBy = [];
						for( let k of neededByKeys )
							neededByValues.push( links.neededBy[ subName ][ k ] );
						for( let i=0; i< neededByKeys.length; i++ )
							neededBy.push( [ neededByKeys[ i ], neededByValues[ i ] ] );

						subTa[ 3 ] = { needs, neededBy }
					}
					else if( outlines[ subName ] ) {
						subTa[ 2 ] = { category:"outline", fullName: subName };
					}
				}
			};
		taSort( treeArray );

		var make = n => document.createElement( n ),
			write = t => { return { to: p => p.appendChild( document.createTextNode( t ) ) } },
			add = n => { return { to: p => p.appendChild( n ) } },
			makeTab = t => {
				let d = make( "div" );
				write( t ).to( d );
				let x = make( "span" );
				x.classList.add( "x" );
				write( "✕" ).to( x );
				add( x ).to( d );
				x.onclick = function(e) {
					if( e && e.preventDefault )
						e.preventDefault();
					if( e && e.stopPropagation )
						e.stopPropagation();
					//if we're active, activate the next tab
					if( this.parentNode.classList.contains( "active" ) ) {
						let newTab = this.parentNode.nextSibling ||
								this.parentNode.previousSibling ||
								null;
						if( newTab ) window.setTimeout(
							() => { newTab.onclick() }, 1
						)
					}
					this.parentNode.parentNode.removeChild(
						this.parentNode
					);
				}
				d.onclick = function(e) {
					if( e && e.preventDefault )
						e.preventDefault();
					if( e && e.stopPropagation )
						e.stopPropagation();
					for( let node of tabsRow.children )
						node.classList.remove( "active" );
					if( ! this.parentNode || 
						this.parentNode !== tabsRow )
						tabsRow.appendChild( this );
					this.classList.add( "active" );
					let name = this.id.replace( "tab-link:", "" ),
						{ nameElement,
							parametersElement,
							descriptionElement,

							requiresElement,
							requiredByElement,

							acceptedByElement,
							returnedByElement,
							referencedInElement,
							referencesElement,
							listenedByElement,
							emittedByElement,

							needsGraphElement,
							neededByGraphElement,

							codeElement,							
						} = elementsByName[ name ];
					mainBlock.innerHTML = "";
					add( nameElement ).to( mainBlock );
					if( descriptionElement )
						add( descriptionElement ).to( mainBlock );
					if( parametersElement )
						add( parametersElement ).to( mainBlock );
					if( requiresElement )
						add( requiresElement ).to( mainBlock );
						if( needsGraphElement )
							add( needsGraphElement ).to( mainBlock );
					if( requiredByElement )
						add( requiredByElement ).to( mainBlock );
						if( neededByGraphElement )
							add( neededByGraphElement ).to( mainBlock );
					if( acceptedByElement )
						add( acceptedByElement ).to( mainBlock );
					if( returnedByElement )
						add( returnedByElement ).to( mainBlock );
					if( referencedInElement )
						add( referencedInElement ).to( mainBlock );
					if( referencesElement )
						add( referencesElement ).to( mainBlock );
					if( listenedByElement )
						add( listenedByElement ).to( mainBlock );
					if( emittedByElement )
						add( emittedByElement ).to( mainBlock );
					if( codeElement )
						add( codeElement ).to( mainBlock );
				}
				return d;
			},
			listDetails = function( fullName ) {
				let summary = getDetail( fullName ),
					summaryDiv = make( "div" );
				summaryDiv.classList.add( "summary" );
				summaryDiv.innerHTML = summary;
				let links = summaryDiv.getElementsByTagName( "b" ),
					staticLinks = [];
				for( let l of links )
					staticLinks.push( l );
				for( let l of staticLinks ) {
					let id = l.innerHTML.replace( /<em>.+<\/em>/g, "" ),
						sum = getDetail( id.replace( /"/g, "" ) );
					if( ! sum ) continue;
					let detail = make( "span" );
					l.classList.add( "detailHolder" );
					l.classList.add( "vertical" );
					l.onclick = e => {
						if( l.getClientRects()[ 0 ].width > e.offsetX )
							elementsByName[ id ].tabElement.onclick();
						else {
							if( e.preventDefault )
								e.preventDefault();
							if( e.stopPropagation )
								e.stopPropagation();
						}
					}
					detail.innerHTML = sum;
					detail.classList.add( "detail" );
					add( detail ).to( l );
				}
				elementsByName[ fullName ].parametersElement = summaryDiv;
			},
			//fullName - fullName
			//supportHigh - category of links
			//supportLow - (optional) category of links[ supportHigh ][ fullName ]
			//elementName - name to stash under in elementsByName[ fullName ][ ? ]
			//labelMessage - label if there are supports to show
			//noLabelMessage - label if there are no such support to show
			//localMessage{ message:"...", asPrefix:bool, asSuffix:bool }
			listSupports = function( 
					fullName, supportHigh, supportLow, elementName,
					labelMessage, noLabelMessage, localMessage
				) {
				let supports = links[ supportHigh ][ fullName ],
					supportsDiv = make( "div" ),
					supportsLabel = make( "div" );
				if( supportLow )
					supports = supports[ supportLow ];
				let keys = Object.keys( supports );
				supportsDiv.classList.add( "dependency" );
				supportsLabel.classList.add( "label" );
				add( supportsLabel ).to( supportsDiv );
				elementsByName[ fullName ][ elementName ] = supportsDiv;

				if( keys.length ) {
					write( labelMessage ).to( supportsLabel );
					let supportsEl = make( "div" );
					supportsEl.classList.add( "dependency-list" );
					for( let supportedName of keys ) {
						let supportedInfoName = supports[ supportedName ],
							supportLi = make( "div" ),
							summary = getDetail( supportedName ),
							summaryLabel = make( "span" ),
							fullLabel = make( "span" ),
							localLabel = make( "span" );
						if( localMessage ) {
							write( localMessage.message.replace(
								"${info}", 
								supportedInfoName
							) ).to( localLabel );
							if( localMessage.asPrefix )
								add( localLabel ).to( supportLi );
						}
						supportLi.classList.add( "dependency-entry" );
						write( supportedName ).to( fullLabel );
						fullLabel.classList.add( "detailHolder" );
						fullLabel.classList.add( "vertical" );

						if( links.missings[ supportedName ] )
							fullLabel.classList.add( "missing" );

						summaryLabel.innerHTML = summary;
						summaryLabel.classList.add( "detail" );
						add( summaryLabel ).to( fullLabel );
						add( fullLabel ).to( supportLi );
						if( localMessage && localMessage.asSuffix )
							add( localLabel ).to( supportLi );
						supportLi.onclick = e => {
							if( fullLabel.getClientRects()[ 0 ].width > e.offsetX )
								elementsByName[ supportedName ].tabElement.onclick();
							else {
								if( e.preventDefault )
									e.preventDefault();
								if( e.stopPropagation )
									e.stopPropagation();
							}
						}
						add( supportLi ).to( supportsEl );
					}
					add( supportsEl ).to( supportsDiv );
				}
				else {
					write( noLabelMessage ).to( supportsLabel );
				}
			},
			limnCellNeeds = ( stack, fullName, ignore, graphStack ) => {
				let cell = makeCell( fullName, graphStack );
				if( stack === graphStack )
					cell.classList.add( "no-lead-out" );
				add( cell ).to( stack );
				if( ignore[ fullName ] ) {
					cell.classList.add( "no-lead-in" );
					if( links.needs[ fullName ]  &&
						Object.keys( links.needs[ fullName ] ).length )
						cell.classList.add( "ignored-out" );
					return;
				}
				else {
					ignore[ fullName ] = true;
					let needs = links.needs[ fullName ];
					if( needs ) {
						needs = Object.keys( needs );
						if( needs.length ) {
							let ingoerStack = getIngoerStack( cell );
							for( let needsName of needs )
								limnCellNeeds( ingoerStack, 
									needsName, ignore, 
									graphStack );
						}
						else cell.classList.add( "no-lead-in" );
					}
				}
			},
			limnCellNeededBy = ( stack, fullName, ignore, graphStack ) => {
				let cell = makeCell( fullName, graphStack );
				if( stack === graphStack )
					cell.classList.add( "no-lead-in" );
				add( cell ).to( stack );
				if( ignore[ fullName ] ) {
					cell.classList.add( "no-lead-out" );
					if( links.neededBy[ fullName ] &&
						Object.keys( links.neededBy[ fullName ] ).length )
						cell.classList.add( "ignored-in" );
					return;
				}
				else {
					ignore[ fullName ] = true;
					let neededBy = links.neededBy[ fullName ];
					if( neededBy ) {
						neededBy = Object.keys( neededBy );
						if( neededBy.length ) {
							let outgoerStack = getOutgoerStack( cell );
							for( let neededByName of neededBy )
								limnCellNeededBy( outgoerStack, 
									neededByName, ignore, 
									graphStack );
						}
						else cell.classList.add( "no-lead-out" );
					}
				}
			},
			clearGraphLites = ( graphStack ) => {
				let tags = graphStack.getElementsByClassName( "tag" );
				for( let c of tags )
					c.classList.remove( "lit" );
			},
			makeCell = ( name, graphStack ) => {
				/*
					TODO: In a few years, when hardware is more powerful,
					make these detail holders.
				*/
				let cell = make( "div" ),
					intruder = make( "div" ),
					placard = make( "div" ),
						tag = make( "div" ),
					extruder = make( "div" );
				cell.classList.add( "cell" );


				intruder.classList.add( "intruder" );
				add( make( "div" ) ).to( intruder );
				add( make( "div" ) ).to( intruder );
				add( intruder ).to( cell );

				placard.classList.add( "placard" );
				tag.classList.add( "tag" );
				write( name ).to( tag );
				tag.classList.add( "tag-" + name );
				tag.onmouseover = () => {
					clearGraphLites( graphStack );
					let thisCells = graphStack.getElementsByClassName( "tag-" + name );
					for( let c of thisCells )
						c.classList.add( "lit" );
				}
				tag.onmouseout = () => { clearGraphLites( graphStack ); }
				if( links.missings[ name ] )
					tag.classList.add( "missing" );
				else tag.onclick = () => {
					elementsByName[ name ].tabElement.onclick();
				}

				add( tag ).to( placard );
				add( placard ).to( cell );

				extruder.classList.add( "extruder" );
				add( make( "div" ) ).to( extruder );
				add( make( "div" ) ).to( extruder );
				add( extruder ).to( cell );

				return cell;
			},
			getIngoerStack = cell => {
				let stack = cell.firstChild;
				if( ! stack.classList.contains( "stack" ) ) {
					stack = make( "div" );
					stack.classList.add( "stack" );
					cell.insertBefore( stack, cell.firstChild );
				}
				return stack;
			},
			getOutgoerStack = cell => {
				let stack = cell.lastChild;
				if( ! stack.classList.contains( "stack" ) ) {
					stack = make( "div" );
					stack.classList.add( "stack" );
					add( stack ).to( cell );
				}
				return stack;
			},
			addNeedsGraph = fullName => {
				let stack = make( "div" );
				stack.classList.add( "stack" );
				stack.classList.add( "block" );
				stack.classList.add( "no-lead-in" );
				limnCellNeeds( stack, fullName, {}, stack );
				elementsByName[ fullName ].needsGraphElement = stack;
			},
			addNeededByGraph = fullName => {
				let stack = make( "div" );
				stack.classList.add( "stack" );
				stack.classList.add( "block" );
				stack.classList.add( "no-lead-out" );
				limnCellNeededBy( stack, fullName, {}, stack );
				elementsByName[ fullName ].neededByGraphElement = stack;
			},
			expand = ( ar, node ) => {
				for( let a of ar ) {
					//add the label for this thingy
					let name = a[ 0 ],
						li = make( "div" ),
						liLabel = make( "div" ),
						fullName = a[ 2 ] || false;
					
					liLabel.classList.add( "menu-entry" );
					write( name ).to( liLabel );
					add( liLabel ).to( li );
					add( li ).to( node );

					//if this thing is a type,
					//	build out its page and activate the link
					if( fullName && fullName.category === "outline" ) {
						fullName = fullName.fullName;
						elementsByName[ fullName ] = {
							nameElement: null,
							parametersElement:null,
							tabElement: null,
							acceptedByElement: null,
							returnedByElement: null,
							referencedInElement: null,
							referencesElement: null
						}

						let liSummaryLabel = make( "span" ),
							summary = getDetail( fullName );
						liLabel.classList.add( "detailHolder" );
						liLabel.classList.add( "horizontal" );
						liSummaryLabel.innerHTML = summary;
						liSummaryLabel.classList.add( "detail" );
						add( liSummaryLabel ).to( liLabel );

						if( links.needMissing[ fullName ] )
							liLabel.classList.add( "needs-missing" );

						let outlineTab = makeTab( fullName );
						outlineTab.id = "tab-link:" + fullName;
						elementsByName[ fullName ].tabElement = outlineTab;

						liLabel.onclick = e => {
							if( liLabel.getClientRects()[ 0 ].width > e.offsetX ) {
								outlineTab.onclick();
								buildPanel.scrollIntoView();
							}
							else {
								if( e.preventDefault )
									e.preventDefault();
								if( e.stopPropagation )
									e.stopPropagation();
							}
						}

						let nameBanner = make( "div" );
						nameBanner.classList.add( "name" );
						write( fullName ).to( nameBanner );
						elementsByName[ fullName ].nameElement = nameBanner;

						//add the outline's description, if any
						let descEl = make( "div" ),
							desc = LimnaryDescriptions[ fullName ] || "(No description.)";
						descEl.classList.add( "description" );
						descEl.innerHTML = 
							`file: "${(urls[ fullName ]||"")}"<br>` +
							desc;
						elementsByName[ fullName ].descriptionElement = descEl;

						//show the details
						listDetails( fullName )

						if( links.outlines[ fullName ] ) {
							listSupports(
								fullName, 
								"outlines", //supportHigh
								"acceptedBy", //supportLow
								"acceptedByElement", //elementName
								"Accepted as a parameter by: ", //label message
								"(Not accepted as a parameter by anything.)", //noLabelMessage
								{ message: " (as parameter \"${info}\")", asSuffix:true }
							);

							listSupports(
								fullName, 
								"outlines", //supportHigh
								"returnedBy", //supportLow
								"returnedByElement", //elementName
								"Returned by: ", //label message
								"(Not returned by anything.)", //noLabelMessage
							);
							
							listSupports(
								fullName, 
								"outlines", //supportHigh
								"referencedIn", //supportLow
								"referencedInElement", //elementName
								"Referenced in: ", //label message
								"(Not referenced in any other outlines.)", //noLabelMessage
							);

							listSupports(
								fullName, 
								"outlines", //supportHigh
								"references", //supportLow
								"referencesElement", //elementName
								"References: ", //label message
								"(Does not reference any other outlines.)", //noLabelMessage
							);
							
							listSupports(
								fullName, 
								"outlines", //supportHigh
								"listenedBy", //supportLow
								"listenedByElement", //elementName
								"Listened for by event listeners: ", //label message
								"(Is not listened for by any event listeners.)", //noLabelMessage
							);

							listSupports(
								fullName, 
								"outlines", //supportHigh
								"emittedBy", //supportLow
								"emittedByElement", //elementName
								"Emitted as event by: ", //label message
								"(Not emitted as event by anything.)", //noLabelMessage
							);
							
							if( links.needs[ fullName ] ) {
								listSupports(
									fullName, 
									"needs", //supportHigh
									false, //supportLow
									"requiresElement", //elementName
									"Requires: ", //label message
									"(Requires no other limnaries.)", //noLabelMessage
									{ message: " (here called \"${info}\")",
										asSuffix:true }
								)
							}
							
							if( links.neededBy[ fullName ] ) {
								listSupports(
									fullName,
									"neededBy",
									false,
									"requiredByElement",
									"Required: ",
									"(Not required by any other limnary.)",
									{ message: "as \"${info}\" in ",
										asPrefix: true }
								)
							}
						}
					}

					//if this is a limnary
					//	build out its page and activate the link
					else if( fullName && fullName.category === "limnary" ) {
						fullName = fullName.fullName;
						let liSummaryLabel = make( "span" ),
							summary = getDetail( fullName );
						liLabel.classList.add( "detailHolder" );
						liLabel.classList.add( "horizontal" );
						liSummaryLabel.innerHTML = summary;
						liSummaryLabel.classList.add( "detail" );
						add( liSummaryLabel ).to( liLabel );

						if( links.needMissing[ fullName ] )
							liLabel.classList.add( "needs-missing" );

						elementsByName[ fullName ] = {
							nameElement: null,
							parametersElement: null,
							descriptionElement: null,
							tabElement: null,
							codeElement: null,
							requiresElement: null,
							requiredByElement: null,

							acceptedByElement: null,
							returnedByElement: null,
							referencedInElement: null,
							referencesElement: null,

							needsGraphElement: null,
							neededByGraphElement: null
						}

						let methodTab = makeTab( fullName );
						methodTab.id = "tab-link:" + fullName;
						elementsByName[ fullName ].tabElement = methodTab;

						liLabel.onclick = e => {
							if( liLabel.getClientRects()[ 0 ].width > e.offsetX ) {
								methodTab.onclick();
								buildPanel.scrollIntoView();
							}
							else {
								if( e.preventDefault )
									e.preventDefault();
								if( e.stopPropagation )
									e.stopPropagation();
							}
						}
						if( LimnaryDefinitions[ fullName ].done )
							liLabel.classList.add( "done" );
						else if( LimnaryDefinitions[ fullName ].notDone )
							liLabel.classList.add( "not-done" );

						//add the limnary's name for a big, clear banner
						let nameBanner = make( "div" );
						nameBanner.classList.add( "name" );
						write( fullName ).to( nameBanner );
						elementsByName[ fullName ].nameElement = nameBanner;

						//add the limnary's description, if any
						let descEl = make( "div" ),
							urlEl = make( "div" ),
							desc = LimnaryDescriptions[ fullName ] || "(No description.)"
						descEl.classList.add( "description" );
						write( "file: \"" + urls[ fullName ] + "\"" ).to( urlEl );
						add( urlEl ).to( descEl );
						descEl.innerHTML += desc;
						elementsByName[ fullName ].descriptionElement = descEl;

						//add parameters
						listDetails( fullName );

						//add dependencies
						listSupports(
							fullName, 
							"needs", //supportHigh
							false, //supportLow
							"requiresElement", //elementName
							"Requires: ", //label message
							"(Requires no other limnaries.)", //noLabelMessage
							{ message: " (here called \"${info}\")",
								asSuffix:true }
						)
						
						listSupports(
							fullName,
							"neededBy",
							false,
							"requiredByElement",
							"Required: ",
							"(Not required by any other limnary.)",
							{ message: "as \"${info}\" in ",
								asPrefix: true }
						)

						if( links.outlines[ fullName ] ) {
							listSupports(
								fullName, 
								"outlines", //supportHigh
								"acceptedBy", //supportLow
								"acceptedByElement", //elementName
								"Accepted as a parameter by: ", //label message
								"(Not accepted as a parameter by anything.)", //noLabelMessage
								{ message: " (as parameter \"${info}\")", asSuffix:true }
							);

							listSupports(
								fullName, 
								"outlines", //supportHigh
								"returnedBy", //supportLow
								"returnedByElement", //elementName
								"Returned by: ", //label message
								"(Not returned by anything.)", //noLabelMessage
							);

							listSupports(
								fullName, 
								"outlines", //supportHigh
								"referencedIn", //supportLow
								"referencedInElement", //elementName
								"Referenced in: ", //label message
								"(Not referenced in any other outlines.)", //noLabelMessage
							);

							listSupports(
								fullName, 
								"outlines", //supportHigh
								"references", //supportLow
								"referencesElement", //elementName
								"References: ", //label message
								"(Does not reference any other outlines.)", //noLabelMessage
							);
						}

						//add the dependency graph
						if( links.needs[ fullName ] &&
							Object.keys( links.needs[ fullName ] ).length )
							addNeedsGraph( fullName );
						if( links.neededBy[ fullName ] &&
							Object.keys( links.neededBy[ fullName ] ).length )
							addNeededByGraph( fullName );

						//add the limnary's factory method code
						let methodCode = LimnaryDefinitions[ fullName ].factory.toLocaleString(),
							codeView = make( "code" );
						write( methodCode ).to( codeView );
						elementsByName[ fullName ].codeElement = codeView;
						
					}
					else {
						liLabel.classList.add( "non-linking");
					}

					//if there are children, add a UL and list them
					if( a[ 1 ].length ) {
						let ul = make( "div" );
						ul.classList.add( "sub-menu" );
						add( ul ).to( li );
						expand( a[ 1 ], ul );
					}
				}
			};

		//add the stylesheet if we're on the main page
		if( usingPopupWindow === false ) {
			let uberContainer = make( "div" );
			documentNodeOrFocus.appendChild( uberContainer );
			uberContainer.attachShadow( { mode: 'open' } );
			documentNodeOrFocus = uberContainer.shadowRoot;

			let styleElement = document.createElement( "style" );
			styleElement.setAttribute( "type", "text/css" );
			styleElement.innerHTML = cssData;
			documentNodeOrFocus.appendChild( styleElement );
		}
		
		//add the main box that holds everything
		let container = make( "div" );
		container.classList.add( "limn-explore" );
		add( container ).to( documentNodeOrFocus );

		//add the menu
		let menuList = make( "div" );
		menuList.classList.add( "menu" );
		add( menuList ).to( container );

		//populate the menu from loaded limnaries
		expand( treeArray, menuList );

		//add the build control panel
		let buildPanel = make( "div" );
			buildPanel.classList.add( "build-panel" );
			let buildLink = make( "a" );
			buildLink.innerText = "Download: (not built yet)";
			add( buildLink ).to( buildPanel );

		let buildButton = make( "input" );
			buildButton.setAttribute( "type", "button" );
			buildButton.value = "Build";
			buildButton.classList.add( "build-button" );
			add( buildButton ).to( buildPanel );

		let buildNamer = make( "input" );
			buildNamer.setAttribute( "type", "text" );
			buildNamer.setAttribute( "placeholder", LimnAlias );
			buildNamer.setAttribute( "value", LimnAlias );
			write( "Build Name: " ).to( buildPanel );
			add( buildNamer ).to( buildPanel );

		let buildVersioner = make( "input" );
			buildVersioner.setAttribute( "type", "text" );
			buildVersioner.setAttribute( "placeholder", "version" );
			buildVersioner.setAttribute( "value", buildVersion );
			write( "Build Version: " ).to( buildPanel );
			add( buildVersioner ).to( buildPanel );

		let buildGlobalizer = make( "input" );
			buildGlobalizer.setAttribute( "type", "text" );
			buildGlobalizer.setAttribute( "placeholder", LimnAlias );
			buildGlobalizer.setAttribute( "value", LimnAlias );
			write( "Global function: " ).to( buildPanel );
			add( buildGlobalizer ).to( buildPanel );

		//activate the control panel's build button
		var currentURL;
		buildButton.onclick = ()=>{
			let name = buildNamer.value || "untitled",
				version = buildVersioner.value || "0",
				globalName = buildGlobalizer.value || LimnAlias,
				fileText = useArchaicJS ?
					ArchaicBuild( globalName ) :
					BriefBuild( globalName ), //build the limnaries! :-)
				blob = new Blob( [ fileText ], { type: "text/application-x" } ),
				fileName = `${name}.${version}.js`;

			if( currentURL ) window.URL.revokeObjectURL( currentURL );
			currentURL = window.URL.createObjectURL( blob );

			buildLink.innerText = `Download: ${fileName}`;
			buildLink.download = fileName;
			buildLink.href = currentURL;
		}
		add( buildPanel ).to( container );

		//add the panel for showing code etc.
		let panel = make( "div" );
		panel.classList.add( "panel" );
		add( panel ).to( container );

		//add the tabs row for open references
		let tabsRow = make( "div" );
		tabsRow.classList.add( "tabs" );
		add( tabsRow ).to( panel );

		//add the main info block for showing code
		let mainBlock = make( "div" );
		mainBlock.classList.add( "main" );
		add( mainBlock ).to( panel );

		if( focus ) {
			elementsByName[ focus.replace( /\//g, "." ) ].tabElement.onclick();
		}
	}

	window[ LimnAlias ].source = true;

	if( useGlobalizer ) {
		( async () => {
			await Limn( LimnAlias );
			window.dispatchEvent( new Event( LimnAlias ) );
		} )();
	}

	/* Yes... this is a css file in a js file. :-/
	It was the only way I could find to load CSS into
	a popped-out window without breaking the file:// protocol,
	which is vital to a friendly development experience. */
	var cssData = `
	.limn-explore {
		font-family:'Source Sans Pro', Arial, Helvetica, sans-serif;
		font-size:10pt;
		--back-color-lit:rgb(220,233,255);
		--back-color:rgb(250,253,255);
		--bright-back-color:rgb(255,255,255);
	
		--normal-text-color:rgb(0,10,20);
		--light-text:rgb(100,100,100);
		--lighter-text:rgb(180,180,180);
	
		--colored-text-primary:rgb(0,150,255);
		--colored-text-primary-dark:rgb(0,45,135);
		--colored-text-secondary:rgb(100,0,0);
		--colored-text-tertiary:rgb(0,110,30);
		--colored-text-quaternary:rgb(255,45,0);
		--colored-text-highlight:rgb(255,240,30);
	
		--light-link:var(--colored-text-primary-dark);
		--dark-link:var(--colored-text-primary);
		
		--link-hem:var(--dark-link);
	
		--panel-color:rgb(240,240,240);
		--panel-border:rgb(110,110,120);
	
		color:var(--normal-text-color);
		background-color: var(--back-color);
		display:grid;
		grid-template-areas:
			"bild main"
			"menu main";
		grid-template-columns: auto 1fr;
		grid-template-rows: auto auto;
		position:absolute;
		left:0px;
		top:0px;
		right:0px;
	}
	.limn-explore > .build-panel {
		grid-area:bild;
		border:1px solid black;
		display:flex;
		flex-direction:column;
		justify-content: flex-start;
		align-items:stretch;
		padding:1rem;
	}
	.limn-explore .build-panel input[type=text] {
		border:1px solid black;
		padding:0.25rem;
		background-color:white;
		color:var(--normal-text-color);
	}
	.limn-explore .build-panel input {
		margin-bottom:0.5rem;
		font-family:Iosevka, 'Iosevka Web', 'Courier New', Courier, monospace;
	}
	.limn-explore .build-panel a {
		color: var(--normal-text-color);
		text-decoration: none;
		font-size:1.025rem;
	}
	.limn-explore .build-panel a[href] {
		color: var(--colored-text-primary-dark);
		text-decoration: underline;
	}
	.limn-explore .build-panel a[href]:hover {
		color: var(--colored-text-primary);
	}
	.limn-explore .build-panel .build-button {
		background-color: var(--colored-text-primary-dark);
		color:white;
		font-size:1.025rem;
		border:1px solid var(--colored-text-primary);
		border-radius:0;
		padding:0.5rem 0;
		margin-top:0.5rem;
		cursor:pointer;
	}
	.limn-explore .build-panel .build-button:hover {
		background-color: var(--colored-text-primary);
	}
	.limn-explore > div.menu,
	.limn-explore > div.sub-menu {
		grid-area:menu;
		list-style:none;
		padding:1rem;
		margin:0;
		margin-top:0.25rem;
	}
	.limn-explore div.sub-menu {
		overflow:visible;
		margin-left:1rem;
		border-left:1px solid var(--link-hem);
	}
	.limn-explore div.menu div.menu-entry {
		overflow:visible;
		border-left:4px solid rgba(0,0,0,0);
		padding:0.25rem;
		margin:0;
		color:var(--light-link);
		display:inline-block;
		position:relative;
	}
	.limn-explore div.menu div.menu-entry:hover {
		border-left:4px solid var(--link-hem);
		cursor:pointer;
		color:var(--dark-link);
	}
	.limn-explore div.menu div.menu-entry.non-linking {
		color:var(--normal-text-color);
		font-weight:normal;
	}
	.limn-explore div.menu div.menu-entry.non-linking:hover {
		border-left:4px solid rgba(0,0,0,0);
		cursor:default;
		color:var(--normal-text-color);
		font-weight:normal;
	}
	.limn-explore .missing:before,
	.limn-explore div.menu .needs-missing:before {
		content: "! ";
	}
	.limn-explore .missing,
	.limn-explore div.menu .needs-missing {
		background-color:var(--colored-text-highlight);
	}
	
	.limn-explore .panel {
		background-color: var(--panel-color);
		grid-area:main;
		box-shadow:5rem 0 10rem -10rem var(--panel-border) inset;
		padding:1rem;
		display:flex;
		flex-direction:column;
		justify-content:stretch;
		align-items:stretch;
	}
	.limn-explore .panel > .tabs {
		flex-grow:0;
		height:2rem;
		padding:0.25rem;
		display:flex;
		flex-direction:row;
		justify-content:flex-start;
		align-items:stretch;
	}
	.limn-explore .panel > .tabs > div {
		box-shadow:0 0 0 1px var(--panel-border);
		background-color:var(--panel-color);
		min-width:5rem;
		margin-right:calc( 0.25rem + 1px );
		padding:0 1rem;
		position:relative;
		display:flex;
		justify-content:center;
		align-items:center;
		cursor:pointer;
	}
	.limn-explore .panel > .tabs > div:hover {
		background-color: var(--back-color);
	}
	.limn-explore .panel > .tabs > div > .x {
		height:100%;
		width:2rem;
		display:flex;
		flex-direction:column;
		justify-content:center;
		align-items:center;
		margin-right:-1rem;
		cursor:pointer;
		font-weight:100;
		color:var(--panel-border);
	}
	.limn-explore .panel > .tabs > div > .x:hover {
		color:var(--dark-link);
	}
	.limn-explore .panel > .tabs > div.active {
		background-color:var(--back-color);
		height:calc( 100% + ( 0.25rem + 1px ) );
		box-shadow:0 -1px 0 0 var(--panel-border),
			-1px 0 0 0 var(--panel-border),
			1px 0 0 0 var(--panel-border);
		position:relative;
		z-index:10000;
		cursor:default;
	}
	.limn-explore .panel > .main {
		flex-grow:1;
		border:1px solid var(--panel-border);
		background-color:var(--back-color);
		padding:1rem;
		font-size:1rem;
	}
	
	.limn-explore .panel > .main > .dependency {
		flex-grow:0;
		padding:0;
		margin-bottom:1rem;
		margin-top:2rem;
		display:flex;
		flex-direction:row;
		justify-content:flex-start;
		align-items:flex-start;
		flex-wrap:wrap;
		position:relative;
	}
	
	.limn-explore .panel > .main > .dependency > .label {
		position:absolute;
		left:0;
		top:-1.25rem;
		height:1rem;
	}
	.limn-explore .panel > .main > .dependency > div.dependency-list {
		margin:0;
		margin-top:0.25rem;
		padding:0;
		padding-top:0.5rem;
	}
	.limn-explore .dependency-entry {
		border:1px solid var(--panel-border);
		padding:0.25rem;
		margin-right:0.5rem;
		margin-bottom:0.5rem;
		white-space:nowrap;
		display:inline-block;
	}
	.limn-explore .dependency-entry > span {
		font-weight:100;
	}
	.limn-explore .panel code {
		padding:1rem;
		font-family:Iosevka, 'Iosevka Web', 'Courier New', Courier, monospace;
		font-weight:400;
		display:block;
		white-space:pre;
		border:1px solid var(--panel-border);
		-webkit-tab-size:1;
		-moz-tab-size:1;
		tab-size:1;
		flex-grow:1;
	}
	
	.limn-explore .panel > .main > .name {
		font-size:1.618rem;
	}
	.limn-explore .panel > .main > .description {
		font-size:1.125rem;
		margin:1rem 0;
		padding:1rem;
		border:1px solid var(--panel-border);
	}
	.limn-explore .panel > .main > .parameters {
		font-family: Iosevka, 'Iosevka Web', 'Courier New', Courier, monospace;
		font-size:1rem;
		margin-top:0.5rem;
		display:flex;
		flex-direction:row;
		justify-content:flex-start;
		align-items:flex-end;
	}
	.parameters > span,
	.parameters > div > span {
		color:var(--lighter-text);
		font-style:italic;
		font-weight:bold;
		display:block;
		margin:0 0.5rem;
		white-space:nowrap;
	}
	.parameters > div,
	.parameters > div > p {
		display:flex;
		flex-direction:row;
		justify-content:center;
		align-items:flex-end;
		margin:0;
		position:relative;
	}
	.parameters > div > p > span {
		margin:0 0.25rem;
	}
	.limn-explore .dependency-entry .detailHolder {
		color:var(--colored-text-primary-dark);
		font-weight:400;
	}
	.limn-explore .detailHolder.done:before {
		content:"✓";
		color:rgb(0,185,0);
	}
	.limn-explore .detailHolder.not-done:before {
		content:"!";
		color:rgb(185,55,0);
	}
	.limn-explore .detailHolder {
		color:var(--colored-text-primary-dark);
		cursor:pointer;
		position:relative;
		text-decoration: underline solid var(--colored-text-primary-dark);
		margin-right:1.8rem !important;
	}
	.limn-explore .detailHolder.primitive:hover,
	.limn-explore .detailHolder.primitive {
		cursor:default;
		color:var(--normal-text-color);
		text-decoration: none;
	}
	.limn-explore .detailHolder:hover {
		color:var(--colored-text-primary);
		text-decoration: underline var(--colored-text-primary);
	}
	.limn-explore .summary {
		color:var(--normal-text-color);
		font-family:Iosevka, 'Iosevka Web', 'Courier New', Courier, monospace;
		border:1px solid var(--panel-border);
		padding:1rem;
		white-space: nowrap;
	}
	.limn-explore .summary .detail,
	.limn-explore .detail {
		color:var(--normal-text-color);
		font-family:Iosevka, 'Iosevka Web', 'Courier New', Courier, monospace;
		border:1px solid var(--panel-border);
		background-color: var(--back-color);
		padding:0.25rem;
		box-shadow:0 0 0.5rem 0 var(--panel-border);
		white-space: nowrap;
		display:none;
	}
	.limn-explore .summary div,
	.limn-explore .detail div {
		color:var(--normal-text-color);
		padding-left:0.5rem;
		border:0;
		border-left:1px dashed var(--panel-border);
		margin:0.05rem;
	}
	.limn-explore .summary div.wrap,
	.limn-explore .detail div.wrap {
		border-left:0;
		padding-left:0;
		display:inline;
		white-space:normal;
	}
	.limn-explore .summary i,
	.limn-explore .detail i {
		color: var(--colored-text-tertiary);
		font-style:italic;
		display:inline-block;
		margin:0 0.25rem;
	}
	.limn-explore .summary b,
	.limn-explore .detail b {
		color: var(--colored-text-primary);
		font-weight:400;
		font-style:italic;
		display:inline-block;
		margin:0 0.25rem;
	}
	.limn-explore .summary em,
	.limn-explore .detail em {
		color: var(--colored-text-quaternary);
		font-weight:400;
		font-style:italic;
		display:inline-block;
		margin:0 0.25rem;
		white-space:nowrap;
	}
	.limn-explore .summary span,
	.limn-explore .detail span {
		background-color: var(--colored-text-highlight);
		display:inline-block;
		margin:0 0.25rem;
	}
	.limn-explore .detailHolder:hover > .detail {
		display:block !important;
		position:absolute;
		z-index:10000000;
	}
	.limn-explore .detailHolder.horizontal:before,
	.limn-explore .detailHolder.vertical:before {
		content:' ';
		border:1px solid var(--colored-text-primary-dark);
		border-radius:0.625rem;
		border-bottom-left-radius:0;
		transform:rotate(45deg);
	}
	.limn-explore .detailHolder.horizontal:before,
	.limn-explore .detailHolder.horizontal:after {
		top:0.05rem !important;
		height:1.125rem;
		width:1.125rem;
	}
	.limn-explore .detailHolder.horizontal:after,
	.limn-explore .detailHolder.vertical:after {
		content:'i';
		right:-1.7rem !important;
		font-size:1rem;
	}
	.limn-explore .detailHolder.horizontal:before,
	.limn-explore .detailHolder.horizontal:after,
	.limn-explore .detailHolder.vertical:before,
	.limn-explore .detailHolder.vertical:after {
		font-style:italic;
		text-decoration:none;
		display:flex;
		flex-direction:column;
		justify-content:center;
		align-items:center;
		height:1.25rem;
		width:1.25rem;
		color:black;
		position:absolute;
		right:-1.8rem;
		top:-0rem;
		color:var(--colored-text-primary-dark);
	}
	.limn-explore .detailHolder.vertical:hover > .detail {
		top:110%;
		left:0;
	}
	.limn-explore .detailHolder.horizontal:hover > .detail {
		left:110%;
		top:0;
	}

	/* Graph */
	.limn-explore div.cell {
		color:var(--colored-text-primary-dark);
		display:flex;
		flex-direction:row;
		justify-content:stretch;
		align-items:stretch;
		flex-grow:1;
		min-height:1.75rem;
	}
	.limn-explore div.stack > div.cell:first-child {
		padding-top:0.5rem;
	}
	.limn-explore div.stack > div.cell:last-child {
		padding-bottom:0.5rem;
	}
	.limn-explore div.stack.block.no-lead-out,
	.limn-explore div.stack.block.no-lead-in {
		align-items:center;
	}
	.limn-explore div.stack.block.no-lead-out > div.cell,
	.limn-explore div.stack.block.no-lead-in > div.cell {
		flex-grow:0;
	}
	.limn-explore div.stack.block.no-lead-out > div.cell > div.stack:last-child,
	.limn-explore div.stack.block.no-lead-in > div.cell > div.stack:first-child {
		flex-grow:0;
	}
	.limn-explore div.stack.block {
		padding:1rem;
		border:1px solid var(--panel-border);
		margin-bottom:4rem;
	}
	.limn-explore div.stack {
		display:flex;
		flex-direction:column;
		justify-content:stretch;
	}
	.limn-explore div.cell > div.stack:first-child {
		flex-grow:1;
		align-items:flex-end;
	}
	.limn-explore div.cell > div.stack:last-child {
		flex-grow:0;
		align-items:flex-start;
	}
	.limn-explore div.cell > div.stack:last-child > div.cell,
	.limn-explore div.cell > div.stack:last-child > div.cell > div.intruder {
		flex-grow:1;
	}
	.limn-explore div.cell > div.stack:last-child > div.cell > div.extruder:last-child,
	.limn-explore div.cell > div.intruder:first-child {
		flex-grow:1;
	}
	.limn-explore div.cell > div.stack:last-child > div.cell > div.extruder > div {
		border-right:0;
	}
	.limn-explore div.cell > div.stack:last-child > div.cell > div.intruder:first-child {
		display:flex;
	}
	.limn-explore div.cell > div.stack:last-child > div.cell > div.intruder:first-child > div {
		border-left:1px solid var(--panel-border);
	}
	.limn-explore div.cell > div.stack:last-child > div.cell:last-child > div.intruder:first-child > div:last-child,
	.limn-explore div.cell > div.stack:last-child > div.cell:first-child > div.intruder:first-child > div:first-child {
		border-left:0;
	}

	.limn-explore div.intruder:after {
		content:">";
		position:absolute;
		right:0;
		top:0;
		height:100%;
		line-height:100%;
		display:flex;
		flex-direction:column;
		justify-content:center;
		align-items:flex-end;
	}
	.limn-explore div.cell.no-lead-in > div.intruder:after {
		display:none;
	}
	.limn-explore div.intruder,
	.limn-explore div.extruder {
		position:relative;
		min-width:1rem;
		display:flex;
		flex-direction:column;
		justify-content:stretch;
		align-items:stretch;
		flex-grow:0;
	}
	.limn-explore div.intruder > div {
		flex-grow:1;
	}
	.limn-explore div.extruder > div {
		flex-grow:1;
		border-right:1px solid var(--panel-border);
	}
	.limn-explore div.intruder > div:first-child,
	.limn-explore div.extruder > div:first-child {
		border-bottom:1px solid var(--panel-border);
	}
	.limn-explore div.stack > div.cell:last-child > div.extruder > div:last-child,
	.limn-explore div.stack > div.cell:first-child > div.extruder > div:first-child {
		border-right:0;
	}
	.limn-explore div.cell.no-lead-in > div.intruder > div,
	.limn-explore div.cell.no-lead-out > div.extruder > div {
		display:none;
	}
	.limn-explore div.cell.ignored-in.no-lead-out > div.extruder > div,
	.limn-explore div.cell.ignored-out.no-lead-in > div.intruder > div {
		display:block;
	}
	.limn-explore div.cell.ignored-in.no-lead-out > div.extruder > div:first-child,
	.limn-explore div.cell.ignored-out.no-lead-in > div.intruder > div:first-child {
		border-bottom:2px dotted var(--panel-border);
	}

	.limn-explore div.placard {
		display:flex;
		flex-direction:column;
		justify-content:center;
		align-items:center;
	}
	.limn-explore div.tag.missing:before {
		content:"! ";
	}
	.limn-explore div.tag.missing {
		background-color:var(--colored-text-highlight);
	}
	.limn-explore div.tag.lit {
		background-color:var(--back-color-lit);
		color:var(--colored-text-primary);
		cursor:pointer;
		border:1px solid var(--colored-text-primary);
	}
	.limn-explore div.tag.missing.lit {
		background-color:var(--colored-text-highlight);
		cursor:default;	
	}
	.limn-explore div.tag {
		background-color:var(--bright-back-color);
		color:var(--colored-text-primary-dark);
		border:1px solid var(--panel-border);
		padding:0.125rem 0.25rem;
	}
	.limn-explore div.cell.ignored-out > div.placard > div.tag:before,
	.limn-explore div.cell.ignored-in > div.placard > div.tag:after {
		content: "...";
	}
	.limn-explore div.cell.ignored-in > div.placard > div.tag,
	.limn-explore div.cell.ignored-out > div.placard > div.tag {
		background-color:var(--panel-color);
	}
	`;
} )();
