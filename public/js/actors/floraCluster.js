/**
 * Represents one full 'species' of flora.
 * @param string args.name Defines the flora TYPE for all child elements
 * @param object args.triple_point Ideal growth conditions for this type of flora
 */
var FloraCluster = function( args) {
	var self = this;
	self.name = args.name;
	self.triple_point = args.triple_point; // Triple point is the ideal growth environment for bacteria.
	self.idealness = 0;
	self.grow_rate = 0.5;
	self.nutrition = args.nutrition ? args.nutrition : {r:0,g:0,b:0};
	self.toxicity = args.toxicity ? args.toxicity : 0;
	self.die_rate = 0.055;
	self.grow_timer = 1;
	self.die_timer = 1;
	self.animation_collection = []; // 
	self.spritesheet = {};
	self.collection = [];

	/* Delta t is our time differential for the update loop */
	self.update = function( delta_t, args ) {
		if ( args === undefined ) { args = {}; }

		self.collection.forEach(function( flora ){
			game.getProtein += self.nutrition.r;
			game.getCarb += self.nutrition.g;
			game.getVitamineral += self.nutrition.b;
			flora.update( delta_t );
		});

		self.grow_timer -= delta_t;
		self.die_timer -= delta_t;

		if ( args.phase_change ){ 
			self.idealness = self.triple_point.r * intestine.phase_rgb.r + self.triple_point.g * intestine.phase_rgb.g + self.triple_point.b * intestine.phase_rgb.b;
			self.idealness = self.idealness * 5;
			console.log( self.idealness );
		}

		if ( self.grow_timer <= 0 ) { self.generate_flora(); }
		if ( self.die_timer <= 0 ) { self.die_flora(); }
	};

	// Generate a new Organism
	self.generate_flora = function() {
		self.grow_timer = 1 / ( self.grow_rate * Math.pow( Math.E, self.idealness - 1 ));
		if (self.collection.length >= intestine.pop_max) { return; }
		var rando_offset_x = Math.random() * 75;
		var rando_offset_y = Math.random() * 75;
		var sBounds = game.getBounds();
		var new_flora = new Flora( game.stageAdd, self.name, { X: sBounds.stageW/2+rando_offset_x, Y: sBounds.stageH/2+rando_offset_y } )
		self.collection.push( new_flora );
		intestine.pop_current +=1;

	}
	// Extinguish an Organism
	self.die_flora = function() {
		self.die_timer = 1 / (self.die_rate * Math.sqrt(1 + intestine.pop_current));
		if ( self.collection.length <= 0 ) { return; }
		self.collection[0].remove();
		self.collection.splice( 0, 1 );
		intestine.pop_current -=1;
	}
}

// Maybe I'll set this up so that we can call our flora Factory from here. I dunno.
FloraCluster.generateFloraAt = function( event, args ){ 
	return new Flora( game.stageAdd, event, args );	
};

// This shouldn't be a static value, but should come from a config file. Too lazy.
FloraCluster.growth_rate = 0.5;
FloraCluster.die_rate = 0.15;
