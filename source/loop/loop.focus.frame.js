SpriteWeave(
	"loop/loop.focus.frame",
	{
		imports: {
			"getView": "loop/world.get.view",
			"getGlobal": "loop/world.get.global",
			"getPreview": "loop/world.get.preview",
			"getRender": "loop/world.get.render",

			"getIndex": "data/state.render.index.get",
			"parent": "data/state.parent.get",
			"getBound": "render/bound.get",
			"sizeCanvas": "loop/world.size.canvas",
			"sizeGlobal": "loop/world.size.global",
			"clipPreview": "dom/preview.clip",
		},
		parameters: [
			"frame:SW.state.sheets.frame*",
		],
		factory: () => {
			return frame => {
				const {
						getView,
						getGlobal,
						getPreview,
						getRender,

						getIndex,
						parent,
						getBound,
						sizeCanvas,
						sizeGlobal,
						clipPreview
					} = imports,
					view = getView(),
					global = getGlobal(),
					preview = getPreview(),
					render = getRender();


				//highlight & focus this frame
				view.focus = frame;
				view.highlight = frame;
				
				//prepare the render targets
				const rndUI = {
						name: "global",
						cnv: global.cnv,
						ctx: global.ctx,
						//define via frame bound
						clip: undefined,
						zones: []
					},
					rndPrv = {
						name: "preview",
						cnv: preview.cnv,
						ctx: preview.ctx,
						//define via animation bounds
						clip: undefined,
						zones: []
					};
				//set the render targets to the world
				render.targets = [
					rndUI,
					rndPrv
				];

				//build the ui frame render
				const frameIndex = getIndex( frame ),
					frameZone = {
						//animation:,
						//coord:,
						indices: [ frameIndex ]
					};
				rndUI.zones.push( frameZone );

				//build the preview animation zones
				const pose = parent( frame, "pose" ),
					poseBound = {
						x:Infinity,
						x2:-Infinity,
						y:Infinity,
						y2:-Infinity
					};

				let poseDuration = 0,
					previewBound = null;

				for( let f of pose.frames ) {
					const frameIndex = getIndex( f ),
						frameBound = getBound( f ),
						frameZone = {
							animation: {
								//total duration set after loop
								modulus: undefined,
								//set start of this frame
								greaterOrEqual: poseDuration,
								//end of this frame set at next frame
								less: undefined
							},
							indices: [ frameIndex ]
						};
					//add zone to render target
					rndPrv.zones.push( frameZone );

					//set end of previous frame
					if( rndPrv.zones.length >= 2 )
						rndPrv.
							zones[ 
								rndPrv.zones.length - 2 
							].animation.less = 
									poseDuration;

					//accumulate animation duration
					poseDuration += frame[ "frame-duration" ];

					//accumulate pose (animation) bounds
					poseBound.x = Math.min( 
							frameBound.x, 
							poseBound.x
						);
					poseBound.x2 = Math.max( 
							frameBound.x2, 
							poseBound.x2
						);
					poseBound.y = Math.min( 
							frameBound.y, 
							poseBound.y
						);
					poseBound.y2 = Math.max( 
							frameBound.y2, 
							poseBound.y2
						);

					if( f === frame ) {
						//save preview frame bound (for centering)
						previewBound = frameBound;

						//set global render rect (for clipping)
						rndUI.clip = frameBound;
					}
				}

				//set end of final frame
				rndPrv.
					zones[ 
						rndPrv.zones.length - 1 
					].animation.less = 
						poseDuration + 1;

				//set total duration for all frames
				for( let z of rndPrv.zones )
					z.animation.modulus = 
						poseDuration;

				//build the static preview frame zone
				//get offset to center within animation preview bounds
				const animWidth = ( poseBound.x2 - poseBound.x ),
					dx = animWidth + ( previewBound.x - poseBound.x ),
					dy = previewBound.y - poseBound.y,
					offset = { dx, dy },
					previewZone = {
						//animation:,
						coord: offset,
						indices: [ frameIndex ]
					};

				//add the static (non-animated) preview zone
				//	to the preview render zones
				rndPrv.zones.push( previewZone );

				//set preview render bounds (for clipping)
				rndPrv.clip = {
					x: poseBound.x,
					y: poseBound.y,
					x2: poseBound.x + animWidth*2,
					y2: poseBound.y2
				}

				//size the global canvas
				sizeCanvas( rndUI.cnv, rndUI.clip );

				//set the global clip-to-screen
				sizeGlobal( rndUI.clip );

				//size the preview canvas
				sizeCanvas( rndPrv.cnv, rndPrv.clip );

				//clip the preview canvas in the dom
				clipPreview( rndPrv.clip );
			}
		}
	}
);