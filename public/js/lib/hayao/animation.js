/**
 * Generalized animation class for javascript web games.
 * Fails if jquery is not set
 */

var hayao = hayao || {};

/**
 * Animation object.
 * Contains information about the animation of a gameactor
 */
hayao.Animation = function() {
	// Eventually implement sprites and spritesheets. NOT NOW.
	this.name = '';
	this.frames = []; // My thought is that these would be a duration and a call to a sprite
	this.playhead = 0;
	this.period = 0; // Duration of single frame
	this.timer = 0;
	this.spritesheet;
	var self = this;

	// I should have this REFER to a spritesheet. That's the ticket!
	this.update = function (delta_t) {
		var duration = self.frames.length;
		if (self.frames.length <=1) { return; } // Skip if we don't have to animate.
		self.timer += delta_t / self.period;
		if (self.timer >= self.duration) { 
			self.timer = self.timer - self.duration; 
			self.playhead = 0;
		}
		self.playhead = Math.floor(self.timer);
	};

	this.render = function() {
		return self.frames[self.playhead];
	};

	/**
	 * A wiggle is a sinusoidal position xy translation
	 */
	this.wiggle = function () {
		var tmptheta = this.render();
		var x_imgoffset = 32 * (this.playhead % 9 );	
		var y_imgoffset = 64 * (this.playhead / 9 );
		this.html.css({
			'background-position-y': y_imgoffset+'px', /* Flair */
			'background-position-x': x_imgoffset+'px' /* Flair */
		});
	};

	/**
	 * Keyframe selects an image from a sprite atlas
	 */
	// this.key

	/**
	 * A wobble is a sawtooth rotation of a sprite along an anchor point
	 */
	this.wobble = function () {
		var tmptheta = this.render();
		this.html.css({
			'background-position-y': this.png_offset+'px', /* Flair */
			'-webkit-transform': 'rotate(' + tmptheta + 'deg)', /* Safari */
			'-moz-transform': 'rotate(' + tmptheta + 'deg)', /* Firefox */
			'-ms-transform': 'rotate(' + tmptheta + 'deg)', /* IE */
			'-o-transform': 'rotate(' + tmptheta + 'deg)', /* Opera */
			'filter': 'progid:DXImageTransform.Microsoft.BasicImage(rotation=1)', /* Internet Explorer */
			'zoom': 1,
		});

	}
}

/**
 * Generate a new animation
 */
hayao.Animation.new = function(name, atlas, keyframes, opts) {
	var tmpanim = new hayao.Animation();
	tmpanim.name = name;
	tmpanim.atlas = atlas;
	var chkframes = 1; // Quickly check to make sure we have the appropriate format for the keyframes. Note I'm not checking for ints yet. OOPS!
	// Also reorganize our frames so that we know EXACTLY where we're at.
	for (i=0; i<keyframes.length;i++) {
		if ( isNaN(keyframes[i].length )) { chkframes = 0; }
		else { 
			tmpanim.duration += 1; // keyframes[i][0]; 
		}
	}

	if (chkframes) { // Only assign if valid
		tmpanim.frames = keyframes;
		tmpanim.playhead = 0;
	} 
	return tmpanim;
}

/**
 * A spritesheet contains the original object and behavior for the Sprite Atlas
 */
hayao.Spritesheet = function () {
	this.atlas = {}; // Atlas is supposedly a reference to the Full sprite image resource
	this.keyframes = []; // An indexed array of Sprite keyframes, which the animations will reference.
	var self = this;
}
// Create a new spritesheet. If we are using an external library, rely on a callback to handle the new atlas.
hayao.Spritesheet.create = function( resource, callback ) {
	var spritesheet = new Spritesheet();
	if (callback) { spritesheet.atlas = callback (resource); }
	else { spritesheet.atlas = resource; }
	return spritesheet;
}
/**
 * Turns a sprite atlas into a set of keyframes
 */
hayao.Spritesheet.mapAtlas = function() {
	
}

hayao.Spritesheet.mapAtlas.



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
