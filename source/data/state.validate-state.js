SpriteWeave( "data/state.validate-state", {
	parameters: [ "data:SW.state.state*" ],
    returns: "string|SW.num.true*",
    factory: () => {
		const validation = {
				"file": {
					"sprite-weave-version": { 
						type: "string" 
					},
					"name": { 
						type: "string" 
					},
					"sheets": { 
						type: "array", 
						elements: "sheet" 
					},
					"images": { 
						type: "array", 
						elements: "image" 
					},
				},
				"sheet": {
					"name": { 
						type: "string" 
					},
					"poses": { 
						type: "array", 
						elements: "pose" 
					}
				},
				"pose": {
					"name": { 
						type: "string" 
					},
					"frames": { 
						type: "array", 
						elements: "frame" 
					}
				},
				"frame": {
					"name": { 
						type: "string" 
					},
					"frame-duration": { 
						type: "int" 
					},
					"layers": { 
						type: "array", 
						elements: "layer" 
					}
				},
				"layer": {
					"name": { 
						type: "string" 
					},
					"image": { 
						type: "object", 
						validation: "layer-image" 
					},
					"position": { 
						type: "object", 
						validation: "layer-position" 
					},
				},
				"layer-image": {
					"name": { 
						type: "string" 
					},
					"cell": { 
						type: "string" 
					},
				},
				"layer-position": {
					"x": { 
						type: "int" 
					},
					"y": { 
						type: "int" 
					},
					"mirror": { 
						type: "object", 
						validation: "layer-position-mirror",
						optional: true 
					},
					//"rotate": { type: "angle" },
				},
				"layer-position-mirror": {
					"horizontal": { 
						type: "boolean",
						optional: true 
					},
					"vertical": { 
						type: "boolean",
						optional: true 
					},
				},
				"image": {
					"name": { 
						type: "string" 
					},
					"cells": { 
						type: "array", 
						elements: "image-cell" 
					},
					"materials": {
						type: "array",
						elements: "image-material",
						optional: true
					},
					"data": { 
						type: "string" 
					}
				},
				"image-material": {
					"name": {
						type: "string"
					},
					"color": {
						type: "object",
						validation: "image-color"
					},
					"shades": {
						type: "array",
						elements: "image-color",
						optional: true
					}
				},
				"image-color": {
					"r": {
						type: "byte"
					},
					"g": {
						type: "byte"
					},
					"b": {
						type: "byte"
					}
				},
				"image-cell": {
					"name": { 
						type: "string" 
					},
					"rect": { 
						type: "object", 
						validation: "image-cell-rect" 
					}
				},
				"image-cell-rect": {
					"x": { 
						type: "int" 
					}, 
					"y": { 
						type: "int" 
					},
					"x2": { 
						type: "int" 
					}, 
					"y2": { 
						type: "int" 
					}
				}
			},
			tests = {
				"boolean": b => 
					typeof b === "boolean",
				"string": s => 
					typeof s === "string",
				"byte": n =>
					typeof n === "number" &&
					n === parseInt( n ) &&
					n >= 0 &&
					n <= 255,
				"int": n => 
					typeof n === "number" && 
					! isNaN(n) && 
					n === parseInt( n ),
				"angle": n => 
					n === "Zero" || 
					n === "Ninety" ||
					n === "One-Eighty" || 
					n === "Two-Seventy",
				"object": o => 
					typeof o === "object",
				"array": a => 
					Array.isArray( a ),
			},
			errors = {
				"Missing Field": ( f, t ) =>
					`Field "${f}" is missing from "${t}".`,
				"Invalid Field": ( f, t ) =>
					`"${f}" is not a valid field of "${t}".`,
				"Qualified Invalid Field": ( f, t, tp ) =>
					`Field "${f}" of "${t}" is not a valid "${tp}", 
						because: \n`,
				"Type Mismatch": ( t, f, ttp, tp ) =>
					`"${t}"'s field "${f}" must be type "${ttp}", 
						but found "${tp}".`,
				/*"Invalid Angle": () =>
					`\n"angle" must be one of: 
						- "Zero"
						- "Ninety"
						- "One-Eighty"
						- "Two-Seventy"`,*/
				
			},
			validate = ( o, vname ) => {
				const v = validation[ vname ];
				for( let n in v ) {
					if( ! ( n in o ) ) {
						if( v[ n ].optional === true )
							continue;
						else return errors[
								"Missing Field"
							]( n, vname );
					}
				}
				for( let n in o ) {
					if( ! n in v )
						return errors[
							"Invalid Field"
						]( n, vname );
					else if( tests[ 
							v[ n ].type 
							]( o[n] ) === 
								false 
						) {
						const msg = errors[
								"Type Mismatch"
							]( 
								vname, 
								n, 
								v[ n ].type, 
								o[ n ] 
							)
						/*if( v[ n ].type === "angle" )
							msg += errors[ 
								"Invalid Angle" 
							]();*/
						return msg;
					}
					else if( 
							v[ n ].type === 
							"object" 
						) {
						const error = 
							validate( 
								o[n], 
								v[n].validation 
							);
						if( error !== true ) {
							return errors[
								"Qualified Invalid Field"
							](
								n,
								vname,
								v[ n ].validation
							) + error;
						}
					}
					else if( 
						v[n].type === "array" 
					) {
						let i = 0;
						for( let e of o[ n ] ) {
							const error = 
								validate( 
									e, 
									v[n].elements 
								);
							if( error !== true ) {
								let entryName = "";
								if( e.name ) 
									entryName = 
										` (named "${e.name}")`;
								if( e.image && 
									( e.image.name || 
										e.image.cell ) )
									entryName = 
										` (of image `+
										`"${e.image.name}":`+
										`"${e.image.cell}")`;
								return `Entry ${i}${entryName} of field`+
									` "${n}" of "${vname}" is not a valid`+
									` "${v[n].elements}", because: \n` +
									error;
							}
							++i;
						}
					}
				}
				return true;
			},
			//TODO: Finish moving error messages to error object.
			//TODO: Make name conflict check recursive & automatic.
			checkForNameConflicts = ( arr, category, errorClue ) => {
				const names = new Set();
				for( let e of arr ) {
					if( names.has( e.name ) ) {
						return `The SpriteWeave File was invalid, because multiple ${category}${errorClue} shared the same name: "${e.name}".
							Every entry in ${category}${errorClue} must have a unique name.`;
					}
					else names.add( e.name );
				}
				return true;
			};
			
        return data => {
			const error = validate( data, "file" );
				
			if( error !== true ) {
				return "The SpriteWeave JSON file was invalid, " +
					"because: \n\n" + error;
			}
			else {
				//check for sheet name conflicts
				checkForNameConflicts( 
					data.sheets, 
					"sheets", 
					""
				);
				for( let s of data.sheets ) {
					const sheetClue = 
						` in sheet "${s.name}"`,
						error = checkForNameConflicts( 
							s.poses, 
							"poses", 
							sheetClue
						);
					if( error !== true ) return error;
					else for( let p of s.poses ) {
						const poseClue = 
							`${sheetClue} in pose "${p.name}"`,
							error = checkForNameConflicts( 
								p.frames, 
								"frames", 
								poseClue
							);
						if( error !== true ) return error;
						else for( let f of p.frames ) {
							const frameClue =
								`${poseClue} in frame "${f.name}"`,
								error = checkForNameConflicts( 
									f.layers, 
									"layers", 
									frameClue
								);
							if( error !== true ) return error;
						}
					}
				}

				const imageNames = new Set(),
					cellNames = {};

				//check for image name conflicts
				for( let i of data.images ) {
					const { name: imageName, cells } = i;
					if( imageNames.has( 
							imageName 
						) ) {
						return `The SpriteWeave file was invalid, because multiple images shared the name: "${imageName}".
						Each image entry in a SpriteWeave file must have a unique name.`;
					}
					else {
						imageNames.add( imageName );
						cellNames[ imageName ] = new Set();
						for( let c of cells )
							cellNames[ imageName ].
								add( c.name );
					}
				}

				//check for missing image references
				for( let s of data.sheets ) {
				for( let p of s.poses ) {
				for( let f of p.frames ) {
				for( let l of f.layers ) {
					if( imageNames.has( 
							l.image.name 
						) === false ) {
						return `The SpriteWeave file was invalid, because sheet "${p.name}" -> pose "${p.name}" -> frame "${f.name}" -> layer "${l.name}" required an image name that was not found: "${l.image.name}"`;
					}
					else if( 
						cellNames[ 
							l.image.name 
						].has( 
							l.image.cell 
						) === false ) {
						return `The SpriteWeave file was invalid, because sheet "${p.name}" -> pose "${p.name}" -> frame "${f.name}" -> layer "${l.name}" required image "${l.image.name}" to have a cell name that was not found: "${l.image.cell}"`;
					}
				} } } }

				return true;
			}
        }
    }
} )