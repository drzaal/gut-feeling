/**
 * Represents one full 'species' of flora.
 */
var FloraCluster = function( args) {
	var self = this;
	self.name = args.name;
	self.triple_point = args.triple_point; // Triple point is the ideal growth environment for bacteria.
	self.collection = [];

	/* Delta t is our time differential for the update loop */
	self.update = function( delta_t ) {

	};
}

// Maybe I'll set this up so that we can call our flora Factory from here. I dunno.
FloraCluster.generateFloraAt = function( event, args ){ 
	return new Flora( game.stage, event, args );	
};

// This shouldn't be a static value, but should come from a config file. Too lazy.
FloraCluster.growth_rate = 0.5;
FloraCluster.die_rate = 0.15;
