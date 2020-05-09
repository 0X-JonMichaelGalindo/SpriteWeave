SpriteWeave( "dom/show.frame", {
    imports: {
        "getStateMenu": "dom/menu.get.state",
        "getToolsMenu": "dom/menu.get.tools",
        "getTree": "data/state.tree.sheets.get",
        "makeTree": "dom/tree.add",
        "domConfigUseFrame": "dom/menu.use.frame",
        "getFrameMenu": "dom/menu.get.frame",
    },
    parameters: [ "target:any" ],
    factory: () => {
        return targetFrame => {
            const { getStateMenu,
                    getToolsMenu,
                    getTree,
                    makeTree,
                    domConfigUseFrame,
                    getFrameMenu,
                    focus
                } = imports;

            //state -> top menu
            document.getElementById( "top" ).
                appendChild( 
                    getStateMenu().element
                );
            //tools -> right menu
            document.getElementById( "right" ).
                appendChild( 
                    getToolsMenu().element
                );

            //tree:frame-lit -> tree
            const stateTree = getTree( [ targetFrame ] ),
                    domTree = makeTree( 
                        stateTree, 
                        id => console.log( id ) 
                    );
            document.getElementById( "tree" ).
                appendChild( 
                    domTree 
                );
            //showFrameTree( targetFrame );

            //activate frame-config: frame
            domConfigUseFrame( targetFrame );

            //frame-config -> config
            document.getElementById( "config" ).
                appendChild( 
                    getFrameMenu().element
                );
        }
    }
},
"Set the UI menus, screen canvas, tree, and config menus to focus a target."
 )