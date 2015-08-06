/**
 * Tricontroller
 * Interface Object similar to the color wheel picker
 */

var Tricontroller = function ( args ) {
	if ( args === undefined ) {
		args = {};
	}
	var self = this;
	var html, ui_elmt;
	var root3_2 = Math.sqrt(3) / 2;
	var root3_3 = Math.sqrt(3) / 3;
	self.rgb = {
		"r" : 0,
		"g" : 0,
		"b" : 0
	};

	self.square = function( d ) {
		var bounds = {};
		self.bounds.width = d;
		self.bounds.height = d * root3_2;
	}

	self.bounds = {
		"width" : args.width,
		"height" : args.width * root3_2
	};

	self.cart2color = function ( x, y ) {

		// Capture out of bounds selections
		if ( y < Math.abs( root3_2 * self.bounds.width/2 - x ) ) {
			
		}

		var center = new vector2( self.center.x, self.center.y );
		var u = new vector2( x, y );

		var r_point = new vector2( 0, self.bounds.height );
		var g_point = new vector2( self.bounds.width/2, 0 );
		var b_point = new vector2( self.bounds.width, self.bounds.height );

		var r_v2 = vector2.sub( r_point, center ).normal();
		var g_v2 = vector2.sub( g_point, center ).normal();
		var b_v2 = vector2.sub( b_point, center ).normal();

		var u_v2 = vector2.sub( u, center );

		var r = u_v2.dot( r_v2 );
		var g = u_v2.dot( g_v2 );
		var b = u_v2.dot( b_v2 );

		console.log( "rgb %d %d %d", r, g, b );
		return { "r": r, "g": g, "b": b };
	};

	/**
	 * Create and display our triController
	 */
	self.init = function( args ) {
		if ( args === undefined ) {
			args = {};
		}
		var parent_elmt = args.parent ? args.parent : $("body");
		var ui_elmt = $('<div class="ui-control-tripicker"></div>');
		parent_elmt.append( ui_elmt );

		self.html = ui_elmt;

		self.ui_elmt = $('<div class="ui-control-tripicker-knob"></div>');
		self.html.append( self.ui_elmt );

		// Set the dimensions of our control
		if (self.bounds.width == undefined) {
			self.bounds.width = self.html.width();	
		}
		if (self.bounds.height == undefined) {
			self.bounds.height = self.html.height();	
		}
		self.center = {
			"x" : self.bounds.width / 2,
			"y" : self.bounds.height - self.bounds.width * ( root3_3 / 2 ) 
		}
		self.rgb = { "r": 0, "g": 0, "b": 0 };

		self.ui_elmt.x = self.center.x - self.ui_elmt.width()/2;
		self.ui_elmt.y = self.center.y - self.ui_elmt.height()/2;
		// Assign event handlers
		self.html.click( self.click );

	}

	/**
	 * Control element via the click or touch behavior
	 * Turn a click into a request to place the knob at the new rgb value
	 * and set the current rgb
	 */
	self.click = function ( event ) {
		var $this = $(event.target);
		var this_pos = $this.offset();
		var input_pos = {
			"x" : event.clientX - this_pos.left, 
			"y" : event.clientY - this_pos.top };
		self.rgb = self.cart2color( input_pos.x, input_pos.y );

		self.ui_elmt.x = input_pos.x - self.ui_elmt.width()/2;
		self.ui_elmt.y = input_pos.y - self.ui_elmt.height()/2;
		
	}
	self.update = function() {
		self.ui_elmt.css({ left: self.ui_elmt.x+"px", top : self.ui_elmt.y+"px" });
	}

	self.render = function() {
	}

	self.init( args );
};
