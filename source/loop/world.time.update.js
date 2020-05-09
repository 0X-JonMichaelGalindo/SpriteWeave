SpriteWeave( "loop/world.time.update", {
    imports: {
        "getTime": "loop/world.get.time",
        "getStats": "loop/world.get.stats",
    },
    parameters: [ "t:number" ],
    factory: () => {
        return t => {
            const time = imports.getTime(),
                stats = imports.getStats();

			if( time.t === null )
                time.t = t;
                
            time.frame = 
                parseInt( 
                    t / 
                    stats.framerate 
                );

            const dt = 
                ( t - time.t ) ||
                stats.fps;

            time.dt = dt;
            
			stats.dt =
				( stats.dt * 
				( 1 - stats.frameFade ) ) +
                ( dt * stats.frameFade );
                
			stats.fps = 
                parseInt( 1000 / dt );
                
        }
    }
} )