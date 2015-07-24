/* 12 parts (or 13) made with constructor
Salivary Glands: display only
===
Stomach Display: 4 parts
Stomach Ph is 1-6
Food Enters
Esophagus / Cardia: food enters through, graphical only
Fundus: expands when food amount exceeds base stomach capacity, slows digestion
Stomach Body: handles main primary digestion
Pylorus: secretes acid, opens valve to let food into small intestine, pushes food to Duodenum

Small Intestine Display: 3 parts
Food Turns to Chyme
Ph is 6-10
Duodenum: reduces acid levels   (absorbs iron, if we care about that)
Jejunum: absorber of nutrients, fructose, etc. (adds nutrients, vitamins)
ileum: absorbs b12 vitamin, fats (player gets fat nutrients and b12 added here) opens valve to large intestine, pushes food to the  Cecum

Large Intestine Display: 5 parts
Chyme Turns to Feces
Cecum: stores food on timer, can expand if needed (or not)
Ascending Colon: water, vitamin K, and potassium
Transversal Colon: water and salt (sodium)
Descending Colon:  stores/moves waste
Rectum:  stores/expands/expels waste, opens valve to push food outside the body
*/




//Illness:
// Digestion: 0
// 3 stats
// 3 stats
// 3 stats

//level

//1500 calories
//2000 calories

//10 objects with a total 2500
// demo

//straight 1-1-1;
//scenarios: seafood bar;

//intro: tutorial
// To do:
// jQuery loader and title screen title, instructions, new game, credits
//game load javascript, bootstrap the application.
// pre-loader create a loader.
//null stat;


$(document).ready(function(){

	function OrganMake(name, kind, absorb, capacity) {
	this.named = name;
	this.kind = kind;
	this.absorb = absorb;
	this.capacity = capacity;
}

OrganMake.prototype.digest = function(food) {
	this.capacity -= food.capacity;
	return this.absorb.map(function(item){
		return item - food.absorb;
	}).
			reduce(function(previousValue, currentValue, index, array){
				return previousValue + currentValue;
			})
};

var stomach = new OrganMake("stomach", "digester", [0, 1, 2, 3], 2000);
var pizza = new OrganMake("pizza", "food", 1, 200)

var scorer = function(){

}


//placeholder block
	function optionAdd(id, titled, goesTo){
		$("<div>").addClass("option").text(titled).attr('id', id).appendTo(".mainopts");
		$("#" + id).on("click", function(){
			goesTo();
		})
	};
	var init = function(){
	alert("This is where the new game would go, just saying");
	}
	var scenarios = function(){
	alert("Scenarios: Seafood Buffet, 21st Birthday, Street Food Adventure")
	};
	var credits = function(){
	alert("Zaal and Duncan made this, hold your applause");
	}
	var options = function(){
	alert("Sound on/off and High Scores");
	}

	function mainMenuRet(){
		function init(){
		//placeholder menu functions
		var init = function(){
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
		$("<section>").addClass("title").appendTo("body");
		$("<section>").addClass("mainopts").appendTo("body");
		$("<h1>").addClass("titletext").appendTo(".title");
		$(".titletext").text("Gut Feeling")
		optionAdd("newgame", "New Game", init);  //pass as function, without calling;
		optionAdd("scenarios", "Scenarios", scenarios);
		optionAdd("credits", "Credits", credits);
		optionAdd("options", "Options", options);
		}
		return {
			init: init
		};
	}

var titleScreen = mainMenuRet();
titleScreen.init();
}); //document ready end