SpriteWeave( "dom/menu.get.pose", {
	imports: {
		"makeMenu": "dom/template.fill"
	},
	returns: "SW.html.templates.filled*",
	factory: () => {
		let poseMenu = null,
			nameTemplate = {
				"node": "li",
				templates: [ {
					"node": "input",
					"type": "text",
					"value": "Testing Pose",
					"placeholder": "Pose Name",
					"onblur": () => {
						//save name
					},
					"onkeydown": e => {
						//if "esc", cancel rename
					},
				} ]
			},
			duplicateTemplate = {
				"node": "li",
				templates: [ {
					"node": "a",
					"innerText": "Duplicate",
					"href": "javascript:void(0)",
					"onclick": () => {},
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
				"id": "menu-configure-pose",
				"node": "nav",
				"templates": [ menuTemplate ],
			};
		return () => {
			if( poseMenu === null ) {
				poseMenu =
					imports.makeMenu( 
						navTemplate
					);
			}
			return poseMenu;
		}
	}
} )