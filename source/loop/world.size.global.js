SpriteWeave( "loop/world.size.global", {
	imports: {
		"getGlobal": "loop/world.get.global",
	},
	parameters: [ "size:SW.num.rect*" ],
	factory: () => {
		return clip => {
			const global = imports.getGlobal();

			//set the clip data for rendering to screen
			global.clip = {
				w: clip.x2 - clip.x,
				h: clip.y2 - clip.y
			};
		}
	}
})