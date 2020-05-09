SpriteWeave( "dom/menu.get.imagelayer", {
	imports: {
		"makeMenu": "dom/template.fill"
	},
	returns: "SW.html.templates.filled*",
	factory: () => {
		let imagelayerMenu = null,
			nameTemplate = {
				"node": "li",
				templates: [ {
					"node": "input",
					"type": "text",
					"value": "Testing ImageLayer",
					"placeholder": "Layer Name",
					"onblur": () => {
						//save name
					},
					"onkeydown": e => {
						//if "esc", cancel rename
					},
				} ]
			},
			treeTemplate = {
				"node": "li",
				"style": "tall",
				templates: [
					{
						"node": "label",
						"innerText": "Source"
					},
					{
						"node": "div",
						"innerText": "{Imaginary Tree!}"
					}
				]
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
					treeTemplate,
					duplicateTemplate,
					xTemplate,
					yTemplate,
					deleteTemplate,
				]
			},
			navTemplate = {
				"id": "menu-configure-imageLayer",
				"node": "nav",
				"templates": [ menuTemplate ],
			};
		return () => {
			if( imagelayerMenu === null ) {
				imagelayerMenu =
					imports.makeMenu( 
						navTemplate
					);
			}
			return imagelayerMenu;
		}
	}
} )