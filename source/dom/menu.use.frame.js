SpriteWeave( "dom/menu.use.frame", {
	imports: {
		"getMenu": "dom/menu.get.frame",
		"getName": "data/state.name.get",
		"bid": "data/hub.bid",
	},
	parameters: [ "frame:any" ],
	factory: () => {
		return frame => {
			const menu =  imports.getMenu(),
				menuUL = menu.templates[ 0 ],
				fullName = imports.getName( frame ),
					splitName = fullName.split( ">" ),
					name = splitName.pop(),
					prefix = splitName.join( ">" ) + ">",
				nameLI = menuUL.templates[ 0 ],
					nameInput = nameLI.templates[ 0 ].element,
				duplicateLI = menuUL.templates[ 1 ],
					duplicateButton = duplicateLI.templates[ 0 ].element;
				//deltMenu = menu.templates[ 0 ].templates[ 2 ];

			//bind namer
			//set initial
			nameInput.value = frame.name;
			//onblur
			nameInput.onblur = () => {
				const res = imports.bid( {
					"bid": "rename",
					"old-name": fullName,
					"new-name": prefix + nameInput.value
				} );
				if( res !== true ) {
					//display some alert
					//reset name input value
					nameInput.value = name;
				}
			}
			//on escape, on enter

			//bind duplicater
			duplicateButton.onclick = () => {
				window.console.log( "Bidding duplicate..." );
				imports.bid( { 
					"bid": "duplicate", 
					"source-name": fullName 
				} );
			}

			//bind deleter
		}
	}
} )