# SpriteWeave
A work in progress.
Build sprite sheets from modular components.

# How does it work?
Components are stored as rectangular cells in PNG images.  
Adding new components to an existing modular sprite sheet is as easy as editing a component PNG in (GIMP, PhotoShop, Aseprite, etc.), then adding it to the sheet.  
Sharing components for known sheets is as easy as sharing a PNG.  
Once components are mixed and remixed, sprite sheets can be exported for use in a game engine.

# Installation

Clone the repository and launch index.html to see the current state of the editor in action. 

SpriteWeave's built version (independent of LimnJS) does not exist yet, although it could easily be created. Pre-build performance is significantly worse, so the final version of SpriteWeave can be expected to run much faster and with far less memory.

Note that if you launch SpriteWeave with the file:// protocol, and if you then open a JSON file, the outline feature will fail. (This is because page canvases are considered "dirty" once foreign content enters the JS scope, so their pixel values cannot be read to generate an outline). Launching from a server, including over /localhost, resolves this issue.

# State of Progress
Much of the ground-work has been built, including:

- data structure / format  
- HTML/CSS/JS for UI layout  
    (+bonus: rough-draft icon stand-ins)
- UI/UX structure for layers  
- purely serializable state changes  
    (for undo/redo. +bonus: savable undo/redo)
- rendering pipes for modular sprites  
    (+bonus: a fancy and useful outline algorithm)
- animation & preview pipes
- some canvas UI work started

All the modules written so far are flexible and easy to expand, which makes the path to the goal as straight-forward as possible.  
For example, the same rendering algorithm handles the main screen and the preview. It can display either static frames or animations, in rows or in grids, and it runs off a flat, pre-built array rather than traversing the layer tree every pass. It can eventually be configured to display the per-file sheets preview, per-sheet poses preview, and per-pose frame-row preview.  

That said, much remains to be done.

# Purpose

The primary purpose of SpriteWeave is to provide a break-testing and use-testing environment for LimnJS. Developing an app of this scale highlights any shortcomings and exposes unexpected behaviors in LimnJS, which is then developed concurrently.

Nevertheless, the convenience of sprite modules in plug-and-play PNG form is a novel and useful feature in its own right. This means that, even once SpriteWeave has fulfilled its purpose as a test-bed for LimnJS, it might enjoy a satisfying afterlife.

# License
Copyright 2020 Jon Michael Galindo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
