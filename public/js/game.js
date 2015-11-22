'use strict';

var gutFeeling = gutFeeling || {};
/*
  TODO:
  A)Decide what needs to be inside $(document).ready and what doesn't. Currently everything is inside of it.
  B) Breakup the countdown function so it's not doing rules and state duties.
  c) Start considering browser compatibility, we are really getting risky with this now.
  		- window.performance.now is NOT backwards compatible.
		- Watch out for the CSS animations
*/

var game;

/**
 Master game State Object.
 */
gutFeeling.Game = function Game() {
    var self = this;
    this.stomach = new Stomach();
    this.assets = {};
    this.stage;
    this.renderer;

    // Our generalized health level. HP from 0-100, Carbs, proteins, and minerals/vitamins.
    this.health = {
        h: 100,
        carb: 10,
        protein: 10,
        fats: 10
    };
    this.health.vitamineral = 10;

    this.getHealth = function () {
        return self.health.h;
    };
    this.getCarb = function () {
        return self.health.carb;
    };
    this.getProtein = function () {
        return self.health.protein;
    };
    this.getVitamineral = function () {
        return self.health.vitamineral;
    };

    this.getBounds = function getBounds() {
        return {
            stageW: self.stageW,
            stageH: self.stageH
        }
    };

    this.setAssets = function setAssets(data) {
        self.assets = data;
    };

    self.controllers = [];
    self.t_last = null; // Gamestate timestamp
    //not indenting additionally here
    //pseudo-globals corresponding to upgradeLogic
    var baseUpCost = 200;
    var baseAbsorb = 10;
    var upgradeModifier = 2;


    // Treat this nicely! This is our Main update loop. Unsloppy it!
    self.main = function main() {
        if (self.t_last == null) {
            self.t_last = window.performance.now();
        }
        var t_old = self.t_last,
            delta_t;
        self.t_last = window.performance.now();
        delta_t = (self.t_last - t_old) / 1000;

        self.tri_controller.update();
        self.controllers.forEach(function (controller) {
            controller.update(delta_t);
        });

    };

    self.clearDOM = function clearDOM() {
        $("body").empty();
        actionPanelUpdate(); //calls from action-event-q js file
        $("body").removeClass("mainmenu");
    }

    self.startLevel = function startLevel(level) {
        var tmpl_html = self.assets.templates;
        self.clearDOM();
        var domArr = [];

        $('body').append(tmpl_html.body);
        $("#control-overlay").append(tmpl_html.meal + tmpl_html.control);
        // butDisp();
    }

    /*
     * Register a Controller with the primary game.
     * This allows the Primary Game Controller to access standard methods and hooks.
     */
    self.register_controller = function (controller) {
        self.controllers.push(controller);
    }

    /*
     * Add To Stage
     * Adds a PIXI object to the primary game stage.
     */
    self.stageAdd = function ( resource ) {
        self.stage.addChild( resource );
    }

    /*
     * Remove from Stage
     * Removes a PIXI object from the primary game stage.
     */
    self.stageRemove = function ( resource ) {
        self.stage.removeChild( resource );
    }

    /**
     * Resize game viewport
     */
    self.resize = function resize() {
        $('#stage').width($(window).width());
        $('#stage').height($(window).height());
        var stageW = self.stageW = $("#stage").width();
        var stageH = self.stageH = $("#stage").height();
        var bg_W_ = Math.max(stageH, stageW / 2);

        var meal_venue = self.meal_venue;
        meal_venue.width = bg_W_ * 5;
        meal_venue.height = bg_W_ * 3;
        meal_venue.anchor.x = 0;
        meal_venue.anchor.y = 0;
        meal_venue.position.x = -2 * bg_W_; // - stageW/2 * Math.max(0, 3/5 - stageH/stageW);
        meal_venue.position.y = 0; //stageW * Math.max(0, stageH/stageW - 3/5);
    };
    $(window).resize(self.resize);

    //TODO: separate animation within gameStart function
    self.gameStart = function () {
        self.startLevel();

        var stage, renderer;
        self.nibbles = [];
        self.food_assets = {};
        var stageW;
        var stageH;

        stageW = self.stageW = $("#stage").width();
        stageH = self.stageH = $("#stage").height();

        stage = self.stage = new PIXI.Stage(0xffffff);
        renderer = self.renderer = PIXI.autoDetectRenderer(stageW, stageH, {
            transparent: true
        });

        $("#stage").append(renderer.view);
        console.log("STAGE width %s height %s", stage.width, stage.height);

        var gourmand = gutFeeling.Gourmand.create(self.getBounds());

        // Calculating viewport proportions.
        var meal_venue = self.meal_venue = new PIXI.Sprite(PIXI.Texture.fromImage('/img/meal_venue.jpg'));
        self.levelBG = meal_venue;

        self.resize();

        stage.addChild(meal_venue);
        stage.addChild(gourmand);

        self.tri_controller = new Tricontroller({
            "parent": $("#control-overlay"),
            "width": 200
        });
        // Get the trackers going.
        self.score = gutFeeling.Score.create(self.assets.templates.bar_ui, self.assets.icons);
        self.score.addTracker("health", self.getHealth);
        self.score.addTracker("carb", self.getCarb);
        self.score.addTracker("protein", self.getProtein);
        self.score.addTracker("vitamineral", self.getVitamineral);
        self.register_controller(self.score);

        var animate = function () {
            requestAnimationFrame(animate);
            renderer.render(stage);
        };

        requestAnimationFrame(animate);
        setInterval(self.main, 30);
        console.log("We should have set this already?");


        function upgradeLogic() {
            $(".upgrade1").click(function () {
                var curScore = parseInt($("#score").text());
                if (curScore > baseUpCost) {
                    $("#score").text(parseInt($("#score").text()) - baseUpCost);
                    baseAbsorb += 5;
                    baseUpCost = (baseUpCost * upgradeModifier);
                    $("#rate").text(baseAbsorb);
                    $(".upgrade1").text("Upgrade Nutrient Absorbtion (cost of " + baseUpCost + ")");
                    $(".upgrade2").text("Upgrade Slider Capacity (cost of " + baseUpCost + ")");
                }
            }); //end of upgrade1, not upgradeLogic

            $(".upgrade2").click(function () {
                var curScore = parseInt($("#score").text());
                if (curScore > baseUpCost) {
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
        function gameLogic() {
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


            //gameLogic calls countdown, will want to split up countdown later because it is acting almost like game state right now
            self.countDown();
        }
        //calling interior functions
        gameLogic();
        upgradeLogic();

        game.stage = stage;
    }; //gamestart end

    self.titleScreen = function () {
        console.log(self.assets);
        self.clearDOM();
        $('body').addClass('mainmenu');
        $('body').append(self.assets.templates.title_screen);
        $('.newgame').on("click", function () {
            self.gameStart();
        });
        $(".credits").on("click", function () {
            alert("Zaal and Duncan made this, please hold your applause");
        });
    }


    function newScore(food, mod) {
        console.log(food);
        console.log(mod);
        var newArr = [];
        var foodNums = food.triangle;
        console.log(foodNums);
        var modVals = mod.triangle;

        var select = [
			self.tri_controller.rgb.r,
			self.tri_controller.rgb.g,
			self.tri_controller.rgb.b
		];
        $("#score").text(parseInt($("#score").text()) + 5);
        /*var finalVals = food.stats.map(function(item, i){
            return item * modVals[i]
         })*/
    }

    var digestion_counter = 4;
    var gameover = false;
    self.countDown = function countDown() {
        if ($("#score").text() <= -10) { //can put gameover check in other places as well
            gameover = true;
            alert("you died of stomach illness!");
            $("body").empty();
            $("<p>").appendTo("body").text("The food exploded out of your stomach, much like in Alien. You are dead.").addClass("gameover");
            setTimeout(function () {
                return self.titleScreen();
            }, 3500);
        }
        setTimeout(function () { // Making it a timeout just so I know it ALWAYS is calling countDown once first.
            digestion_counter--;
            if (digestion_counter === 0 && !gameover) {
                digestion_counter = 4;
                console.log(self.assets.food_mods);
                var randomMod = self.assets.food_mods[randomizer(0, self.assets.food_mods.length - 1)];
                var randomFood = self.assets.food[randomizer(0, self.assets.food.length - 1)];
                console.log("randomFood" + randomFood);
                $(".food-pane").addClass("deleted");
                var new_food = $("#control-overlay").prepend(self.assets.templates.meal);
                new_food.find("#curfood").text(randomMod.named + " " + randomFood.named);
                new_food.find("#curfood_img").css({
                    "background-image": "url(" + randomFood.img + ")",
                    "background-size": "256px 512px",
                    "background-position": -randomFood.img_xywh[0] + "px " + -randomFood.img_xywh[1] + "px",
                    "width": 64,
                    "height": 64,
                    "margin": "0 auto"
                });
                intestine.phaseChange(self.tri_controller.rgb);
                newScore(randomFood, randomMod);
            } else if (gameover) { //ends loop if gameover is true
                return;
            } else {
                $(".food-pane.deleted").hide();
                $(".food-pane.deleted").remove();
            }
            $("#count").text(digestion_counter);
            countDown();
        }, 1000);
    };

    return {
        getHealth: this.getHealth,
        getCarb: this.getCarb,
        getProtein: this.getProtein,
        getVitamineral: this.getVitamineral,
        getBounds: this.getBounds,
        register_controller: this.register_controller,
        score: this.score,
        titleScreen: this.titleScreen,
		stageAdd: this.stageAdd,
		stageRemove: this.stageRemove,
        setAssets: this.setAssets
    };
}

if ($ === undefined) { $ = function() { }; }

$(function () {
    //Uses reduce to collate two arrays into an object
    function objPropper(keysArr, valsArr, objAdded) {
        keysArr.reduce(function (obj, key, i) {
            objAdded[key] = valsArr[i];
        }, objAdded);
        return objAdded;
    }

    var loader = gutFeeling.Loader.load();

    loader.ready.done(function () {
        console.log("success");
        game = new gutFeeling.Game();
        game.setAssets(loader.data);
        game.titleScreen();
        game.register_controller(intestine);
        //music_ichiban.play().fadeIn().loop();
    });
    loader.ready.then(undefined, function (err) {
        console.log("failure");
        $('body').append("<h1>Unable to load application</h1>");
    });

}); 
