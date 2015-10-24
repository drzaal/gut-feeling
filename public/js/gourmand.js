'use strict';
var gutFeeling = gutFeeling || {};

gutFeeling.Gourmand = function Gourmand() {
};
gutFeeling.Gourmand.prototype.create = function create() {
    // is scale established here, or is it not needed?
	var stageW=Game.stageW,stageH=Game.stageH;
    var gourmand = new PIXI.Sprite(PIXI.Texture.fromImage('img/body.png'));
    gourmand.width = gourmand.width * stageH * 0.85 / gourmand.height;
    gourmand.height = stageH * 0.85;
    gourmand.anchor.x = 0.5;
    gourmand.anchor.y = 1;
    gourmand.position.x = stageW/2;
    gourmand.position.y = stageH;

	return gourmand;
};