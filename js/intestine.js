/* Just going to handle the gut flora here for now. Don't process anything else */
var Intestine = function() {
	var self = this;
	self.deleted = false; // I dunno how else to deregister my objects;
	self.update = function( delta_t ) {


	};
	game.register_controller( self );
};
