SpriteWeave( "controls/open.file", {
	imports: {
		"getStateString": "data/state.export-json"
	},
	returns: "SW.hub.bids.open*|null",
	isAsync: true,
	factory: () => {
		return () => ( new Promise( 
			( finish, fail ) => {
				const { getStateString } = imports,
					file = document.
					getElementById( 
						"json-uploader" 
					).file[ 0 ];
				if( ! file ) {
					fail( "No File" );
				}
				else {
					const r = new FileReader();
					r.onerror = () => {
						fail( "Unreadable File" );
					};
					r.onload = evt => {
						const bid = {
							"bid": "open",
							"former-state": getStateString(),
							"new-state": evt.target.result
						}
						finish( bid );
					};
					r.readAsText( file );
				}
			}
		) )
	}
} )