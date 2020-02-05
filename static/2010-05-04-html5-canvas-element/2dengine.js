/* Simple rendering engine for shapes
 *
 * Parent child relationships based on minimum of x, y location.
 *
 * Shape is the superclass of all renderable shapes.
 * A shape is capable of rendering itself by calling its draw function
 * and then calling each renderfunction of the child. This will draw and
 * transform the whole tree.
 *
 * Complex objects can be composed by adding children shapes. addChild
 * returns a reference for later manipulation of properties.
 *
 * this.box = this.addChild(new Box(0,0,5,5));
 *
 */
function Canvas(cnvas, context) {
    // canvas abstraction
    this.canvas = cnvas;
    this.ctx = context;

    // root shape managment
    this.shapes = [];

    this.addShape = function (s) {
        this.shapes.push(s)
        s.canvas = this;
    }

    this.init = function () {
        // set starttime
        this.startTime = new Date() * 1;
        this.clear();
    }

    this.clear = function () {
        // clears complete canvas
        this.canvas.width += 0;
    }

    this.render = function () {
        // clear canvas
        this.clear();
        // prep and render root shapes
        for (var i in this.shapes) {
            var sh = this.shapes[i];
            // set state
            sh.init();
            sh.render(this.ctx, this.time());
        }
    }

    this.run = function (framerate) {
        var _this = this;
        this.intervalId = setInterval(function () { 
            _this.render(); 
            }, 1000/framerate);
    }

    this.stop = function () {
        stopInterval(this.intervalId);
    }

    // utility functions
    this.time = function () {
        var d = new Date();
        return d - this.startTime;
    }
}

function Shape(x,y) {
    /* Shape superclass, provides subclasses with nececary methods 
     * to render themselves. Provides basic element of parent child
     * relationships */

    // relative coords
    this.x = x;
    this.y = y;

    // render coords
    this._x = 0;
    this._y = 0;

    // parent child relations
    this.parent = undefined;
    this.children = [];
    this.addChild = function (child) {
        this.children.push(child);
        child.canvas = this.canvas;
        child.parent = this;
        return child;
    }

    this.canvas = undefined;

    // behaviours
    this.behaviours = [];
    this.addBehaviour = function (beh) {
        // called by behaviours to register
        // themselved to a shape
        //
        // load this 
        beh.init(this);
        
        this.behaviours.push(beh);
    }
    this.applyBehaviours = function (time) {
        // render children children
        for (var i in this.behaviours) {
            var behave = this.behaviours[i];
            behave.apply(time);
        }
    }

    this.init = function () {
        // render coords
        this._x = 0;
        this._y = 0;
    }



    this.update = function (time) {
        // apply render logic/transformations
    }

    this.draw = function (ctx) {
        // render elements to canvas
    }

    this.render = function (ctx, time) {
        // update our relative coordinates
        this.applyBehaviours(time);
        this.update(time);

        // add our coords to render pointer
        this._x += this.x;
        this._y += this.y;

        // draw to canvas
        this.draw(ctx);

        // render children children
        for (var i in this.children) {
            var cld = this.children[i];
            // translate child towards parent (this) position
            cld._x = this._x;
            cld._y = this._y;
            cld.render(ctx, time);
        }
    }

    // transformations
    this.moveTo = function (x,y) {
        this.x = x;
        this.y = y;
    }
}

function Box(x, y, width, height) {
    // simple element, just renders a strokeRect
    Shape.call(this, x, y);

    this.width = width;
    this.height = height;

    this.draw = function (ctx) {
        ctx.strokeRect(this._x, this._y, this.width, this.height);
    }
}


// Behaviours
// objects handling specific behaviours
// wobble is an example 
//
//
function toRad(deg) {
     return deg * Math.PI/180;
}

function Behaviour() {
    // Basic methods for a behaviour
    // stores shape in shape and original coords
    this.init = function (s) {
        this.shape = s;
        this.original_x = s.x;
        this.original_y = s.y;
    }

    // apply applies the behaviour .. should
    // be implemented ina specific behaviour
    this.apply = function (time) {
    }
}

function BehWobble(duration,amplitude) {
    // super
    Behaviour.call(this);

    this.wobble = 0;
    this.duration = 1000*duration;
    this.amplitude = amplitude;

    this.apply = function (time) {
        this.shape.x -= this.wobble;
        this.wobble = this.amplitude * Math.sin(toRad(360*((time%this.duration)/this.duration))); 
        this.shape.x += this.wobble;
    }
}
