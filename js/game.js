//To Do:
//1)refactor outputUpdate to not be called from HTML, build dynamically with jquery.
//2)Fix game initialization so it... initalizes.
//3) Sliders can log output but do not update in disp, related to 2).


// First of all, we need to collect all these stray functions and put them somewhere smart.
// Long term, they are best put together in classes and namespaces. Just easier to deal with.

/* On input change, Display output must change to reflect new values. */
$(function() {
var gameStart = function gameStart() {
  function init (){
  $('body').removeClass('mainmenu');
function outputUpdate(item, tag) {
  $(tag).val(item);
  var score = $("#score").text();
  var newTotal = parseInt(score, 10) - 5; // Straight up, what. Every time you change your value you just decrement your scoretotal?
  $("#score").text(newTotal);
}


/* This is our onload Initialization function, and will be our bootstrapper once we get better. */
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
  countDown();
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


/**
 * Converts a given percentage to a coordinate along a bounded vertex-defined linear path.
 * @TODO Please note this is tied explicitly to the Gastro vertices and must be generalized
 */


var pathPercent2Cart = function( percent ) {
  if (percent < 100) {
    var lite_post_id = Math.floor( percent/100 * gastro_vertices.length );
  }
  else { lite_post_id = gastro_vertices.length - 1; }
  var lite_post = gastro_vertices[ lite_post_id ];

  return {'x': lite_post[0], 'y': lite_post[1]};
};




$('#acidslider').on("input", function(){ outputUpdate($('#acidslider').val(), '#acid')});
$('#meatslider').on("input", function(){ outputUpdate($('#meatslider').val(), '#meat')});
$('#veggieslider').on("input", function(){ outputUpdate($('#veggieslider').val(), '#veggie')});
$('#carbsslider').on("input", function(){ outputUpdate($('#carbsslider').val(), '#carbs')});
$('#vitaminslider').on("input", function(){ outputUpdate($('#vitaminslider').val(), '#vita')});


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
// Get this junk in a json,xml,textfile,or something.
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
  // If you're reliant on the index, DO NOT USE A FOREACH. Use a true for loop. Not only is that explicitly what it's designed for, but a traditional for loop is faster than a foreach by nearly an order of magnitude.

  function scoreUpdate(arr, food){
    var i = 0;
    for(i; i < arr.length; i++){
      arr[i] = food.stats
    }
  }
  newArr.forEach(function(item, index, arr){
    item = parseInt(item);
	// Whatever you are doing here is complete nonsense. Try to break down what behavior you actually want, and make it clear here.
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
// Avoid convoluted action chains like this abomination. A recursive function that switches a setInterval on/off?
// Nononono. Oh god no. Always make sure the chain of activity ownership for your code is clear. See above for the main game loop. Function main.
var digestion_counter = 4;
function countDown(){
  if ($("#score").text() <= -10){ // GameOver check should not depend only on direct player input. Maybe it belongs both places. Not sure.
      alert("you died of stomach illness!");
      $("body").empty();
      $("<p>").appendTo("body").text("The food exploded out of your stomach, much like in Alien. You are dead.");
      var gameOver = true;
       setTimeout(function(){
        return titleScreen().init();
      }, 3500);
  }
  setTimeout(function() { // Making it a timeout just so I know it ALWAYS is calling countDown once first.
    digestion_counter--;
    if (digestion_counter == 0) {
	  digestion_counter = 4;
      var randomFood = masterArr.food[randomizer(0, masterArr.food.length-1)];
      $("#curfood").text(randomFood.named);
      newScore(randomFood);
    }
    $("#count").text(digestion_counter); // No sense in the conditional.
    countDown();
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
  //var titleScreen = mainMenuRet().init();

  //main menu;
  //placeholder block
  function optionAdd(id, titled, goesTo){
    $("<div>").addClass("option").text(titled).attr('id', id).appendTo(".mainopts");
    $("#" + id).on("click", function(){
      goesTo();
    })
  };

  var titleScreen = function mainMenuRet(){
    console.log(gameStart);
    function init(){
    //placeholder menu functions
      var newgame = function(){
        alert("This is where the new game would go, just saying");
      }
      var scenarios = function(){
        alert("Scenarios: Seafood Buffet, 21st Birthday, Street Food Adventure")
      };
      var credits = function(){
        alert("Zaal and Duncan made this, hold your applause");
      };
      var options = function(){
        alert("Sound on/off and High Scores");
      }
      $("body").empty();
      $("body").addClass("mainmenu");
      $("<section>").addClass("title").appendTo("body");
      $("<section>").addClass("mainopts").appendTo("body");
      $("<h1>").addClass("titletext").appendTo(".title");
      $(".titletext").text("Gut Feeling")
      optionAdd("newgame", "New Game", gameStart().init);  //pass as function, without calling;
      optionAdd("scenarios", "Scenarios", scenarios);
      optionAdd("credits", "Credits", credits);
      optionAdd("options", "Options", options);
    }
    return {
      init: init
    };
  }

//quick and dirty defeat flag
  var gameOver = true;
  //countDown();

});
}
  return {
    init:init
  }
};
gameStart().init();
});

