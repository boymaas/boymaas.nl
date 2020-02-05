// needs 2d engine

function canvas2dContext()  {  
    // fetches context of canvas
    var cv = document.getElementById("slutmachine");
    return {'canvas': cv, 'ctx': cv.getContext('2d')};  
    
}  

function Symbol(x, y) {
    Shape.call(this, x, y);
    this.box = this.addChild( new Box(0,0,100,100) );
    this.innerbox = this.box.addChild(new Box(10,10,80,80));

    // let the innerbox wobble
    this.box.addBehaviour(new BehWobble(4,10));
    this.innerbox.addBehaviour(new BehWobble(2,10));
    this.innerbox.addBehaviour(new BehWobble(1,-10));
}

function buildObjectTree() {
    // creates the object tree to be rendered on the canvas
    var c = canvas2dContext();

    // add root shapes
    var canvas = new Canvas(c.canvas, c.ctx);
    canvas.addShape(new Symbol(50, 25));
    canvas.addShape(new Symbol(160, 25));
    canvas.addShape(new Symbol(160, 135));
    canvas.addShape(new Symbol(50, 135));

    return canvas;
}

function renderSlutMachine() {
    slutmachine = buildObjectTree();
    slutmachine.init();
    slutmachine.render();
    slutmachine.run(20);
}
