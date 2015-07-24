
/*
  TODO:

  A) separate the animation logic & display that's inside the gameStart function because 1) it's messy and 2)the images are added onclick but don't move, so something is getting broken.

  B)Decide what needs to be inside $(document).ready and what doesn't. Currently everything is inside of it.

  C) Breakup the countdown function so it's not doing rules and state duties.

*/


$(function() {
  var masterArr = {
        "nutrientNames": ["acid ", "meat", "veggie"],
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

  $.getJSON("js/newfoods.json", function (data, status){
    console.log("got it", data)
          data.foods.forEach(function(item){
            new AssetMake (item.kind, item.named, item.img, item.nutrients);
          })
          console.log("done", masterArr);
          masterState().titleScreen();
      })
function masterState() {   //not indenting additionally here
      //pseudo-globals corresponding to upgradeLogic
      var baseUpCost = 200;
      var baseAbsorb = 10;
      var upgradeModifier = 2;
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

    var gameDisp = [
      $("<p>").attr("id", "curfood").text("food text here"),
      $("<p>").text("Time left to prepare digestion:"),
      $("<p>").attr("id", "count").text("3"),
      $("<p>").text("Nutrients (score"),
      $("<p>").attr("id", "score").text("20"),
      $("<p>").text("Nutrient Absorbtion Rate:"),
      $("<p>").attr("id", "rate").text("10")
    ];

    function sliderDisp(){
      $('<label id= "acidlabel">Gastric Acid</label>').appendTo("#control-overlay");
      $('<input type="range" class="mrslider" min="0" max="10"  value="5" step="1" id="acidslider">').appendTo("#acidlabel");
      $('<output id="acid">5</output>').appendTo("#acidlabel");
      $('<label for="meat"> Meat</label>').appendTo("#control-overlay");
      $('<input type="range" min="0" max="10" class="mrslider" value="5" id="meatslider" step="1"/>').appendTo('#control-overlay');
      $('<output for="meat" id="meat">5</output>').appendTo('#control-overlay');
      $('<label for="fader">Vegetables</label>').appendTo("#control-overlay");
      $('<input type="range" class="mrslider" min="0" max="10" value="5" id="veggieslider" step="1">').appendTo("#control-overlay");
      $('<output for="veggie" id="veggie"> 5</output>').appendTo("#control-overlay");
    }

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
    overlayAdd(gameDisp); //append to control overlay
    sliderDisp();
    butDisp();
  } //masterGameDisp end


  //TODO: seperate animation within gameStart function
  var gameStart = function gameStart() {
    masterGameDisp();
    function outputUpdate(item, tag) {
      $(tag).val(item);
      var score = $("#score").text();
      var newTotal = parseInt(score, 10) - 5; //placeholder mechanic for defeat condition
      $("#score").text(newTotal);
    }

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

    food_assets['c_wing'] = PIXI.Texture.fromImage('img/c_wing.gif');
    var tmp_ill_texture = PIXI.Texture.fromImage('img/ill_00.png');
    ill_assets['ecoli'] = new PIXI.Texture(tmp_ill_texture, new PIXI.Rectangle(0, 0, 256, 256));
    ill_assets['stephalo'] = new PIXI.Texture(tmp_ill_texture, new PIXI.Rectangle(256, 0, 256, 256));

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
      //declaration hoisting makes it preferable to define omnom at top... I think.
      var omnom;
    	if (new Date() & 2) {
        omnom = new PIXI.Sprite(ill_assets['ecoli']);
    	} else {
        omnom = new PIXI.Sprite(ill_assets['stephalo']);
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

    var animate = function() {
    requestAnimationFrame( animate );
    renderer.render(stage);
    };

    requestAnimationFrame(animate);
    setInterval( main, 30 );

    var main = function() {
      nibbles.forEach(function(nibble){
        nibble.path_percent += 0.2;
        var path_bias = pathPercent2Cart( nibble.path_percent );
        nibble.x += (path_bias.x - nibble.x) / 20;
        nibble.y += (path_bias.y - nibble.y) / 20;
        nibble.rotation += 0.1;
      });
    };

  /*
   * Converts a given percentage to a coordinate along a bounded vertex-defined linear path.
   * @TODO Please note this is tied explicitly to the Gastro vertices and must be generalized
  */

    var pathPercent2Cart = function( percent ) {
      //same hoisting issue as omnom
      var lite_post_id;
      if (percent < 100) {
        lite_post_id = Math.floor( percent/100 * gastro_vertices.length );
      } else {
        lite_post_id = gastro_vertices.length - 1;
      }
        lite_post = gastro_vertices[ lite_post_id ];
      return {'x': lite_post[0], 'y': lite_post[1]};
    };


    //tracking three main values, per future triangle design
    //these could be migrated to gameLogic, then called within it.
    function sliderLogic() {
      $('#acidslider').on("input", function(){
          outputUpdate($('#acidslider').val(), '#acid');
      });
      $('#meatslider').on("input", function(){
        outputUpdate($('#meatslider').val(), '#meat');
      });
      $('#veggieslider').on("input", function(){
        outputUpdate($('#veggieslider').val(), '#veggie');
      });
    }

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
      /*var gCheese = new AssetMake("food", "Grilled Cheese", "gcheese.jpg", [5,1,1]);
      var pizza = new AssetMake ("food", "Pizza", "pizza.jpg", [1,1,5]); */
      //values used for upgrades and state
      var foodVals = ["acid", "meat", "veggie"];
      /*var actionPanelUpdate = function() {
      $("body").append('<div id="action-event-panel"></div>');
      $.getJSON("js/test-actions.json", function(data, status, jqXHR) {
      var aeq = new ActionEventQ({ selector: "#action-event-panel" });
      aeq.loadDef( data );
      aeq.triggerEvent(0);
      aeq.triggerEvent(2);
      aeq.processTriggers();
  });
}; */


     // If you're reliant on the index, DO NOT USE A FOREACH. Use a true for loop.
      function newScore(food){
        var newArr = [];
        var foodkeys = Object.keys(food.stats);
        foodkeys.forEach(function(item){
        var select = newArr.push($("#" + item).text());
        });
        newArr.forEach(function(item, index){
          item = parseInt(item);
        // Whatever you are doing here is complete nonsense. Try to break down what behavior you actually want, and make it clear here.
          var newTotal = (item) - food.stats[masterArr.nutrientNames[index]];
          //there's a problem with index not synching up and returning an undefined at the beginning of the array.
          //it can be monkey patched better than this, but I'd rather know why it's happening.
          if(!isNaN(item) && item !== undefined){
            var points = Math.abs(newTotal) - 10;
            var finalist = Math.abs(points);
            $("#score").text(parseInt($("#score").text()) + finalist);
          }

        });

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
              return titleScreen();
            }, 3500);
        }
        setTimeout(function() { // Making it a timeout just so I know it ALWAYS is calling countDown once first.
          digestion_counter--;
          console.log(digestion_counter);
          if (digestion_counter === 0 && !gameover) {
          digestion_counter = 4;
            var randomFood = masterArr.food[randomizer(0, masterArr.food.length-1)];
            $("#curfood").text(randomFood.named);
            newScore(randomFood);
          } else if(gameover) {  //ends loop if gameover is true
            return;
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
    sliderLogic();
    upgradeLogic();
  }; //gamestart end

    function titleScreen(){
      $("body").empty();
      $("<section>").addClass("mainopts").appendTo("body");
      $("body").addClass("mainmenu");
      $("<section>").addClass("title").appendTo("body");
      $("<section>").addClass("mainopts").appendTo("body");
      $("<h1>").addClass("titletext").appendTo(".title");
      $(".titletext").text("Gut Feeling");
      function optControl(){
        $("<div>").addClass("option").text("new game").addClass("newgame").appendTo(".mainopts");
        $(".newgame").on("click", function(){
                                masterState().gameStart();
            });
        $("<div>").addClass("option").text("credits").addClass("credits").appendTo(".mainopts");
        $(".credits").on("click", function(){
              alert("Zaal and Duncan made this, please hold your applause");
          });
        }
      optControl();
    }

  //masterInit module revealer return.
    return {
      "gameStart": gameStart,
      "titleScreen": titleScreen
      /*We can add and cleanup as needed with this pattern. So, something like...
      "masterGameDisp": masterGameDisp */
    };

} //end of masterInit function. Can talk about the preferred indenting, but everything's already nested once for .ready and things will be moved out of it next refactor.
  //masterState called to start program
}); //$(document).ready end
