var gutFeeling = gutFeeling || {};

/**
 * Biome inhabitants of the gut.
 * @param PIXI.Stage stage. This is where our sprite is going to end up displaying
 */
var Flora = gutFeeling.Flora = function (stageAdd, type, event, args) {
    var self = this;
    self.sluggishness = Math.random() * 16;

    self.pos = new vector2(0, 0);

    self.actor = hayao.Actor.create();
    
    console.log(type);
    self.actor.animations['main'] = hayao.Animation.copy( Flora.type[type] );
    self.actor.active_animation = 'main';

    self.actor.width = 64;
    self.actor.height = 64;

    self.actor.x = event.X;
    self.actor.y = event.Y;

    self.velocity = {
        x: 0,
        y: 0
    };

    self.path_percent = 0;
    self.actor.container = {};
    stageAdd(self.actor.container = new PIXI.Sprite());
    self.actor.render();

    // This part isn't going to work, that's for sure.

    self.update = function (delta_t) {
        self.actor.update(delta_t);
        self.actor.container.anchor.x = 0.5;
        self.actor.container.anchor.y = 0.5;
        self.path_percent += (40 + self.sluggishness) * delta_t;

        // if (self.actor.path_percent > 100) { self.actor.path_percent = 0; }
        // var path_bias = pathPercent2Cart( self.actor.path_percent, game.gastro_vertices );
        // self.actor.x += (path_bias.x - self.actor.x) / 20;
        // self.actor.y += (path_bias.y - self.actor.y) / 20;

        if (self.path_percent > 100) {
            var drift = {
                r: Math.random() * 128,
                theta: Math.random() * 2 * Math.PI
            };
            self.velocity.x += drift.r * Math.cos(drift.theta);
            self.velocity.y += drift.r * Math.sin(drift.theta);
            self.path_percent = 0;
        }
        self.velocity.x *= 0.98;
        self.velocity.y *= 0.98;

        var sBounds = game.getBounds();

        self.velocity.x += 0.85 * (sBounds.stageW / 2 - self.actor.x) * delta_t;
        self.velocity.y += 0.85 * (sBounds.stageH / 2 - self.actor.y) * delta_t;

        self.actor.x += self.velocity.x * delta_t;
        self.actor.y += self.velocity.y * delta_t;
        
        self.actor.container.x = self.actor.x;
        self.actor.container.y = self.actor.y;

        self.actor.container.rotation += 0.1;
        self.actor.render();
    };
    
    self.render = function () {
        self.actor.render(); 
    }

    self.remove = function () {
        game.stageRemove(self.actor.container);
    }

};

// Extend the atlas


// DON'T DO THIS, DUMMY
$(function () {

    PIXI.loader
        .add('ill', 'img/ill_00.png')
        .load(function (loader, resources) {
            Flora.texture_main = resources['ill'].texture; //PIXI.Texture.fromImage('img/ill_00.png');
            Flora.type = [];

            Flora.spritesheet = hayao.Spritesheet.create(Flora.texture_main);
            Flora.spritesheet.mapAtlas(128, 128,
                function (atlas, x1, y1, x2, y2) {
                    console.log(x1,y1,x2,y2);
                    return new PIXI.Texture(atlas, new PIXI.Rectangle(x1, y1, x2, y2));
                });
            Flora.type['ecoli'] = hayao.Animation.create('ecoli', Flora.spritesheet, [0, 6]);
            Flora.type['stephalo'] = hayao.Animation.create('stephalo', Flora.spritesheet, [1, 7]);
            Flora.type['homily'] = hayao.Animation.create('homily', Flora.spritesheet, [2, 8]);
        });
    
    function mapMovieClip(spritesheet, keyframes) {
        var textures = keyframes.map(function(keyframe) {
            return spritesheet.keyframes[keyframe];       
        });
        return new PIXI.MovieClip(textures);
        
    }
});
