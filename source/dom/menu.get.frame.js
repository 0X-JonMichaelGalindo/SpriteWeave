SpriteWeave( "dom/menu.get.frame", {
	imports: {
		"makeMenu": "dom/template.fill"
	},
	returns: "SW.html.templates.filled*",
	factory: () => {
		let frameMenu = null,
			nameTemplate = {
				"node": "li",
				templates: [ {
					"node": "input",
					"type": "text",
					"value": "Testing Frame",
					"placeholder": "Frame Name",
					"onblur": () => {
						//save name, set in dom.menu.use.frame
					},
					"onkeydown": e => {
						//if "esc", cancel rename
						//if "enter", blur
						//set in dom.menu.use.frame
					},
				} ]
			},
			duplicateTemplate = {
				"node": "li",
				templates: [ {
					"node": "a",
					"innerText": "Duplicate",
					"href": "javascript:void(0)",
					"onclick": () => {
						//duplicate, set in dom.menu.use.frame
					},
				} ]
			},
			deleteTemplate = {
				"node": "li",
				templates: [ {
					"node": "a",
					"innerText": "Delete",
					"style": "warn",
					"href": "javascript:void(0)",
					"onclick": () => {},
				} ]
			},
			menuTemplate = {
				"node": "ul",
				"style": "tall",
				templates: [
					nameTemplate,
					duplicateTemplate,
					deleteTemplate,
				]
			},
			navTemplate = {
				"id": "menu-configure-frame",
				"node": "nav",
				"templates": [ menuTemplate ],
			};
		return () => {
			if( frameMenu === null ) {
				frameMenu =
					imports.makeMenu( 
						navTemplate
					);
			}
			return frameMenu;
		}
	}
} )