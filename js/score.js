
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

var testTurn = scoreUpdate(testFood, testMod, testSlider, nutrientTotals, sliderMax);
testTurn.getNewTotal();
testTurn.getOldTotal();
testTurn.update();
