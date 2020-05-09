SpriteWeave( "dom/drop.add", {
	imports: {
		"getDrag": "data/drag.get",
		"getUtils": "dom/utils.get",
	},
	parameters: [
		"target:HTML.Element*",
		"id:string",
		"dragType:string"
	],
	factory: () => {
		const undrag = state => {
			const sd = Array.from( 
				document.getElementsByClassName( "drop" ) 
			);
			for( let dr of sd ) 
				dr.classList.remove( "drop" );
			state.id = null;
			state.type = null;
		}

		return ( target, id, dragType ) => {
			const { style, unstyle } = imports.getUtils(),
				state = imports.getDrag(),
				showDrop = e => { 
					if( state.type === dragType &&
						state.id !== id ) {
						//e.preventDefault
						//declares droppability
						//(why so obfuscated?):
						e.preventDefault(); 
						style( "drop", target );
					} },
				hideDrop = () => {
					unstyle( "drop", target )
				},
				doDrop = () => {
					hideDrop();
					if( state.type === dragType &&
						state.id !== id ) {
						console.log( 
							"Do command MOVE: ", 
							state.id,
							id
						)
					}
				},
				startDrag = () => {
					state.id = id;
					state.type = dragType;
				},
				stopDrag = () => undrag( state ),
				evs = {
					"dragover": showDrop,
					"dragenter": showDrop,
					"dragexit": hideDrop,
					"drop": doDrop,
					"dragstart": startDrag,
					"dragend": stopDrag
				};

			target.setAttribute( 
				"draggable", 
				"true" 
			);

			for( let e in evs )
				target.addEventListener(
					e, evs[ e ]
				);
		}
	}
} );