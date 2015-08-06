/* Just going to handle the gut flora here for now. Don't process anything else */
var Intestine = function() {
	var self = this;
	self.deleted = false; // I dunno how else to deregister my objects;
	self.pop_max = 100; // Maximum number of bacteria we can have.
	self.phase_rgb = { r:0, g:0, b:0 };
	self.flora_cluster_collection = [];

	self.update = function( delta_t ) {
		var i, imax = self.flora_cluster_collection.length;
		for ( i=0; i<imax; i++ ) {
			 
			self.flora_cluster_collection[i].update( delta_t );
		}

		

	};
};
var intestine = new Intestine();
