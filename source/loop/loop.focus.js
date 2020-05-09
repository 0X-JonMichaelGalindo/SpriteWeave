SpriteWeave( "loop/loop.focus", {
	imports: {
		"getView": "loop/world.get.view",
		"test": "data/state.test.component",

		"focusSheets": "loop/loop.focus.sheets",
		"focusSheet": "loop/loop.focus.sheet",
		"focusPose": "loop/loop.focus.pose",
		"focusFrame": "loop/loop.focus.frame",
		"focusLayer": "loop/loop.focus.layer",

		"focusImages": "loop/loop.focus.images",
		"focusImage": "loop/loop.focus.image",
		"focusCell": "loop/loop.focus.cell",
	},
	parameters: [
		"focus:SW.state.component*"
	],
	factory: () => {
		return focus => {
			const {
					getView,
					test,

					focusSheets,
					focusSheet,
					focusPose,
					focusFrame,
					focusLayer,

					focusImages,
					focusImage,
				} = imports,
				view = getView(),
				focusType = test( focus );

			//build the flat render zone
			if( focusType === "state" ) {
				if( view.tab === "sheets" )
					focusSheets( focus );
				else if( view.tab === "images" )
					focusImages( focus );
			}
			else if( focusType === "sheet" )
				focusSheet( focus );
			else if( focusType === "pose" )
				focusPose( focus );
			else if( focusType === "frame" ) {
				focusFrame( focus );
			}
			else if( focusType === "layer" )
				focusLayer( focus );
			else if( focusType === "image" )
				focusImage( focus );
			else if( focusType === "cell" )
				focusCell( focus );
		}
	}
} );