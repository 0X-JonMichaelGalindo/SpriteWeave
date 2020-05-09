SpriteWeave( "dom/menu.get.tools", {
	imports: {
		"makeMenu": "dom/template.fill"
	},
	returns: "SW.html.templates.filled*",
	factory: () => {
        let toolsMenu = null,
            makeTool = i => ( {
				"node": "li",
                templates: [ {
                    "node": "a",
                    "onclick": () => {},
                    templates: [ {
                        "node": "i",
                        "style": "icon",
                        "setBack": n => 
                            n.style.backgroundImage = 
                                `var(--icon-${i})`
                    } ]
                } ]
            } ),
            zoomIn = makeTool( "zoom-in" ),
			zoomOut = makeTool( "zoom-out" ),
			zoomAll = makeTool( "zoom-all" ),
			zoomThis = makeTool( "zoom-this" ),
			raise = makeTool( "raise" ),
			lower = makeTool( "lower" ),
			flipH = makeTool( "flip-h" ),
			flipV = makeTool( "flip-v" ),
			rCW = makeTool( "rotate-cw" ),
			rCCW = makeTool( "rotate-ccw" ),
			menuTemplate = {
				"node": "ul",
				"style": "thin",
				templates: [
					zoomIn,
					zoomOut,
					zoomAll,
					zoomThis,
					raise,
					lower,
					flipH,
					flipV,
					//rCW,
					//rCCW,
				]
			},
			navTemplate = {
				"id": "menu-use-tools",
				"node": "nav",
				"templates": [ menuTemplate ],
			};
		return () => {
			if( toolsMenu === null ) {
				toolsMenu =
					imports.makeMenu( 
						navTemplate
					);
			}
			return toolsMenu;
		}
	}
} )