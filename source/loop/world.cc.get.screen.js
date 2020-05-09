SpriteWeave( "loop/world.cc.get.screen", {
	imports: {
		"getWorld": "loop/world.get",
	},
	returns: "SW.num.point*",
	factory: () => {
		return ( x,y ) => {
			const world = imports.getWorld(),
				w = parseInt( world.cnv.width / 2 ),
				h = parseInt( world.cnv.height / 2 ),
				z = world.zoom;
			return {
				x: w + z.x + x*z.s,
				y: h + z.y + y*z.s
			}
		}
	}
}, 
"Convert global coordinates to screen coordinates."
);