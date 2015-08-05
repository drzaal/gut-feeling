/**
 * Biome inhabitants of the gut.
 * @param PIXI.Stage stage. This is where our sprite is going to end up displaying
 */
var Flora = function( stage, event, args ) {
	var self = this;
	
	self.pos = new vector2(0,0);
	self.actor = new PIXI.Sprite( Flora.type['ecoli'] );

	self.actor.width = 64;
	self.actor.height = 64;

	self.actor.anchor.x = 0.5;
	self.actor.anchor.y = 0.5;

	self.actor.position.x = event.originalEvent.offsetX;
	self.actor.position.y = event.originalEvent.offsetY;

	self.actor.path_percent = 0;

	// This part isn't going to work, that's for sure.
	stage.addChild(self.actor);

	self.update = function() {
        sel.actor.path_percent += 0.2;
        var path_bias = pathPercent2Cart( nibble.path_percent );
        self.actor.x += (path_bias.x - self.actor.x) / 20;
        self.actor.y += (path_bias.y - self.actor.y) / 20;
        self.actor.rotation += 0.1;
	};

	self.render = function() {

	};

};
Flora.texture_main = PIXI.Texture.fromImage('img/ill_00.png');
Flora.type = [];
Flora.type['ecoli'] = new PIXI.Texture(tmp_ill_texture, new PIXI.Rectangle(0, 0, 256, 256));
Flora.type['stephalo'] = new PIXI.Texture(tmp_ill_texture, new PIXI.Rectangle(256, 0, 256, 256));
