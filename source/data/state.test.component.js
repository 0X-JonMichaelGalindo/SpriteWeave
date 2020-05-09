SpriteWeave( "data/state.test.component", {
	parameters: [ "t:SW.state.component*" ],
	returns: "SW.state.name*|null",
	factory: () => {
		return t => {
			if( t[ "sprite-weave-version" ] )
				return "state";
			else if( t.poses )
				return "sheet";
			else if( t.frames )
				return "pose";
			else if( t[ "frame-duration" ] )
				return "frame";
			else if( t.layers )
				return "layer"; //meta-layer
			else if( t.image )
				return "layer"; //image-layer
			else if( t.cells )
				return "image";
			else if( t.rect )
				return "cell";
			else if( t.color )
				return "material";
			else return null;
		}
	}
} )