SpriteWeave( "loop/loop", {
	imports: {
		"loop": "loop/loop",
		"getTime": "loop/world.get.time",
		"updateTime": "loop/world.time.update",
		"renderUI": "loop/world.render.ui",
		"renderScreen": "loop/world.render.screen",
	},
	parameters: [ "t:number" ],
	factory: () => {
		return t => {
			const {
				loop,
				getTime,
				updateTime,
				renderUI,
				renderScreen
				} = imports;

			const time = getTime();

			if( time.looping ) {
				window.requestAnimationFrame( loop );
			}
			
			//record time statistics
			updateTime( t );

			//update the global
			renderUI( time.frame );

			//update the preview

			//update the screen
			renderScreen();

		}
	}
})