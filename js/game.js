//To Do:
//1)refactor outputUpdate to not be called from HTML, build dynamically with jquery.
//2)Fix game initialization so it... initalizes.
//3) Sliders can log output but do not update in disp, related to 2).

function outputUpdate(item, tag) {
  $(tag).val(item);
  console.log(item);
  var score = $("#score").text();
  var newTotal = parseInt(score, 10) - 1;
  $("#score").text(newTotal);
  if ($("#score").text() == -1){
      alert("you died of stomach illness!");
      $("body").empty();
      $("<p>").appendTo("body").text("The food exploded out of your stomach, much like in Alien. You are dead. Press reload to try again.");
      var gameOver = true;
  }
}



$(function() {

console.log($("#score").text());

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






//Arguably totally wrongheaded attempt at a jQuery version.
/* function outputUpdate(item, tag){
  $('#score').on('input', function() {
    $(tag).value = item;
      var score = $("#score").text;
      var newTotal = parseInt(score, 10) - 1;
    $("#score").text(newTotal);
    if ($("#score").text() == -1){
        alert("you died of stomach illness!");
        $("body").empty();
        $("<p>").appendTo("body").text("The food exploded out of your stomach, much like in Alien. You are dead. Press reload to try again.");
        gameOver = true;
    }
  });
}; */
//this is a magical selector
//$('#acidslider').on('input change', function(){outputUpdate($('acidslider').val(), '#acid')});


//(utility functions)
function randomizer (min, max){
  return Math.floor(Math.random()*((max-min) +1)) + min;
}

//game logic
var masterArr = {
  "nutrientNames": ["acid ", "meat", "veggie", "carbs", "vita"],
  "bacteria": [],
  "food": [],
  "body": [],
  "eatenFood": []
};

//Uses reduce to collate two arrays into an object
function objPropper(keysArr, valsArr, objAdded){
  keysArr.reduce(function(obj, key, i){
      objAdded[key] = valsArr[i];
    }, objAdded);
    return objAdded;
}

//Asset constructor works for foods and bacteria
function AssetMake(kind, named, img, stats){
  this.kind = kind;
  this.named = named;
  this.img = img;
  this.stats = objPropper(masterArr.nutrientNames, stats, {});
  masterArr[kind].push(this);
}

//values used for reduce constructor AssetMake
var body = new AssetMake ("body", "Player Name", "body.jpg", [0,0,0,0,0,0]);
masterArr.body = masterArr.body[0];
var gCheese = new AssetMake("food", "Grilled Cheese", "gcheese.jpg", [5,1,1,1,1]);
var pie = new AssetMake ("food", "Apple Pie", "apie.jpg", [1,1,1,1,5]);
var pizza = new AssetMake ("food", "Pizza", "pizza.jpg", [1,1,5,1,1]);
//values used for upgrades and state
var baseAbsorb = 10;
var baseUpCost = 200;

var foodVals = ["acid", "meat", "veggie", "carbs", "vita"];

function newScore(food){
  var newArr = [];
  var foodkeys = Object.keys(food.stats);
  foodkeys.forEach(function(item){
    var select = newArr.push($("#" + item).text());
  });
    newArr.forEach(function(item, index, arr){
    item = parseInt(item);
    var newTotal = (item) - food.stats[masterArr.nutrientNames[index]];
    //there's a problem with index not synching up and returning an undefined at the beginning of the array.
    //it can be monkey patched better than this, but I'd rather know why it's happening.
    if(item !== NaN && item !== undefined){
        var points = Math.abs(newTotal) - 10;
      var finalist = Math.abs(points);
      $("#score").text(parseInt($("#score").text()) + finalist);
    }

  });

}

//counter function, recursive
function countDown(){
  var counter = 4;
  if(gameOver){
    return;
  }
  setInterval(function() {
      counter--;
      if (counter >= 0) {
        span = $("#count");
        span.text(counter);
      }
      if (counter === 0) {
          clearInterval(counter);
      var randomFood = masterArr.food[randomizer(0, masterArr.food.length-1)];
      $("#curfood").text(randomFood.named);
      newScore(randomFood);
      return countDown();
      }
  }, 1000);
}

//every upgrade doubles the price of both itself and other upgrades of the same category.
//Can use a universal class to update these when there are more.
$(".upgrade1").click(function(){
  var curScore = parseInt($("#score").text());
  if (curScore > baseUpCost){ $("#score").text(parseInt($("#score").text()) - baseUpCost);
      baseAbsorb += 5;
      baseUpCost = (baseUpCost * 2);
      $("#rate").text(baseAbsorb);
      $(".upgrade1").text("Upgrade Nutrient Absorbtion (cost of " + baseUpCost + ")");
      $(".upgrade2").text("Upgrade Slider Capacity (cost of " + baseUpCost + ")");
  }
});

$(".upgrade2").click(function(){
  var curScore = parseInt($("#score").text());
  if (curScore > baseUpCost){
    $("#score").text(parseInt($("#score").text()) - baseUpCost);
    $("input").attr("max", 15).val(15);
    $("output").val(15);
    baseUpCost = (baseUpCost * 2);
    $(".upgrade1").text("Upgrade Nutrient Absorbtion (cost of " + baseUpCost + ")");
    $(".upgrade2").text("Upgrade Slider Capacity (cost of " + baseUpCost + ")");
  }
});

//quick and dirty defeat flag
 gameOver = false;
if(gameOver){
  return;
}
//init
});