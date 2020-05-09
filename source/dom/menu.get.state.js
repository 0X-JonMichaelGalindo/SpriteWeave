SpriteWeave( "dom/menu.get.state", {
	imports: {
		"makeMenu": "dom/template.fill"
	},
	returns: "SW.html.templates.filled*",
	factory: () => {
        let toolsMenu = null,
            make = ( i, l ) => ( {
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
					}, {
						"node": "label",
						"innerText": l
					} ]
                } ]
            } ),
            openBtn = make( "open", "Open" ),
			saveBtn = make( "save", "Save As" ),
			newBtn = make( "new", "New" ),
			importBtn = make( "import", "Add From" ),
			menuTemplate = {
				"node": "ul",
				"style": "flat",
				templates: [
					openBtn,
					saveBtn,
					newBtn,
					importBtn,
				]
			},
			navTemplate = {
				"id": "menu-use-state",
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