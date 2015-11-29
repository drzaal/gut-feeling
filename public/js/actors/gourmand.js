'use strict';
var gutFeeling = gutFeeling || {};

var Gourmand = gutFeeling.Gourmand = function Gourmand() {
	var self = this;    
    
    this.torso;
    this.head;
};
Gourmand.create = function create(stageAdd, bounds, args) {
    // is scale established here, or is it not needed?
    //var bounds = gutFeeling.Game.getBounds();
	var stageW = bounds.stageW, stageH = bounds.stageH;
    var gourmand = new gutFeeling.Gourmand();

	gourmand.torso = new PIXI.Sprite(Gourmand.texture_body);
	gourmand.head = hayao.Actor.create();

	for (var key in Gourmand.expressions) {
		var expression = Gourmand.expressions[key];
		gourmand.head.animations[key] = hayao.Animation.copy(expression);
	}
	gourmand.head.active_animation = 'chew';
	
    gourmand.width = stageW / 4;
    gourmand.height = stageH * 0.8;
    gourmand.position = { x: stageW/2, y: stageH };


	gourmand.head.height = gourmand.height / 5 + 10;
	gourmand.head.width = gourmand.width * 3/4;

	gourmand.torso.width = gourmand.width;
	gourmand.torso.height = gourmand.height * 4/5;

	stageAdd(gourmand.torso);
	stageAdd(gourmand.head.container = new PIXI.Sprite());
	
	gourmand.head.render();

	return gourmand;
};

Gourmand.prototype.resize = function () {
	var bounds = game.getBounds();
};

Gourmand.prototype.update = function(delta_t) {
	this.head.update(delta_t);

    this.torso.anchor.x = 0.5;
    this.torso.anchor.y = 1;
    this.head.container.anchor.x = 0.5;
    this.head.container.anchor.y = 0;

	this.head.container.x = this.position.x;
	this.head.container.y = this.position.y - this.torso.height;

	this.torso.x = this.position.x;
	this.torso.y = this.position.y + this.head.container.height;

	this.head.render();


	console.log(this);

};

Gourmand.p

$(function() {
    PIXI.loader
        .add('body', 'img/body_00.png')
		.add('face', 'img/face_00.png')
        .load(function (loader, resources) {
            Gourmand.texture_body = resources['body'].texture;
			Gourmand.texture_face = resources['face'].texture;
			Gourmand.expressions = [];

            Gourmand.spritesheet = hayao.Spritesheet.create(Gourmand.texture_face);
            Gourmand.spritesheet.mapAtlas(320, 256,
                function (atlas, x1, y1, x2, y2) {
                    console.log(x1,y1,x2,y2);
                    return new PIXI.Texture(atlas, new PIXI.Rectangle(x1, y1, x2, y2));
                });
            Gourmand.expressions['chew'] = hayao.Animation.create('chew', Gourmand.spritesheet, [0,1,2,3,3]);
            Gourmand.expressions['chew'].period = 0.1;
            Gourmand.expressions['idle'] = hayao.Animation.create('idle', Gourmand.spritesheet, [0]);
            Gourmand.expressions['idle'].period = 0.1;
            Gourmand.expressions['sick'] = hayao.Animation.create('sick', Gourmand.spritesheet, [7]);
            Gourmand.expressions['sick'].period = 0.1;
        });
});
