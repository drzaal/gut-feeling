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

	/**
	 * Consider an incoming X,Y pair, with an origin located at the Top Left corner
	 * of a square, in which an equilateral triangle is inscribed, such that the width
	 * of each vertex is equal to the length of the containing square, and the triangle
	 * is situated against the bottom length of the square, flush with the edge.
	 * Given these bounds, we will convert the incoming X,Y coordinates to a corresponding
	 * location on the triangle and from there determine a location from a cross section of
	 * 3 dimensional color space
	 */

	self.cart2color = function ( x, y ) {


		var center = new vector2( self.center.x, self.center.y );
		var u = new vector2( x, y );

		var r_point = new vector2( 0, 0 );
		var g_point = new vector2( self.bounds.width/2, self.bounds.height );
		var b_point = new vector2( self.bounds.width, 0 );

		var r_v2 = vector2.sub( center, r_point ).normal();
		var g_v2 = vector2.sub( center, g_point ).normal();
		var b_v2 = vector2.sub( center, b_point ).normal();

		var u_r_v2 = vector2.sub( u, r_point );
		var u_g_v2 = vector2.sub( u, g_point );
		var u_b_v2 = vector2.sub( u, b_point );

		var r = 1 - u_r_v2.dot( r_v2 ) / self.bounds.height;
		var g = 1 - u_g_v2.dot( g_v2 ) / self.bounds.height;
		var b = 1 - u_b_v2.dot( b_v2 ) / self.bounds.height;

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
			"y" : self.bounds.width / 2 * ( root3_3 ) 
		}
		self.rgb = { "r": 0, "g": 0, "b": 0 };

		self.click({ // Call once to center our Deedly.
			target: self.html,
			clientX: self.html.offset().left + self.center.x,
			clientY: self.html.offset().top + self.bounds.height - self.center.y
		}); 

		// Assign event handlers
		self.html.click( self.click );
		self.ui_elmt.click(false);

	}

	/**
	 * Control element via the click or touch behavior
	 * Turn a click into a request to place the knob at the new rgb value
	 * and set the current rgb
	 */
	self.click = function ( event ) {
		var bound_y;
		var $this = $(event.target);
		var this_pos = $this.offset();
		var input_pos = {
			"x" : event.clientX - this_pos.left, 
			"y" : this_pos.top + self.bounds.height - event.clientY // Position from BOTTOM
		};

		bound_y = root3_2 * ( self.bounds.width - Math.abs( self.center.x - input_pos.x ));
		if ( input_pos.y > bound_y ) {
			input_pos.y = bound_y;
		}
		self.rgb = self.cart2color( input_pos.x, input_pos.y );

		self.ui_elmt.x = input_pos.x - self.ui_elmt.width()/2;
		self.ui_elmt.y = self.bounds.height - input_pos.y - self.ui_elmt.height()/2;
		
	}
	self.update = function() {
		self.ui_elmt.css({ left: self.ui_elmt.x+"px", top : self.ui_elmt.y+"px" });
	}

	self.render = function() {
	}

	self.init( args );
};
