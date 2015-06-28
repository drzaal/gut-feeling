$(function() {
  $("#loader").hide();
  setInterval( main, 30 );
});

var main = function() {
  $("body").click(function(event){
    $("#loader").show();  
    $("#header,#footer").text("Fuck it, have some Olivia Thirlby");
  });
}
