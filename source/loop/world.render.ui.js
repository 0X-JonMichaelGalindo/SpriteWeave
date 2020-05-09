SpriteWeave( "loop/world.render.ui", {
	imports: {
		"getRender": "loop/world.get.render",
		"render": "render/flat",
	},
	parameters: [
		"f:SW.num.int*",
	],
	factory: () => {
		return f => {
			const {
					getRender,
					render
				} = imports,
				targets = getRender().targets;
			for( let target of targets ) {
				const ctx = target.ctx;
				
				ctx.save();
				ctx.translate(
					-1 * target.clip.x,
					-1 * target.clip.y
				);
				ctx.clearRect(
					0,0,
					target.clip.x2 - target.clip.x,
					target.clip.y2 - target.clip.y
				)
				render( 
					f, 
					ctx, 
					target.zones 
				);
				ctx.restore();
			}
		}
	}
})