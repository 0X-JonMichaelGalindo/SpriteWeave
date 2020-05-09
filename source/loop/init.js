SpriteWeave( "loop/init", {
	imports: {
		"importJSON": "data/state.import-json",
		"buildRender": "data/state.render.build",
		"getState": "data/state.get",
		"getWorld": "loop/world.get",
		"getScreen": "loop/world.get.screen",
		"getPointers": "controls/ui.pointers.get",
		"domAddPointers": "dom/pointers.add",
		"domShowFrame": "dom/show.frame",
		"focus": "loop/loop.focus",
		"loop": "loop/loop",
	},
	isAsync: true,
	factory: () => {
		return async () => {
			const {
				importJSON,
				buildRender,
				getState,
				getWorld,
				getScreen,
				getPointers,
				domAddPointers,
				domShowFrame,
				focus,
				loop
			} = imports;

			//TESTING: load test data
			await importJSON( window.testDataString );

			//build the flat render state
			buildRender();

			//add pointer functionality to the canvas
			const screen = getScreen(),
				{ start,
					move,
					stop
				} = getPointers();
			domAddPointers( 
				screen.cnv, 
				start,
				move,
				stop
			);

			//TESTING: expose state and world
			window.state = getState();
			window.world = getWorld();

			//TESTING: show the first frame
			const frame = getState().state.sheets[0].poses[0].frames[0];
			domShowFrame( frame );
			focus( frame );

			//start the ui loop
			window.requestAnimationFrame( loop );
		}
	}
} )