/**
 * Generalized animation class for javascript web games.
 * Contains an Actor, Animation, and a Spritesheet
 * Actor is the container representation for a rendering object
 * Animation is an individual defined animation.
 * Spritesheet represents a mapped resource from which animations are built
 * Fails if jquery is not set
 */

var hayao = hayao || {};

/**
 * Animation object.
 * Contains information about the animation of a gameactor
 */
hayao.Animation = function () {
    // Eventually implement sprites and spritesheets. NOT NOW.
    this.name = '';
    this.frames = []; // My thought is that these would be a duration and a call to a sprite
    this.playhead = 0;
    this.duration = 0;
    this.period = 0.5; // Duration of single frame
    this.timer = 0;
    this.spritesheet;
    var self = this;

    // I should have this REFER to a spritesheet. That's the ticket!
    this.update = function (delta_t) {
        if (self.frames.length <= 1) {
            return;
        } // Skip if we don't have to animate.
        self.timer += delta_t / self.period;
        if (self.timer >= self.duration) {
            self.timer = self.timer - self.duration;
            self.playhead = 0;
        }
        self.playhead = Math.floor(self.timer);
    };

    this.render = function () {
        return self.spritesheet.keyframes[self.frames[self.playhead]];
    };

    /**
     * A wiggle is a sinusoidal position xy translation
     */
    this.wiggle = function () {
        var tmptheta = this.render();
        var x_imgoffset = 32 * (this.playhead % 9);
        var y_imgoffset = 64 * (this.playhead / 9);
        this.html.css({
            'background-position-y': y_imgoffset + 'px',
            /* Flair */
            'background-position-x': x_imgoffset + 'px' /* Flair */
        });
    };

    /**
     * Keyframe selects an image from a spritesheet
     */
    // this.key

    /**
     * A wobble is a sawtooth rotation of a sprite along an anchor point
     */
    this.wobble = function () {
        var tmptheta = this.render();
        this.html.css({
            'background-position-y': this.png_offset + 'px',
            /* Flair */
            '-webkit-transform': 'rotate(' + tmptheta + 'deg)',
            /* Safari */
            '-moz-transform': 'rotate(' + tmptheta + 'deg)',
            /* Firefox */
            '-ms-transform': 'rotate(' + tmptheta + 'deg)',
            /* IE */
            '-o-transform': 'rotate(' + tmptheta + 'deg)',
            /* Opera */
            'filter': 'progid:DXImageTransform.Microsoft.BasicImage(rotation=1)',
            /* Internet Explorer */
            'zoom': 1,
        });

    }
}

hayao.Animation.copy = function (Animation) {
    var tmpanim = new hayao.Animation();
    tmpanim.name = Animation.name;
    tmpanim.spritesheet = Animation.spritesheet;
    tmpanim.duration = Animation.duration;
    tmpanim.frames = Animation.frames;
    tmpanim.playhead = 0;

    return tmpanim;
}

/**
 * Generate a new animation
 */
hayao.Animation.create = function (name, atlas, keyframes, callback, opts) {
    var tmpanim = new hayao.Animation();
    tmpanim.name = name;
    tmpanim.spritesheet = atlas;
    tmpanim.duration = keyframes.length;

    if (callback == undefined) {
        tmpanim.frames = keyframes;
    } else {
        tmpanim.frames = callback(keyframes);
    }
    tmpanim.playhead = 0;

    return tmpanim;
}

/**
 * An Atlas contains the original object and behavior for the Sprite Atlas
 */
hayao.Spritesheet = function () {
    this.atlas = {}; // Atlas is supposedly a reference to the Full sprite image resource
    this.keyframes = []; // An indexed array of Sprite keyframes, which the animations will reference.
    var self = this;
}

// Create a new atlas. If we are using an external library, rely on a callback to handle the new atlas.
hayao.Spritesheet.create = function (resource, callback) {
    var spritesheet = new hayao.Spritesheet();
    if (callback) {
        spritesheet.atlas = callback(resource);
    } else {
        spritesheet.atlas = resource;
    }
    return spritesheet;
}

/**
 * Turns a sprite atlas into a set of keyframes
 */
hayao.Spritesheet.prototype.mapAtlas = function (width, height, process, offset_x, offset_y) {
    var keyframes = [];
    var i, j, imax, jmax;
    if (offset_x === undefined) {
        offset_x = 0;
    }
    if (offset_y === undefined) {
        offset_y = 0;
    }

    imax = Math.min((this.atlas.width - offset_x) / width);
    jmax = Math.min((this.atlas.height - offset_y) / height);

    for (j = 0; j < jmax; j++) {
        for (i = 0; i < imax; i++) {
            console.log(i, j);
            this.keyframes.push(process(this.atlas, offset_x + width * (i), offset_y + height * (j), width, height));
        }
    }
    return keyframes;
}

/**
 * Polygonal mapping of a Spritesheet
 * Creates an array of mapped tiles which are defined by poly shapes.
 * Don't use this.
 * Takes a set of points.
 */
hayao.Spritesheet.prototype.mapPoly = function (polys, process) {
    var keyframes = [];
    var poly = [];

    for (i = polys.length; i > 0; i--) {
        poly = polys[i - 1];

        this.keyframes.push(process(this.atlas, poly));
    }
    return keyframes;
}

/**
 * Actor Class
 * Actor class contains a set of member animations, as well as manages the active animation and state.
 */
hayao.Actor = function () {
    this.animations = {};
    this.active_animation = null;
    this.container = null;
    this.width = 64;
    this.height = 64;
}

/**
 * Create a new actor
 */
hayao.Actor.create = function () {
    var actor = new hayao.Actor();

    return actor;
}

/**
 * Process the updates
 */
hayao.Actor.prototype.update = function (delta_t) {
    var animation = this.animations[this.active_animation];
    animation.update(delta_t);
}

/**
 * Render the animation
 */
hayao.Actor.prototype.render = function () {
    this.container.texture = this.animations[this.active_animation].render();
    this.container.width = this.width;
    this.container.height = this.height;
    return this.container;
}


/**
 * We're going to see if we can hijack the screen refresh here.
 */
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60);
        }
})();
