SpriteWeave( "data/state.tree.sheets.get", {
	imports: {
		"getState": "data/state.get",
		"getId": "data/state.name.get",
	},
	parameters: [ "targets:SW.state.sheets.selection*"],
	returns: "SW.tree.tree*",
	factory: () => {
		const keys = [ "poses", "frames", "layers" ],
			getDrag = s => {
				if( s.poses )
					return "sheet";
				else if( s.frames ) 
					return "pose";
				else if( s[ "frame-duration" ] ) 
					return "frame";
				else if( s.layers ) 
					return "layer"; //meta-layer
				else if( s.image ) 
					return "layer"; //image-layer
			},
			add = ( s, t, id, targets ) => {
				const sn = {
					"label": s.name,
					"click": true,
					"drag": getDrag( s ),
					"id": id( s ),
					"furl": true,
				}
				let furl = true;

				t.nodes.push( sn );
				for( let k of keys )
					if( k in s ) {
						sn.nodes = [];
						for( let n of s[ k ] ) {
							if( add( n, sn, id, targets ) 
								=== false )
								furl = false;
						};
						break;
					}
				
				if( furl === false ||
					targets.has( s ) ) {
					sn.furl = false;
					return false;
				}
				else return true;
			}

		return targets => {
			const sheets = 
					imports.
						getState().
						state.
						sheets,
				tree = {
					"label": "sheets",
					"furl": false,
					"nodes": []
				};
			targets = new Set( targets );
			
			for( let s of sheets ) 
				add( 
					s, 
					tree, 
					imports.getId,
					targets
				);

			return tree;
		}
	}
})