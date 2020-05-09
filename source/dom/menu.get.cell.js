SpriteWeave( "dom/menu.get.cell", {
	imports: {
		"makeMenu": "dom/template.fill"
	},
	returns: "SW.html.templates.filled*",
	factory: () => {
		let cellMenu = null,
			nameTemplate = {
				"node": "li",
				templates: [ {
					"node": "input",
					"type": "text",
					"value": "Testing Cell",
					"placeholder": "Cell Name",
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
			coordTemplates = [
				{
					"node": "input",
					"type": "button",
					"value": "-",
					"onclick": () => {}
				},
				{
					"node": "input",
					"type": "text",
					"value": "0",
					"onblur": () => {
						//save coord
					},
					"onkeydown": () => {
						//if "esc", cancel change coord
					}
				},
				{
					"node": "input",
					"type": "button",
					"value": "+",
					"onclick": () => {}
				},
			],
			xTemplate = {
				"node": "li",
				templates: [ 
					{
						"node": "label",
						"innerText": "X",
					},
					...coordTemplates
				]
			},
			yTemplate = {
				"node": "li",
				templates: [ 
					{
						"node": "label",
						"innerText": "Y",
					},
					...coordTemplates
				]
			},
			x2Template = {
				"node": "li",
				templates: [ 
					{
						"node": "label",
						"innerText": "X2",
					},
					...coordTemplates
				]
			},
			y2Template = {
				"node": "li",
				templates: [ 
					{
						"node": "label",
						"innerText": "X2",
					},
					...coordTemplates
				]
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
					xTemplate,
					yTemplate,
					x2Template,
					y2Template,
					deleteTemplate,
				]
			},
			navTemplate = {
				"id": "menu-configure-cell",
				"node": "nav",
				"templates": [ menuTemplate ],
			};
		return () => {
			if( cellMenu === null ) {
				cellMenu =
					imports.makeMenu( 
						navTemplate
					);
			}
			return cellMenu;
		}
	}
} )