function outputUpdate(item, tag) {

document.querySelector(tag).value = item;
	var score = $("#score").text();
var newTotal = parseInt(score, 10) - 1;
	$("#score").text(newTotal);
	
	if ($("#score").text() == -1){
			alert("you died of stomach illness!");
			$("body").empty();
			$("<p>").appendTo("body").text("The food exploded out of your stomach, much like in Alien. You are dead. Press reload to try again.");
			gameover = true;
	}
}


$( document).ready(function() {
	

	//utility functions)

function randomizer (min, max){
	return Math.floor(Math.random()*((max-min) +1)) + min;
}


masterArr = {
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



//adds nutrients to body after calculating absorbption efficiency and base food values


//stat order is AP, C, S, F PP, FI, V, C these are examples but not tests
var body = new AssetMake ("body", "Player Name", "body.jpg", [0,0,0,0,0,0]);
masterArr.body = masterArr.body[0];
var gCheese = new AssetMake("food", "Grilled Cheese", "gcheese.jpg", [5,1,1,1,1]);
var pie = new AssetMake ("food", "Apple Pie", "apie.jpg", [1,1,1,1,5]);
var pizza = new AssetMake ("food", "Pizza", "pizza.jpg", [1,1,5,1,1]);



//moving a slider up or down costs one nutrient, nutrients are given back to the player on the basis of how close the sliders are to the food value

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
	  var newTotal = (item) - 
  food.stats[masterArr.nutrientNames[index]];
	  if(item){
		   var points = Math.abs(newTotal) - baseAbsorb;
	 var finalist = Math.abs(points);
 $("#score").text(parseInt($("#score").text()) + finalist);
	  }
				 });
}

 //counter function
function countDown(){
  var counter = 4;
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




//every upgrade doubles the price of both itself and any other upgrades.
$(".upgrade1").click(function(){
	var curScore = parseInt($("#score").text());
	if (curScore > baseUpCost){	$("#score").text(parseInt($("#score").text()) - baseUpCost);
		baseAbsorb += 5;
		baseUpCost = (baseUpCost * 2);
		$("#rate").text(baseAbsorb);
		$(".upgrade1").text("Upgrade Nutrient Absorbtion (cost of " + baseUpCost + ")");	$(".upgrade2").text("Upgrade Slider Capacity (cost of " + baseUpCost + ")");
	}
});

$(".upgrade2").click(function(){
	var curScore = parseInt($("#score").text());
	if (curScore > baseUpCost){	$("#score").text(parseInt($("#score").text()) - baseUpCost);
		$("input").attr("max", 15).val(15);
$("output").val(15);
		baseUpCost = (baseUpCost * 2);
							   $(".upgrade1").text("Upgrade Nutrient Absorbtion (cost of " + baseUpCost + ")");
		$(".upgrade2").text("Upgrade Slider Capacity (cost of " + baseUpCost + ")");
	}
});



var gameOver = false;
while(gameOver){
	break;
}
countDown();

});
