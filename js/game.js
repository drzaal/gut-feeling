var stage;
var nibbles = [];
var food_assets = {};
var ill_assets = {};
var gastro_vertices = [
  [200, 5],
  [200, 25],
  [150, 45],
  [250, 55],
  [300, 70],
  [320, 80],
  [270, 90],
  [200, 100],
  [120, 120],
  [80, 130],
  [120, 150],
  [200, 160],
  [280, 180],
  [300, 190],
  [250, 200],
  [200, 220]
];
var stageW;
var stageH;

$(function() {

  food_assets['c_wing'] = PIXI.Texture.fromImage('img/c_wing.gif');
  var tmp_ill_texture = PIXI.Texture.fromImage('img/ill_00.png');
  ill_assets['ecoli'] = new PIXI.Texture(tmp_ill_texture, new PIXI.Rectangle(0, 0, 256, 256));
  ill_assets['stephalo'] = new PIXI.Texture(tmp_ill_texture, new PIXI.Rectangle(256, 0, 256, 256));

  stageW = $("#stage").width();
  stageH = $("#stage").height();

  stage = new PIXI.Stage(0xffffff);
  renderer = PIXI.autoDetectRenderer(stageW, stageH, { transparent: true});

  $("#stage").append(renderer.view);

  var corpus_primus = new PIXI.Sprite(PIXI.Texture.fromImage('img/body.png'));
  corpus_primus.width = corpus_primus.width * stageH * 0.85 / corpus_primus.height;
  corpus_primus.height = stageH * 0.85;
  corpus_primus.anchor.x = 0.5;
  corpus_primus.anchor.y = 1;
  corpus_primus.position.x = stageW/2;
  corpus_primus.position.y = stageH;

  stage.addChild( corpus_primus );

  $("canvas").click(function(event){
	if (new Date() & 2) {
		var omnom = new PIXI.Sprite(ill_assets['ecoli']);
	}
	else {
		var omnom = new PIXI.Sprite(ill_assets['stephalo']);
	}
	omnom.width = 64;
	omnom.height = 64;
    //var omnom = new PIXI.Sprite(food_assets['c_wing']);

    omnom.anchor.x = 0.5;
    omnom.anchor.y = 0.5;

    omnom.position.x = event.originalEvent.offsetX;
    omnom.position.y = event.originalEvent.offsetY;

    omnom.path_percent = 0;

    stage.addChild(omnom);

    nibbles.push(omnom);
  });


  requestAnimationFrame( animate );
  setInterval( main, 30 );
});

var animate = function() {
  requestAnimationFrame( animate );
  renderer.render(stage);
};

var main = function() {
  nibbles.forEach(function(nibble){
    nibble.path_percent += 0.2;
    var path_bias = pathPercent2Cart( nibble.path_percent );
    nibble.x += (path_bias.x - nibble.x) / 20;  
    nibble.y += (path_bias.y - nibble.y) / 20;  
    nibble.rotation += 0.1;
  });
};

var pathPercent2Cart = function( percent ) {
  if (percent < 100) {
    var lite_post_id = Math.floor( percent/100 * gastro_vertices.length );
  }
  else { lite_post_id = gastro_vertices.length - 1; }
  var lite_post = gastro_vertices[ lite_post_id ];

  return {'x': lite_post[0], 'y': lite_post[1]};
};
