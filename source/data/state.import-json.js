SpriteWeave( "data/state.import-json", {
	imports: {
		"validate": "data/state.validate-state",
		"getState": "data/state.get",
		"makeImage": "data/image.from-data",
		"makeOutline": "render/outline.create",
	},
	parameters: [ "jsonString:string" ],
	returns: "string|SW.num.true*",
	isAsync: true,
	factory: () => {
		const errors = {
			"Invalid Image": n =>
				`The SpriteWeave file was invalid` + 
				`, because image "${n}" could not` +
				` load from the data provided.`
		}

		return async jsonString => {
			const data = JSON.parse( 
						jsonString 
					),
				error = imports.
					validate( 
						data 
					);

			if( error !== true ) {
				return error;
			}
			else {
				//attach real images and create outlines
				for( let i of data.images ) {
					try { 
						i.image = await 
							imports.makeImage( 
								i.data 
							);
					} 
					catch( e ) {
						return errors[ 
							"Invalid Image" 
						]( i.name );
					}
					i.outline = await 
						imports.makeOutline(
							i.image 
						);
				}
				
				imports.getState().state = data;
				return true;
			}
		}
	}
})