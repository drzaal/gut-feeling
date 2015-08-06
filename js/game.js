
/*
  TODO:

  A) separate the animation logic & display that's inside the gameStart function because 1) it's messy and 2)the images are added onclick but don't move, so something is getting broken.

  B)Decide what needs to be inside $(document).ready and what doesn't. Currently everything is inside of it.

  C) Breakup the countdown function so it's not doing rules and state duties.

*/
var config = { // Put all of our modifiable constants right here. Might save us some worry. Move this to a config file later.
	"nutrientNames" : ["acid ", "meat", "veggie"],
	"ads" : false
};
var game;
var masterArr = {
	"triangle": ["digestiontime ", "nutrientabsorb", "immunestrength"],
	"bacteria": [],
	"food": [],
	"modifier": [],
	"body": [],
	"eatenFood": []
};

// Audio loading.
var music_ichiban = new buzz.sound("/audio/guineo_feat_kristina_maier-expectacion.mp3");
// var music_ichiban = new buzz.sound("/audio/guineo-metamorfosis.mp3");

var tmpl_html = [];
$.get("/view/control_column.txt", function(data){ tmpl_html.control_column = data; });
$.get("/view/meal.txt", function(data){ tmpl_html.meal_one = data; });
$.get("/view/body.txt", function(data){ tmpl_html.body = data; });
$.get("/view/other.txt", function(data){ tmpl_html.other = data; });

/**
 Master game State Object.
 */
