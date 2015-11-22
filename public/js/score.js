/**
 * Score Class
 * Score keeps track of the current state of the game. 
 * I'm coopting this file to use for the HUD.
 */

var gutFeeling = gutFeeling || {};

gutFeeling.Score = function() {
	var self = this;
	self.html = $('<div id=""></div>');
    self.template;
    self.atlas;

	self.tracker = {};

	// Create and add a new tracker element. We are going to want to use this quite a bit
	// As some of the flora trackers will fall off and on as time goes on.
	self.addTracker = function( name, callback ) {
		var icon;
		var val;
		if ( !self.tracker[name] && self.icons[name] ) {
			icon = self.icons[name];
			self.tracker[name] = {
				html: $( self.template ),
			};
			self.html.append( self.tracker[name].html );


			self.tracker[name].html.find(".heads-up-icon").css({
				background: "url(" + icon.src + ")",
				"background-position": -icon.x + "px " + (-icon.y) + "px",
				"background-size": icon.img_xy[0] + "px " + icon.img_xy[1] + "px",
				width: icon.w,
				height: icon.h
			});
			if (callback !== undefined) {
				val = callback();
				self.tracker[name].callback = callback;
				self.tracker[name].val = val;
				self.tracker[name].html.find(".heads-up-bar").text( " " );
			}
			else {
				self.tracker[name].val = "null";
				self.tracker[name].html.find(".heads-up-bar").text( "nul" );
			}

		}
	};
	self.removeTracker = function( name ) {
		self.html.remove( self.tracker[name].html );
		self.tracker[name].html = null;
		self.tracker[name].remove();
	}

	self.update = function( delta_t ){
		var tracker, tracker_name
		for ( tracker_name in self.tracker ){
			tracker = self.tracker[tracker_name];
			console.log(tracker);
			tracker.val = tracker.callback();
			tracker.html.find(".heads-up-bar").css({
				width: ( 50 * tracker.val / 100 ) + "px",
				height: "16px",
				"background-color": "blue"
			});
		}
	};
};

//newScore may become scoreCalc
var testFood = [15, 1, 10];
var testMod = [1, 1, 1];
var testSlider = [1, 15, 10];
var sliderMax = 5;
var nutrientTotals = [500, 500, 500];
//var damageScores = [20, 20, 20] gastroparesis, malnutrition, illness

function scoreUpdate(food, mod, slider, totals, maximum){
  var temptotals = totals.slice();
  function getTotal(){
  var combinedVal = food.map(function(item, i, arr){
  return item * mod[i];
  });
  combinedVal.forEach(function(item, i, arr){
      if (item !== 0){
        if (item === slider[i]){
       temptotals[i] += item;
       return;
        }
      }
      var difference;
      if (slider[i] > item){
        difference = Math.abs(slider[i] - item);
      } else {
        difference = Math.abs(item - slider[i]);
      }
      //var difference = Math.abs(slider[i] - (Math.abs(item) + maximum));
      //console.log(difference - maximum);
      var pointsMax = Math.abs(maximum - difference);
      if (pointsMax < maximum){
        var newestVal;
        if (item < slider[i]){
          item += item - slider[i];
        } else {
          item += slider[i] - item;
        }
        temptotals[i] += item;
      } else {
        while(difference > maximum){
          difference--;
          temptotals[i]--;
        }
      }
    });
  }

  return {
            "getNewTotal": function (){
              getTotal();
              console.log("this is what the new total will be after update " + temptotals);
                return temptotals;
            },
            "getOldTotal": function(){
              console.log("this is the starting nutrient value before update " + totals);
              return totals;
            },
            "update": function(){
              nutrientTotals = temptotals
              console.log("The nutrient totals have been updated, they are now " + nutrientTotals);
              return nutrientTotals;
            }
         }
}

gutFeeling.Score.create = function( template, icons) {
	var score = new gutFeeling.Score();
	score.template = template;
	score.icons = icons ;
	score.html = $('#status-hud');
	
	return score;
};

var testTurn = scoreUpdate(testFood, testMod, testSlider, nutrientTotals, sliderMax);
testTurn.getNewTotal();
testTurn.getOldTotal();
testTurn.update();
