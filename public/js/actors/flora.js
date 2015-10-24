/**
 * Biome inhabitants of the gut.
 * @param PIXI.Stage stage. This is where our sprite is going to end up displaying
 */
var Flora = function( stage, type, event, args ) {
	var self = this;
	self.sluggishness = Math.random() * 16;
	
	self.pos = new vector2(0,0);
	self.actor = new PIXI.Sprite( Flora.type[ type ]);

	self.actor.width = 64;
	self.actor.height = 64;

	self.actor.anchor.x = 0.5;
	self.actor.anchor.y = 0.5;

	self.actor.x = event.X;
	self.actor.y = event.Y;
	self.actor.position.x = event.X;
	self.actor.position.y = event.Y;

	self.actor.velocity = { x: 0, y: 0};

	self.actor.path_percent = 0;

	// This part isn't going to work, that's for sure.
	game.stage.addChild(self.actor);

	self.update = function(delta_t) {
        self.actor.path_percent += (40 + self.sluggishness) * delta_t;
		
		// if (self.actor.path_percent > 100) { self.actor.path_percent = 0; }
        // var path_bias = pathPercent2Cart( self.actor.path_percent, game.gastro_vertices );
        // self.actor.x += (path_bias.x - self.actor.x) / 20;
        // self.actor.y += (path_bias.y - self.actor.y) / 20;

		console.log("Path percent %s", self.actor.path_percent);
		if (self.actor.path_percent > 100) {
			var drift = {
				r: Math.random() * 128,
				theta: Math.random() * 2 * Math.PI
			};
			console.log("DRIFT r:%s theta:%s", drift.r, drift.theta);
			self.actor.velocity.x += drift.r * Math.cos(drift.theta);
			self.actor.velocity.y += drift.r * Math.sin(drift.theta);
			self.actor.path_percent = 0;
		}
		self.actor.velocity.x *= 0.98;
		self.actor.velocity.y *= 0.98;

		self.actor.velocity.x += 0.85 * (game.stageW/2 - self.actor.x) * delta_t;
		self.actor.velocity.y += 0.85 * (game.stageH/2 - self.actor.y) * delta_t;

        self.actor.x += self.actor.velocity.x * delta_t;
        self.actor.y += self.actor.velocity.y * delta_t;
        self.actor.rotation += 0.1;
	};

	self.remove = function() {
		game.stage.removeChild(self.actor);
	}

};

// Extend the atlas


// DON'T DO THIS, DUMMY
$(function() {
	Flora.texture_main = PIXI.Texture.fromImage('img/ill_00.png');
	Flora.type = [];
	Flora.type['ecoli'] = new PIXI.Texture(Flora.texture_main, new PIXI.Rectangle(0, 0, 128, 128));
	Flora.type['stephalo'] = new PIXI.Texture(Flora.texture_main, new PIXI.Rectangle(128, 0, 128, 128));
	Flora.type['homily'] = new PIXI.Texture(Flora.texture_main, new PIXI.Rectangle(256, 0, 128, 128));
});
