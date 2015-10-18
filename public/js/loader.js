'use strict';
var gutFeeling =  gutFeeling || {};

/**
 * Application loading and screen
 */
gutFeeling.Loader = function Loader() {
	this.templates = [];
	this.music = [];
	this.sfx = [];
	this.icons = [];

};
gutFeeling.Loader();
gutFeeling.Loader.load = function load() {
	var loader, music_ichiban, tmpl_html, icons_src;
    
    loader = new this();

	// Audio loading.
	music_ichiban = new buzz.sound("/audio/guineo_feat_kristina_maier-expectacion.mp3");
	// var music_ichiban = new buzz.sound("/audio/guineo-metamorfosis.mp3");

	// OUR HTML TEMPLATES Loading
	tmpl_html = [];
	$.get("/view/control_column.txt", function(data){ tmpl_html.control_column = data; });
	$.get("/view/meal.txt", function(data){ tmpl_html.meal_one = data; });
	$.get("/view/body.txt", function(data){ tmpl_html.body = data; });
	$.get("/view/other.txt", function(data){ tmpl_html.other = data; });
	$.get("/view/bar_heads_up.txt", function(data){ tmpl_html.bar_heads_up = data; });

	// OUR ICON IMG ASSETS Loading
	icons_src;
	$.getJSON("js/icons.json", function(data, status, jqXHR) { icons_src = data; });

	loader.music.push({ ichiban: tmpl_html });
	loader.templates = tmpl_html;
	loader.icons = icons_src;

};
