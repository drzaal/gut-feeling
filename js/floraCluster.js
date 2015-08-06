/**
 * Represents one full 'species' of flora.
 */
var FloraCluster = function( args) {
	var self = this;
	self.name = args.name;
	self.triple_point = args.triple_point; // Triple point is the ideal growth environment for bacteria.
	self.idealness = 0;
	self.grow_rate = 0.5;
	self.die_rate = 0.1;
	self.grow_timer = 1;
	self.die_timer = 1;
	self.collection = [];

	/* Delta t is our time differential for the update loop */
	self.update = function( delta_t ) {
		self.collection.forEach( function( flora ){ flora.update( delta_t ); });

		self.grow_timer -= delta_t;
		self.die_timer -= delta_t;

		if ( self.grow_timer <= 0 ) { self.generate_flora(); }
		if ( self.die_timer <= 0 ) { self.die_flora(); }
	};

	// Generate a new Organism
	self.generate_flora = function() {
		self.grow_timer = 1 / ( self.grow_rate * Math.pow( Math.E, self.idealness ));
		if (self.collection.length >= intestine.pop_max) { return; }
		var new_flora = new Flora( game.stage, { X: 200, Y: 400 } )
		self.collection.push( new_flora );

	}
	// Extinguish an Organism
	self.die_flora = function() {
		self.die_timer = 1 / self.die_rate;
		if ( self.collection.length <= 0 ) { return; }
		self.collection[0].remove();
		self.collection.splice( 0, 1 );
	}
}

// Maybe I'll set this up so that we can call our flora Factory from here. I dunno.
FloraCluster.generateFloraAt = function( event, args ){ 
	return new Flora( game.stage, event, args );	
};

// This shouldn't be a static value, but should come from a config file. Too lazy.
FloraCluster.growth_rate = 0.5;
FloraCluster.die_rate = 0.15;
