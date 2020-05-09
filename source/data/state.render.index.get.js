SpriteWeave( "data/state.render.index.get", {
	imports: {
		"getState": "data/state.get",
	},
	parameters: [
		`focus:
			| SW.state.state*
			| SW.state.sheets.sheet*
			| SW.state.sheets.pose*
			| SW.state.sheets.frame*
		`
	],
	returns: "SW.world.render.index*",
	factory: () => {
		return focus => {
			const ref = imports.getState(),
				state = ref.state,
				flat = ref.render.flat;
			let i = 0,
				si = 0,
				pi = 0,
				fi = 0,
				first = -1,
				last = -1;

			if( state === focus ) first = i;
			seek:
			for( let s of state.sheets ) {
				if( s === focus ) first = i;
				for( let p of s.poses ) {
					if( p === focus ) first = i;
					for( let f of p.frames ) {
						if( f === focus ) first = i;
						const csi = si,
							cpi = pi,
							cfi = fi;
						let sprite = flat[ i ];

						while( true ) {
							if( ! sprite ||
								sprite.sheet !== csi ||
								sprite.pose !== cpi ||
								sprite.frame !== cfi ) {
								break;
							}
							else {
								++i;
								sprite = flat[ i ];
							}
						}

						if( f === focus ) {
							last = i - 1;
							break seek;
						}

						++fi;
					}
					if( p === focus ) {
						last = i;
						break seek;
					}
					++pi;
				}
				if( s === focus ) {
					last = i;
					break seek;
				}
				++si;
			}
			if( state === focus ) last = i;

			return {
				first,
				last
			}
		}
	}
}
)