function Game() {
	var self = this;
	this.stomach = new Stomach();
	self.controllers = [];
   //not indenting additionally here
      //pseudo-globals corresponding to upgradeLogic
      var baseUpCost = 200;
      var baseAbsorb = 10;
      var upgradeModifier = 2;

	// Treat this nicely! This is our Main update loop. Unsloppy it!
    self.main = function() {
	  self.tri_controller.update();
	  self.controllers.forEach( function(controller){ controller.update( 0.03 ); });

    };

  function masterGameDisp(){
    $("body").empty();
    actionPanelUpdate(); //calls from action-event-q js file
    $("body").removeClass("mainmenu");

    function bodyAdd(domEls){
      var i;
      for(i = 0; i < domEls.length; i++){
        $(domEls[i].tag).attr("id", domEls[i].idTag).appendTo(domEls[i].appTo).text(domEls[i].dispText);
      }
    }

    var domArr = [];
    function addToDom (tag, idTag, appTo, dispText){
      this.tag = tag;
      this.idTag = idTag;
      this.appTo = appTo;
      this.dispText = dispText;
      domArr.push(this);
    }

    var controlOverlay = new addToDom("<div>", "control-overlay", "body");
    var header = new addToDom("<header>", "header", "body", "GUT FEELING");
    var footer = new addToDom("<footer>", "footer", "body", "z0lly and duncan");
    var stage = new addToDom("<div>", "stage", "body");
    var loader = new addToDom("<div>", "loader", "body");

    function butDisp(){
      $('<button>').addClass("upgrade1").text('Upgrade Nutrient Absorbtion (cost of 200)').appendTo('#control-overlay');
      $('<button>').addClass("upgrade2").text('Upgrade Slider Capacity (cost of 200)').appendTo('#control-overlay');
    }


    function overlayAdd(items){
      var i;
      for (i=0; i < items.length; i++){
        items[i].appendTo("#control-overlay");
      }
    }
    //calling these interior functions to setup the game display/state
    bodyAdd(domArr);  //append to body
	$("#control-overlay").append( tmpl_html.meal_one + tmpl_html.control_column );
    butDisp();
  } //masterGameDisp end

	/*
	 * Register a Controller with the primary game.
	 * This allows the Primary Game Controller to access standard methods and hooks.
	 */
	 self.register_controller = function( controller ) {
		self.controllers.push( controller );
	 }


  //TODO: seperate animation within gameStart function
  self.gameStart = function() {
    masterGameDisp();
    function outputUpdate(item, tag) {
      $(tag).val(item);
      var score = $("#score").text();
      var newTotal = parseInt(score, 10) - 5; //placeholder mechanic for defeat condition
      $("#score").text(newTotal);
    }

    var stage;
    self.nibbles = [];
    self.food_assets = {};
    self.ill_assets = {};
    self.gastro_vertices = [
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

    self.food_assets['c_wing'] = PIXI.Texture.fromImage('img/c_wing.gif');
    var tmp_ill_texture = PIXI.Texture.fromImage('img/ill_00.png');
    self.ill_assets['ecoli'] = new PIXI.Texture(tmp_ill_texture, new PIXI.Rectangle(0, 0, 256, 256));
    self.ill_assets['stephalo'] = new PIXI.Texture(tmp_ill_texture, new PIXI.Rectangle(256, 0, 256, 256));

    stageW = $("#stage").width();
    stageH = $("#stage").height();

    stage = new PIXI.Stage(0xffffff);
    renderer = PIXI.autoDetectRenderer(stageW, stageH, { transparent: true});

    $("#stage").append(renderer.view);
    //is scale established here, or is it not needed?
    var corpus_primus = new PIXI.Sprite(PIXI.Texture.fromImage('img/body.png'));
    corpus_primus.width = corpus_primus.width * stageH * 0.85 / corpus_primus.height;
    corpus_primus.height = stageH * 0.85;
    corpus_primus.anchor.x = 0.5;
    corpus_primus.anchor.y = 1;
    corpus_primus.position.x = stageW/2;
    corpus_primus.position.y = stageH;

    stage.addChild( corpus_primus );
    $("canvas").click(function(event){
		return -1; // We are temporarily disabling the click.
      //declaration hoisting makes it preferable to define omnom at top... I think.
      var omnom;

    	/*
		 * if (new Date() & 2) {
         * omnom = new PIXI.Sprite(ill_assets['ecoli']);
    	 * } else {
         * omnom = new PIXI.Sprite(ill_assets['stephalo']);
    	 * }
    	 * omnom.width = 64;
    	 * omnom.height = 64;
		 */
      //var omnom = new PIXI.Sprite(food_assets['c_wing']);
      omnom.anchor.x = 0.5;
      omnom.anchor.y = 0.5;

      omnom.position.x = event.originalEvent.offsetX;
      omnom.position.y = event.originalEvent.offsetY;

      omnom.path_percent = 0;

      stage.addChild(omnom);

      nibbles.push(omnom);
    });

	self.tri_controller = new Tricontroller({ "parent" : $("#control-overlay"), "width" : 120 });

    var animate = function() {
		requestAnimationFrame( animate );
		renderer.render(stage);
    };

    requestAnimationFrame(animate);
    setInterval( self.main, 30 );
	console.log("We should have set this already?");


    function upgradeLogic() {
      $(".upgrade1").click(function(){
        var curScore = parseInt($("#score").text());
        if (curScore > baseUpCost){
          $("#score").text(parseInt($("#score").text()) - baseUpCost);
          baseAbsorb += 5;
          baseUpCost = (baseUpCost * upgradeModifier);
          $("#rate").text(baseAbsorb);
          $(".upgrade1").text("Upgrade Nutrient Absorbtion (cost of " + baseUpCost + ")");
          $(".upgrade2").text("Upgrade Slider Capacity (cost of " + baseUpCost + ")");
        }
      }); //end of upgrade1, not upgradeLogic

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
    } //end of upgrade logic;
    //function
    function gameLogic(){
      function randomizer (min, max){
        return Math.floor(Math.random()*((max-min) +1)) + min;
      }

      //game logic


      masterArr.body = masterArr.body[0];
      // Get this junk in a json,xml,textfile,or something.
      var foodVals = ["digestiontime", "nutrientabsorb", "immunestrength"];
      /*var actionPanelUpdate = function() {
      $("body").append('<div id="action-event-panel"></div>');
      $.getJSON("js/test-actions.json", function(data, status, jqXHR) {
      var aeq = new ActionEventQ({ selector: "#action-event-panel", multiple: true });

		// Action event queue initialize
      aeq.loadDef( data );
      aeq.triggerEvent(0);
      aeq.triggerEvent(2);
      aeq.processTriggers();
  });
}; */


      function newScore(food, mod){
          console.log(food);
          console.log(mod);
        var newArr = [];
        var foodNums = food.triangle;
        console.log(foodNums);
        var modVals = mod.triangle;

		select = [
			game.tri_controller.rgb.r,
			game.tri_controller.rgb.g,
			game.tri_controller.rgb.b
		];
         $("#score").text(parseInt($("#score").text()) + 5);
        /*var finalVals = food.stats.map(function(item, i){
            return item * modVals[i]
         })*/
      }

      //TODO: refactor this into subfunctions
      var digestion_counter = 4;
      var gameover = false;
      function countDown(){
        if ($("#score").text() <= -10){ //can put gameover check in other places as well
            gameover = true;
            alert("you died of stomach illness!");
            $("body").empty();
            $("<p>").appendTo("body").text("The food exploded out of your stomach, much like in Alien. You are dead.").addClass("gameover");
            setTimeout(function(){
              return self.titleScreen();
            }, 3500);
        }
        setTimeout(function() { // Making it a timeout just so I know it ALWAYS is calling countDown once first.
          digestion_counter--;
          if (digestion_counter === 0 && !gameover) {
          digestion_counter = 4;
          var randomMod = masterArr.modifier[randomizer(0, masterArr.modifier.length-1)];
            var randomFood = masterArr.food[randomizer(0, masterArr.food.length-1)];
            console.log("randomFood" + randomFood);
			$(".food-pane").addClass("deleted");
			var new_food = $("#control-overlay").prepend( tmpl_html.meal_one );
            new_food.find("#curfood").text(randomMod.named + " " + randomFood.named);
            new_food.find("#curfood_img").css({
				"background-image": "url(" + randomFood.img + ")",
				"background-size": "256px 128px",
				"background-position": -randomFood.img_xywh[0] + "px " + -randomFood.img_xywh[1] + "px",
				"width": 64,
				"height": 64,
				"margin": "0 auto"
			});
			intestine.phase_rgb = game.tri_controller.rgb;
            newScore(randomFood, randomMod);
          } else if(gameover) {  //ends loop if gameover is true
            return;
          }
		  else {
			$(".food-pane.deleted").hide();
			$(".food-pane.deleted").remove();
		  }
           $("#count").text(digestion_counter);
          countDown();
        }, 1000);
      }
      //gameLogic calls countdown, will want to split up countdown later because it is acting almost like game state right now
      countDown();
    }
    //calling interior functions
    gameLogic();
    upgradeLogic();
	
	game.stage = stage;
  }; //gamestart end

    self.titleScreen = function(){
      $("body").empty();
      $("<section>").addClass("mainopts").appendTo("body");
      $("body").addClass("mainmenu");
      $("<section>").addClass("title").appendTo("body");
      $("<section>").addClass("mainopts").appendTo("body");
      $("<h1>").addClass("titletext").appendTo(".title");
      $(".titletext").text("Gut Feeling");

        $("<div>").addClass("option").text("new game").addClass("newgame").appendTo(".mainopts");
        $(".newgame").click( self.gameStart );
        $("<div>").addClass("option").text("credits").addClass("credits").appendTo(".mainopts");
        $(".credits").on("click", function(){
              alert("Zaal and Duncan made this, please hold your applause");
          });

    }

}

/*
* Converts a given percentage to a coordinate along a bounded vertex-defined linear path.
* Added some quick lerping
* @TODO Please note this is tied explicitly to the Gastro vertices and must be generalized
* @TODO Lerp should be cleaned up / generalized
*/

var pathPercent2Cart = function( percent, vertices ) {
  //same hoisting issue as omnom
  var lite_post_id, lerp_remainder = 0, lerp_vector = { "x":0, "y":0 };
  if (percent < 100) {
	lerp_remainder = percent/100 * (vertices.length-1);
	lite_post_id = Math.floor( lerp_remainder );
	lerp_remainder = lerp_remainder % 1;

	console.log( "Lite post id %d ", lite_post_id);
	lerp_vector.x = ( vertices[ lite_post_id+1 ][0] - vertices[ lite_post_id ][0] ) * lerp_remainder; 
	lerp_vector.y = ( vertices[ lite_post_id+1 ][1] - vertices[ lite_post_id ][1] ) * lerp_remainder;
  } else {
	lite_post_id = vertices.length - 1;
  }
	lite_post = vertices[ lite_post_id ];

  return {'x': lite_post[0] + lerp_vector.x, 'y': lite_post[1] + lerp_vector.y };
};


$(function() {
           //Uses reduce to collate two arrays into an object
      function objPropper(keysArr, valsArr, objAdded){
        keysArr.reduce(function(obj, key, i){
            objAdded[key] = valsArr[i];
          }, objAdded);
          return objAdded;
      }

      //Asset constructor works for foods and bacteria
      function AssetMake(kind, named, img, dimen, triangle){
        this.kind = kind;
        this.named = named;
        this.img = img;
        this.img_xywh = dimen;
        this.triangle = triangle;
        /*this.stats = objPropper(masterArr.triangle, stats, {}); */
        masterArr[kind].push(this);
      }

  function getJSONS(){
    $.getJSON("js/newfoods.json", function (data, status){
      console.log("got it newfoods", data)
            data.foods.forEach(function(item){
              new AssetMake (item.kind, item.named, item.img, item.img_xywh, item.triangle);
            })
            console.log("done", masterArr);
    })
    $.getJSON("js/foodmod.json", function (data, status){
      console.log("got it foodmod", data)
          data.foodMods.forEach(function(item){
            new AssetMake (item.kind, item.named, item.img, item.triangle);
          })
          console.log("done", masterArr);
    })
  }
  getJSONS();
	game = new Game();
	game.titleScreen();
	game.register_controller( intestine );

	intestine.flora_cluster_collection.push( new FloraCluster({ name: "ecoli", triple_point: {r: 0.5, g: 0.5, b: 0.5 } }) );


	music_ichiban.play().fadeIn().loop();


//end of masterInit function. Can talk about the preferred indenting, but everything's already nested once for .ready and things will be moved out of it next refactor.
  //Game called to start program
}); //$(document).ready end
